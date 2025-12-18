import { inngest } from '../client';
import { prisma } from '@/lib/db';
import { createAgent, openai } from '@inngest/agent-kit';
import { getAuthenticatedOctokit } from '@/lib/github/appAuth';

export const generateAIResponse = inngest.createFunction(
  { id: 'ai-generate-response' },
  { event: 'ai/generate-response' },
  async ({ event, step }) => {
    const { projectId } = event.data;

    const project = await step.run('fetch-project', async () => {
      return prisma.project.findUnique({
        where: { id: projectId },
        include: {
          repository: {
            include: { installation: true },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: { fragment: true },
          },
        },
      });
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Get repository context if available
    let repoContext = '';
    if (project.repository) {
      const octokit = getAuthenticatedOctokit(
        parseInt(project.repository.installation.installationId)
      );

      // Fetch README if exists
      try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/readme', {
          owner: project.repository.ownerLogin,
          repo: project.repository.name,
        });

        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        repoContext = `Current README:\n${content}`;

        // Update repository with README info
        await prisma.repository.update({
          where: { id: project.repository.id },
          data: {
            hasReadme: true,
            readmeSha: data.sha,
          },
        });
      } catch (_) {
        repoContext = 'No existing README found.';
      }
    }

    const systemPrompt = `You are an expert technical writer specializing in creating comprehensive, well-structured README files for GitHub repositories.

    ${project.repository ? `Repository: ${project.repository.fullName}
    Description: ${project.repository.description || 'No description provided'}
    Language: ${project.repository.language || 'Unknown'}

    ${repoContext}` : ''}

    Your task is to help create or update the README. Always provide:
    1. Clear, structured Markdown
    2. Proper sections (Installation, Usage, Features, etc.)
    3. Code examples when relevant
    4. Professional tone

    When generating README content, wrap it in a special marker:
    <README>
    ...your markdown here...
    </README>`;

    const readmeAgent = createAgent({
      name: 'readme-writer',
      system: systemPrompt,
      model: openai({
        model: "o4-mini",
        apiKey: process.env.AZURE_OPENAI_API_KEY!,
        baseUrl: process.env.AZURE_OPENAI_ENDPOINT!,
        defaultParameters: { temperature: 1 },
      }),
    });

    // Build conversation history (exclude the system prompt and first message)
    const conversationHistory = project.messages
      .map(msg => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      }));

    // Get the latest user message
    const latestMessage = conversationHistory[conversationHistory.length - 1];
    
    // Pass previous messages as context to the agent
    const { output } = await step.run('generate-readme', async () => {
      return readmeAgent.run(
        `${latestMessage.content}, history: ${conversationHistory.slice(0, -1)}`
      );
    });

    const content = JSON.stringify(output);

    // Extract README fragment if present
    const readmeMatch = content.match(/<README>([\s\S]*?)<\/README>/);
    const readmeContent = readmeMatch ? readmeMatch[1].trim() : null;

    await step.run('save-response', async () => {
      const message = await prisma.message.create({
        data: {
          projectId,
          content,
          role: 'ASSISTANT',
          type: 'RESULT',
          model: 'o4-mini',
        },
      });

      // Save README fragment if extracted
      if (readmeContent) {
        await prisma.fragment.create({
          data: {
            messageId: message.id,
            readme: readmeContent,
          },
        });
      }

      return message;
    });

    return { success: true, output };
  }
);

const SupportedModels = [
  {
    model: "gpt-4.1",
    defaultParameters: {temprature: 0.7},
    performance: {
      qualityIndex: 0.83,
      saftey: 9.83,
      tps: 95,
      cost: 3.5
    },
    toolCalling: true
  },
  {
    model: "gpt-5-nano",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.83,
      saftey: 1.67,
      tps: 224,
      cost: 0.14
    },
    toolCalling: true
  },
  {
    model: "gpt-5-mini",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.89,
      saftey: 0.53,
      tps: 127,
      cost: 0.69
    },
    toolCalling: true
  },
  {
    model: "gpt-5.1-chat",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.90,
      saftey: 0.34,
      tps: 76,
      cost: 3.44
    },
    toolCalling: true
  },
  {
    model: "gpt-5.2-chat",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.83,
      saftey: 9.83,
      tps: 95,
      cost: 3.5
    },
    toolCalling: true
  },
  {
    model: "o4-mini",
    defaultParameters: {temprature: 1},
    performance: {
      qualityIndex: 0.89,
      saftey: 2.33,
      tps: 52,
      cost: 1.93
    },
    toolCalling: true
  }
];