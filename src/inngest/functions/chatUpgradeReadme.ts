import { prisma } from '@/lib/db';
import { inngest } from '../client';
import type { Octokit } from '@octokit/rest';
import { lastAssistantTextMessage } from '../utils';
import { Repository } from '@/generated/prisma/client';
import { createAgent, openai } from '@inngest/agent-kit';
import { readmeUpgradePrompt } from '@/lib/prompts/PROMPTS';
import { getInstallationOctokit } from '@/lib/github/appAuth';
import { type ModelConfig, type FileContext, type ConversationMessage } from '@/types/readmeAi';

const getTodayDate = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

// ============= MODEL CONFIGS =============

const Models = {
  chatUpgrade: {
    fast: { model: "gpt-5-nano", temp: 1 },
    balanced: { model: "gpt-5-mini", temp: 1 },
    quality: { model: "o4-mini", temp: 1 },
  }
};

function selectChatModel(complexity: 'simple' | 'moderate' | 'complex'): ModelConfig {
  if (complexity === 'simple') return Models.chatUpgrade.fast;
  if (complexity === 'complex') return Models.chatUpgrade.quality;
  return Models.chatUpgrade.balanced;
}

// ============= COMPLEXITY ANALYZER =============

function analyzeRequestComplexity(userMessage: string): 'simple' | 'moderate' | 'complex' {
  const lowerMsg = userMessage.toLowerCase();
  
  // Simple: typo fixes, small tweaks, formatting
  const simpleKeywords = ['fix typo', 'change', 'update', 'add badge', 'remove', 'bold', 'italics'];
  if (simpleKeywords.some(kw => lowerMsg.includes(kw)) && userMessage.length < 100) {
    return 'simple';
  }
  
  // Complex: restructure, multiple sections, add examples, architecture
  const complexKeywords = ['restructure', 'rewrite', 'add section', 'architecture', 'diagram', 'comprehensive'];
  if (complexKeywords.some(kw => lowerMsg.includes(kw))) {
    return 'complex';
  }
  
  return 'moderate';
}

// ============= DETERMINE IF NEW FILES NEEDED =============

function needsAdditionalFiles(userMessage: string): boolean {
  const lowerMsg = userMessage.toLowerCase();
  
  // Check if user is asking for info that might require new files
  const fileHints = [
    'add api docs',
    'include endpoints',
    'add configuration',
    'deployment',
    'docker',
    'environment variables',
    'database schema',
    'add tests section',
  ];
  
  return fileHints.some(hint => lowerMsg.includes(hint));
}

// ============= FETCH ADDITIONAL FILES =============

async function fetchAdditionalContextFiles(
  userMessage: string,
  existingFiles: string[],
  octokit: Octokit,
  repo: Repository
): Promise<FileContext[]> {
  const lowerMsg = userMessage.toLowerCase();
  const newFilesToFetch: string[] = [];
  
  // Smart file detection based on user request
  if (lowerMsg.includes('api') && !existingFiles.some(f => f.includes('routes') || f.includes('controllers'))) {
    newFilesToFetch.push('src/routes/index.ts', 'src/api/routes.ts', 'routes/index.js');
  }
  
  if (lowerMsg.includes('docker') && !existingFiles.some(f => f.includes('Docker'))) {
    newFilesToFetch.push('Dockerfile', 'docker-compose.yml');
  }
  
  if (lowerMsg.includes('environment') && !existingFiles.some(f => f.includes('.env'))) {
    newFilesToFetch.push('.env.example', '.env.sample');
  }
  
  if (lowerMsg.includes('test') && !existingFiles.some(f => f.includes('test'))) {
    newFilesToFetch.push('jest.config.js', 'vitest.config.ts', 'tests/setup.ts');
  }

  const contexts: FileContext[] = [];
  
  for (const path of newFilesToFetch) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: repo.ownerLogin,
        repo: repo.name,
        path: path,
      });

      if ('content' in data && typeof data.content === 'string') {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        const size = data.size || 0;

        contexts.push({
          path,
          content: size < 15000 ? content : content.substring(0, 3000) + '\n\n... [truncated]',
          type: size < 15000 ? 'full' : 'summary',
          size,
        });
      }
    } catch {
      // File doesn't exist, continue
      continue;
    }
  }

  return contexts;
}

// ============= LOAD EXISTING CONTEXT =============

async function loadExistingContext(
  projectId: string,
  octokit: Octokit,
  repo: Repository
): Promise<FileContext[]> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { contextFiles: true },
  });

  if (!project || !project.contextFiles || project.contextFiles.length === 0) {
    return [];
  }

  const contexts: FileContext[] = [];

  for (const path of project.contextFiles) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: repo.ownerLogin,
        repo: repo.name,
        path: path,
      });

      if ('content' in data && typeof data.content === 'string') {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        const size = data.size || 0;

        contexts.push({
          path,
          content: size < 15000 ? content : content.substring(0, 3000) + '\n\n... [truncated]',
          type: size < 15000 ? 'full' : 'summary',
          size,
        });
      }
    } catch (err) {
      console.error(`Failed to fetch ${path}:`, err);
    }
  }

  return contexts;
}

// ============= MAIN FUNCTION =============

