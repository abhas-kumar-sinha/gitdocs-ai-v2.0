import { prisma } from '@/lib/db';
import { inngest } from '../client';
import type { Octokit } from '@octokit/rest';
import { lastAssistantTextMessage } from '../utils';
import { Repository } from '@/generated/prisma/client';
import { createAgent, openai } from '@inngest/agent-kit';
import { getInstallationOctokit } from '@/lib/github/appAuth';
import { contextDiscoveryPrompt, readmeGeneratePrompt } from '@/lib/prompts/PROMPTS';
import { type ModelConfig, type RepositorySnapshot, type GitHubTreeItem, type FileContext, type ContextDiscoveryResult } from '@/types/readmeAi'

// ============= MODEL CONFIGS =============

const Models = {
  contextDiscovery: { model: "gpt-5-mini", temp: 1 },
  readmeGeneration: {
    fast: { model: "gpt-5-nano", temp: 1 },
    balanced: { model: "gpt-5-mini", temp: 1 },
    quality: { model: "o4-mini", temp: 1 },
  }
};

function selectReadmeModel(template: string): ModelConfig {
  if (['minimal', 'hackathon'].includes(template)) return Models.readmeGeneration.fast;
  if (['documentation', 'monorepo'].includes(template)) return Models.readmeGeneration.quality;
  return Models.readmeGeneration.balanced;
}

// ============= REPOSITORY ANALYZER =============

async function analyzeRepository(
  repo: Repository,
  octokit: Octokit
): Promise<RepositorySnapshot> {
  const snapshot: RepositorySnapshot = {
    fullName: repo.fullName,
    description: repo.description,
    language: repo.language,
    topics: repo.topics || [],
    stars: repo.stargazers || 0,
    forks: repo.forks || 0,
    hasReadme: false,
    existingReadme: null,
    allFiles: [],
    totalFiles: 0,
    directories: [],
    fileTypes: {},
    frameworks: [],
    features: {
      tests: false,
      docker: false,
      docs: false,
      ci: false,
    },
  };

  // Check for existing README
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner: repo.ownerLogin,
      repo: repo.name,
    });
    snapshot.hasReadme = true;
    snapshot.existingReadme = Buffer.from(data.content, 'base64').toString('utf-8');
    
    await prisma.repository.update({
      where: { id: repo.id },
      data: { hasReadme: true, readmeSha: data.sha },
    });
  } catch {
    snapshot.hasReadme = false;
  }

  // Analyze structure
  try {
    const { data: tree } = await octokit.rest.git.getTree({
      owner: repo.ownerLogin,
      repo: repo.name,
      tree_sha: repo.defaultBranch,
      recursive: '1',
    });

    const files = tree.tree
      .filter((item: GitHubTreeItem): item is GitHubTreeItem & { path: string } => 
        item.type === 'blob' && typeof item.path === 'string'
      )
      .map((item) => item.path);

    snapshot.totalFiles = files.length;
    snapshot.allFiles = files;

    // Extract directories and file types
    const dirSet = new Set<string>();
    files.forEach((path: string) => {
      const ext = path.split('.').pop() || 'no-ext';
      snapshot.fileTypes[ext] = (snapshot.fileTypes[ext] || 0) + 1;
      
      const dir = path.split('/')[0];
      if (dir && !path.includes('.')) dirSet.add(dir);
    });

    snapshot.directories = Array.from(dirSet).slice(0, 20);

    // Detect frameworks
    if (files.some((p: string) => p.includes('package.json'))) snapshot.frameworks.push('Node.js');
    if (files.some((p: string) => p.includes('requirements.txt'))) snapshot.frameworks.push('Python');
    if (files.some((p: string) => p.includes('Cargo.toml'))) snapshot.frameworks.push('Rust');
    if (files.some((p: string) => p.includes('go.mod'))) snapshot.frameworks.push('Go');
    if (files.some((p: string) => p.includes('next.config'))) snapshot.frameworks.push('Next.js');
    if (files.some((p: string) => p.includes('vite.config'))) snapshot.frameworks.push('Vite');
    if (files.some((p: string) => p.includes('tsconfig.json'))) snapshot.frameworks.push('TypeScript');

    // Detect features
    snapshot.features.tests = files.some((p: string) => p.includes('test') || p.includes('spec'));
    snapshot.features.docker = files.some((p: string) => p.includes('Dockerfile'));
    snapshot.features.docs = files.some((p: string) => p.includes('docs/'));
    snapshot.features.ci = files.some((p: string) => p.includes('.github/workflows'));
  } catch (err) {
    console.error('Failed to analyze repository structure:', err);
  }

  return snapshot;
}

// ============= CONTEXT DISCOVERY AGENT =============