export const chatUpgradeReadme = inngest.createFunction(
  { 
    id: 'readme-chat-upgrade',
    concurrency: { limit: 10 },
  },
  { event: 'readme/chat.upgrade' },
  async ({ event, step }) => {
    const { projectId, messageId, userId } = event.data;

    const access = await step.run('check-access', async () => {
      const today = getTodayDate();
      
      // Try to find today's usage
      let usage = await prisma.aiUsage.findUnique({
        where: {
          userId_date: {
            userId: userId,
            date: today,
          },
        },
      });

      // If no usage exists for today, create one
      if (!usage) {
        usage = await prisma.aiUsage.create({
          data: {
            userId: userId,
            date: today,
            count: 0,
            maxCount: 5,
          },
        });
      }

      if (usage.maxCount - usage.count > 0) {
        return true
      }
      
      return false
    })

    if (!access) {
      // Save assistant message
      const message = await prisma.message.create({
        data: {
          projectId,
          content: "You’re all set for today \nYou’ve reached today’s usage limit.\nNew credits will be available tomorrow. \nTake a break — we’ll be ready when you’re back 🙂",
          role: 'ASSISTANT',
          type: 'ERROR',
          model: "",
        },
      });

      return {
        message
      }
    }

    // ========== STEP 1: Fetch Project with Full Context ==========
    const project = await step.run('fetch-project-context', async () => {
      const proj = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          repository: {
            include: { installation: true },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              fragment: true,
            },
          },
        },
      });

      if (!proj) throw new Error('Project not found');
      if (!proj.repository) throw new Error('No repository linked');
      
      return proj;
    });

    // ========== STEP 2: Get Octokit ==========
    const octokit = await getInstallationOctokit(
      parseInt(project.repository!.installation.installationId)
    );

    // ========== STEP 3: Find User Message ==========
    const userMessage = await step.run('get-user-message', async () => {
      const msg = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!msg || msg.role !== 'USER') {
        throw new Error('Invalid message or not a user message');
      }

      return msg.content;
    });

    // ========== STEP 4: Analyze Request Complexity ==========
    const complexity = analyzeRequestComplexity(userMessage);
    const selectedModel = selectChatModel(complexity);

    // ========== STEP 5: Load Existing Context Files ==========
    const existingContext = await step.run('load-existing-context', async () => {
      return await loadExistingContext(
        projectId,
        octokit as unknown as Octokit,
        project.repository! as unknown as Repository
      );
    });

    // ========== STEP 6: Fetch Additional Files if Needed ==========
    const additionalContext = await step.run('fetch-additional-files', async () => {
      if (!needsAdditionalFiles(userMessage)) {
        return [];
      }

      const existingPaths = project.contextFiles || [];
      return await fetchAdditionalContextFiles(
        userMessage,
        existingPaths,
        octokit as unknown as Octokit,
        project.repository! as unknown as Repository
      );
    });

    // Combine contexts
    const allContext = [...existingContext, ...additionalContext];

    // ========== STEP 7: Build Conversation History ==========
    const conversationHistory: ConversationMessage[] = project.messages
      .slice(0, -1) // Exclude the current user message
      .map(msg => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      }));

    // Get the most recent README
    const latestReadme = project.messages
      .slice()
      .reverse()
      .find(msg => msg.fragment?.readme)?.fragment?.readme || '';

    // ========== STEP 8: Prepare System Prompt ==========
    const systemPrompt = readmeUpgradePrompt(
      latestReadme,
      allContext,
      conversationHistory,
      project.template || 'standard'
    );

    // ========== STEP 9: Run Upgrade Agent ==========
    const agent = createAgent({
      name: 'readme-upgrade-assistant',
      system: systemPrompt,
      model: openai({
        model: selectedModel.model,
        apiKey: process.env.AZURE_OPENAI_API_KEY!,
        baseUrl: process.env.AZURE_OPENAI_ENDPOINT!,
        defaultParameters: { 
          temperature: selectedModel.temp,
        },
      }),
    });

    const agentResult = await agent.run(userMessage);

    // ========== STEP 10: Parse and Save Response ==========
    const result = await step.run('parse-and-save-upgrade', async () => {
      const fullOutput = lastAssistantTextMessage(agentResult);

      // Parse structured output
      const thinkingMatch = fullOutput?.match(/<THINKING>([\s\S]*?)<\/THINKING>/);
      const summaryMatch = fullOutput?.match(/<SUMMARY>([\s\S]*?)<\/SUMMARY>/);
      const readmeMatch = fullOutput?.match(/<README>([\s\S]*?)<\/README>/);

      const thinking = thinkingMatch?.[1].trim() || null;
      const summary = summaryMatch?.[1].trim() || 'README updated successfully!';
      const readme = readmeMatch?.[1].trim() || fullOutput || '';

      // Save assistant message
      const message = await prisma.message.create({
        data: {
          projectId,
          content: summary,
          role: 'ASSISTANT',
          type: 'RESULT',
          model: selectedModel.model,
        },
      });

      // Save updated README fragment
      await prisma.fragment.create({
        data: {
          messageId: message.id,
          readme: readme,
        },
      });

      // Update context files if we added new ones
      if (additionalContext.length > 0) {
        const newContextPaths = additionalContext.map(ctx => ctx.path);
        const updatedContextFiles = [
          ...(project.contextFiles || []),
          ...newContextPaths,
        ];

        await prisma.project.update({
          where: { id: projectId },
          data: {
            contextFiles: updatedContextFiles,
          },
        });
      }

      const today = getTodayDate();

      // Upsert: increment count if exists, create if doesn't
      const usage = await prisma.aiUsage.upsert({
        where: {
          userId_date: {
            userId: userId,
            date: today,
          },
        },
        update: {
          count: { increment: 1 }
        },
        create: {
          userId: userId,
          date: today,
          count: 1,
          maxCount: 5,
        },
      });

      return {
        messageId: message.id,
        thinking,
        summary,
        complexity,
        additionalFilesUsed: additionalContext.length,
        usage
      };
    });

    return {
      success: true,
      messageId: result.messageId,
      complexity: result.complexity,
      model: selectedModel.model,
      additionalFilesUsed: result.additionalFilesUsed,
      thinking: result.thinking,
    };
  }
);