async function discoverContextFiles(
  snapshot: RepositorySnapshot,
  template: string,
): Promise<ContextDiscoveryResult> {
  const systemPrompt = contextDiscoveryPrompt(snapshot, template);

  const agent = createAgent({
    name: 'context-discovery',
    system: systemPrompt,
    model: openai({
      model: Models.contextDiscovery.model,
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      baseUrl: process.env.AZURE_OPENAI_ENDPOINT!,
      defaultParameters: { 
        temperature: Models.contextDiscovery.temp,
      },
    }),
  });

  const result = await agent.run('Analyze this repository and identify essential files for README generation.');
  const output = lastAssistantTextMessage(result);

  try {
    const parsed = JSON.parse(output || '{}');
    return {
      requiredFiles: parsed.requiredFiles || [],
      reasoning: parsed.reasoning || 'Auto-selected based on repository structure',
      estimatedTokens: parsed.estimatedTokens || 0,
    };
  } catch {
    // Fallback: smart defaults based on frameworks
    const defaultFiles: string[] = [];
    
    if (snapshot.frameworks.includes('Node.js')) defaultFiles.push('package.json');
    if (snapshot.frameworks.includes('Python')) defaultFiles.push('requirements.txt');
    if (snapshot.frameworks.includes('Rust')) defaultFiles.push('Cargo.toml');
    if (snapshot.frameworks.includes('Go')) defaultFiles.push('go.mod');
    
    return {
      requiredFiles: defaultFiles,
      reasoning: 'Fallback selection based on detected frameworks',
      estimatedTokens: 2000,
    };
  }
}

// ============= FILE FETCHER =============

async function fetchContextFiles(
  filePaths: string[],
  octokit: Octokit,
  repo: Repository
): Promise<FileContext[]> {
  const contexts: FileContext[] = [];

  for (const path of filePaths) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: repo.ownerLogin,
        repo: repo.name,
        path: path,
      });

      if ('content' in data && typeof data.content === 'string') {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        const size = data.size || 0;

        // Full content for small files, summary for large ones
        if (size < 15000) {
          contexts.push({
            path,
            content,
            type: 'full',
            size,
          });
        } else {
          contexts.push({
            path,
            content: content.substring(0, 3000) + '\n\n... [truncated, file too large]',
            type: 'summary',
            size,
          });
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${path}:`, err);
    }
  }

  return contexts;
}

// ============= MAIN FUNCTION =============

export const initialReadmeBuild = inngest.createFunction(
  { 
    id: 'readme-initial-build',
    concurrency: { limit: 5 },
  },
  { event: 'readme/initial.build' },
  async ({ event, step }) => {
    const { projectId } = event.data;

    // ========== STEP 1: Fetch Project ==========
    const project = await step.run('fetch-project', async () => {
      const proj = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          repository: {
            include: { installation: true },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!proj) throw new Error('Project not found');
      return proj;
    });

    if (!project.repository) {
      throw new Error('No repository linked to this project');
    }

    // ========== STEP 2: Get Octokit ==========
    const octokit = await getInstallationOctokit(
        parseInt(project.repository!.installation.installationId)
      );

    // ========== STEP 3: Analyze Repository ==========
    const snapshot = await step.run('analyze-repository', async () => {
      return await analyzeRepository(project.repository! as unknown as Repository, octokit as unknown as Octokit);
    });

    // ========== STEP 4: Discover Context Files with Agent ==========
    const contextDiscovery = await discoverContextFiles(
        snapshot,
        project.template || 'standard'
      );

    // ========== STEP 5: Fetch and Store Context Files and All Files ==========
    const contextFiles = await step.run('fetch-context-files', async () => {
      const files = await fetchContextFiles(
        contextDiscovery.requiredFiles,
        octokit as unknown as Octokit,
        project.repository! as unknown as Repository
      );

      // Store in database for future use
      await prisma.project.update({
        where: { id: projectId },
        data: {
          allFiles: snapshot.allFiles,
          contextFiles: contextDiscovery.requiredFiles,
        },
      });

      return files;
    });

    // ========== STEP 6: Build README with Agent ==========
    const selectedModel = selectReadmeModel(project.template || 'standard');
    
    const systemPrompt = readmeGeneratePrompt(snapshot, project.template || 'standard', contextFiles, contextDiscovery.reasoning);

    const agent = createAgent({
      name: 'readme-architect',
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

    const userMessage = project.messages[0]?.content || 'Generate a comprehensive README for this project.';
    const agentResult = await agent.run(userMessage);

    // ========== STEP 7: Parse and Save ==========
    const result = await step.run('parse-and-save', async () => {
      const fullOutput = lastAssistantTextMessage(agentResult);

      const thinkingMatch = fullOutput?.match(/<THINKING>([\s\S]*?)<\/THINKING>/);
      const summaryMatch = fullOutput?.match(/<SUMMARY>([\s\S]*?)<\/SUMMARY>/);
      const readmeMatch = fullOutput?.match(/<README>([\s\S]*?)<\/README>/);

      const thinking = thinkingMatch?.[1].trim() || null;
      const summary = summaryMatch?.[1].trim() || 'README generated successfully!';
      const readme = readmeMatch?.[1].trim() || fullOutput || '';

      // Save message
      const message = await prisma.message.create({
        data: {
          projectId,
          content: summary,
          role: 'ASSISTANT',
          type: 'RESULT',
          model: selectedModel.model,
        },
      });

      // Save README fragment
      await prisma.fragment.create({
        data: {
          messageId: message.id,
          readme: readme,
        },
      });

      return {
        messageId: message.id,
        thinking,
        summary,
        contextFilesUsed: contextFiles.length,
      };
    });

    return {
      success: true,
      messageId: result.messageId,
      template: project.template,
      contextFilesUsed: result.contextFilesUsed,
      thinking: result.thinking,
    };
  }
);