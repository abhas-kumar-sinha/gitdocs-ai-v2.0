import { inngest } from '../client';
import { prisma } from '@/lib/db';
import { createAgent, openai } from '@inngest/agent-kit';
import { getInstallationOctokit } from '@/lib/github/appAuth';
import { lastAssistantTextMessage } from '../utils';

// ============= TEMPLATE SYSTEM PROMPTS =============

const TEMPLATE_PROMPTS = {
  minimal: `Create a MINIMALIST README with:
- Brief description (1-2 sentences)
- Quick installation (one command)
- Basic usage example
- License
Keep it clean and simple.`,

  standard: `Create a STANDARD OPEN SOURCE README with:
- Project badges (build, version, license)
- Clear description with key features
- Installation instructions
- Usage examples with code blocks
- Contributing guidelines
- License`,

  api: `Create a BACKEND API SERVICE README with:
- API endpoint documentation
- Authentication setup
- Environment variables
- Request/response examples
- Docker deployment
- Database schema`,

  'data-science': `Create a DATA SCIENCE README with:
- Problem statement
- Dataset description
- Dependencies with versions
- Model architecture
- Training instructions
- Results and metrics`,

  documentation: `Create a DOCUMENTATION README with:
- Table of contents
- Architecture overview
- Detailed API reference
- Multiple usage examples
- Configuration options
- Troubleshooting section`,

  monorepo: `Create a MONOREPO README with:
- Repository architecture
- Package listing
- Shared dependencies
- Development workflow
- Build commands per package`,

  hackathon: `Create a HACKATHON README with:
- Eye-catching name and tagline
- Problem statement
- Screenshots/GIFs
- Tech stack badges
- Quick start (<5 min)
- Demo link
- Team credits`
};

// ============= OPTIMIZED MODEL SELECTOR =============

const SupportedModels = {
  fast: { model: "gpt-5-nano", temp: 1, cost: 0.14 },
  balanced: { model: "gpt-5-mini", temp: 1, cost: 0.69 },
  quality: { model: "o4-mini", temp: 1, cost: 1.93 },
};

function selectModel(template: string) {
  if (['minimal', 'hackathon'].includes(template)) return SupportedModels.fast;
  if (['documentation', 'monorepo'].includes(template)) return SupportedModels.quality;
  return SupportedModels.balanced;
}

// ============= SMART CONTEXT BUILDER =============

async function buildComprehensiveContext(project: any, octokit: any) {
  const repo = project.repository;
  
  if (!repo || !octokit) {
    return { hasRepo: false, context: '' };
  }

  let context = `REPOSITORY: ${repo.fullName}
Description: ${repo.description || 'No description'}
Language: ${repo.language || 'Unknown'}
Topics: ${repo.topics.join(', ') || 'None'}
Stars: ${repo.stargazers} | Forks: ${repo.forks}
Homepage: ${repo.homepage || 'None'}\n\n`;

  // 1. Fetch existing README (if any)
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner: repo.ownerLogin,
      repo: repo.name,
    });
    const existingReadme = Buffer.from(data.content, 'base64').toString('utf-8');
    context += `EXISTING README:\n${existingReadme.substring(0, 3000)}\n\n`;
    
    await prisma.repository.update({
      where: { id: repo.id },
      data: { hasReadme: true, readmeSha: data.sha },
    });
  } catch {
    context += `NO EXISTING README (Creating from scratch)\n\n`;
  }

  // 2. Fetch repository structure
  try {
    const { data: tree } = await octokit.rest.git.getTree({
      owner: repo.ownerLogin,
      repo: repo.name,
      tree_sha: repo.defaultBranch,
      recursive: '1',
    });
    
    const files = tree.tree
      .filter((item: any) => item.type === 'blob')
      .map((item: any) => item.path);

    // Analyze structure
    const fileTypes: Record<string, number> = {};
    const directories = new Set<string>();
    
    files.forEach(path => {
      const ext = path.split('.').pop() || 'no-ext';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      const dir = path.split('/')[0];
      if (dir) directories.add(dir);
    });

    // Detect frameworks
    const frameworks = [];
    if (files.some(p => p.includes('package.json'))) frameworks.push('Node.js');
    if (files.some(p => p.includes('requirements.txt'))) frameworks.push('Python');
    if (files.some(p => p.includes('Cargo.toml'))) frameworks.push('Rust');
    if (files.some(p => p.includes('go.mod'))) frameworks.push('Go');
    if (files.some(p => p.includes('next.config'))) frameworks.push('Next.js');
    if (files.some(p => p.includes('vite.config'))) frameworks.push('Vite');
    if (files.some(p => p.includes('tsconfig.json'))) frameworks.push('TypeScript');

    // Detect features
    const features = {
      tests: files.some(p => p.includes('test') || p.includes('spec')),
      docker: files.some(p => p.includes('Dockerfile')),
      docs: files.some(p => p.includes('docs/')),
      ci: files.some(p => p.includes('.github/workflows')),
    };

    context += `PROJECT STRUCTURE:
    Total files: ${files.length}
    Main directories: ${Array.from(directories).slice(0, 15).join(', ')}
    Top file types: ${Object.entries(fileTypes).slice(0, 8).map(([k,v]) => `${k}(${v})`).join(', ')}
    Detected frameworks: ${frameworks.join(', ')}
    Has tests: ${features.tests}
    Has Docker: ${features.docker}
    Has CI/CD: ${features.ci}\n\n`;

    // 3. Fetch key config files
    const configFiles = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod'];
    
    for (const file of configFiles) {
      const match = files.find(f => f === file);
      if (match) {
        try {
          const { data } = await octokit.rest.repos.getContent({
            owner: repo.ownerLogin,
            repo: repo.name,
            path: file,
          });
          
          if ('content' in data) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            try {
              const parsed = JSON.parse(content);
              if (file === 'package.json') {
                context += `PACKAGE INFO:
                Name: ${parsed.name}
                Version: ${parsed.version}
                Description: ${parsed.description || 'None'}
                Main dependencies: ${Object.keys(parsed.dependencies || {}).slice(0, 10).join(', ')}
                Scripts: ${Object.keys(parsed.scripts || {}).join(', ')}\n\n`;
              }
            } catch {
              context += `${file} found but couldn't parse\n\n`;
            }
            break;
          }
        } catch {}
      }
    }

    // 4. Look for important files
    const importantFiles = files.filter(f => 
      f.includes('docker') || 
      f.includes('example') || 
      f.includes('demo') ||
      f.includes('.env.example') ||
      f.includes('LICENSE')
    );
    
    if (importantFiles.length > 0) {
      context += `IMPORTANT FILES: ${importantFiles.slice(0, 10).join(', ')}\n\n`;
    }

  } catch (err) {
    context += `Could not fetch repository structure\n\n`;
  }

  return { hasRepo: true, context };
}

// ============= MAIN AGENT FUNCTION =============

export const generateAIResponse = inngest.createFunction(
  { 
    id: 'ai-generate-response',
    concurrency: { limit: 5 },
  },
  { event: 'ai/generate-response' },
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
            take: 10,
          },
        },
      });

      if (!proj) throw new Error('Project not found');
      return proj;
    });

    // ========== STEP 2: Build Complete Context ==========
    const { context: repoContext } = await step.run('build-context', async () => {
      const octokit = project.repository 
        ? await getInstallationOctokit(parseInt(project.repository.installation.installationId))
        : null;

      return await buildComprehensiveContext(project, octokit);
    });

    // ========== STEP 3: Prepare Agent Configuration ==========
    const agentConfig = await step.run('prepare-agent-config', async () => {
      const template = project.template || 'standard';
      const selectedModel = selectModel(template);
      
      // Build conversation history
      const conversationHistory = project.messages
        .reverse()
        .slice(0, 9)
        .map(msg => ({
          role: msg.role.toLowerCase() as 'user' | 'assistant',
          content: msg.content,
        }));

      const latestMessage = conversationHistory[conversationHistory.length - 1];

      const systemPrompt = `You are an expert README architect with deep knowledge of software documentation best practices.

      === TEMPLATE STYLE ===
      ${TEMPLATE_PROMPTS[template as keyof typeof TEMPLATE_PROMPTS] || TEMPLATE_PROMPTS.standard}

      === REPOSITORY CONTEXT ===
      ${repoContext}

      === CONVERSATION HISTORY ===
      ${conversationHistory.length > 1 ? JSON.stringify(conversationHistory.slice(0, -1)) : 'No previous conversation'}

      === OUTPUT FORMAT (CRITICAL) ===
      You MUST structure your response in THREE sections using XML tags:

      <THINKING>
      Your detailed analysis process (3-5 paragraphs):
      - What information you gathered from the repository
      - Key features and technologies identified
      - What sections you're including and why
      - How you're structuring the README
      - Any decisions you made about emphasis or ordering
      - What makes this README effective for the target audience

      Be thorough and conversational - this helps users understand your approach.
      </THINKING>

      <SUMMARY>
      A friendly, conversational message for the user explaining what you created.

      Format it like this:
      I've created a [template] README for [project name]. Here's what I included:

      • [Key feature 1]
      • [Key feature 2]
      • [Key feature 3]
      • [Key feature 4]

      [Optional: One sentence about anything special or noteworthy]
      </SUMMARY>

      <README>
      The complete README in pristine Markdown format.
      - Use proper heading hierarchy (# ## ###)
      - Include code blocks with language tags
      - Add badges using shields.io format
      - Use tables for structured data
      - Ensure all links are valid
      - Make it production-ready

      This should be copy-paste ready for GitHub.
      </README>

      === QUALITY STANDARDS ===
      - Write clearly and concisely
      - Include practical, runnable examples
      - Add appropriate badges (build, version, license, downloads)
      - Use proper Markdown syntax throughout
      - Follow the template style strictly
      - Make it scannable with good visual hierarchy
      - Include only relevant information
      - Be comprehensive but not overwhelming

      Remember: A great README helps developers understand, install, and use the project within 2 minutes.`;

      return {
        systemPrompt,
        userMessage: latestMessage.content,
        selectedModel,
        template,
      };
    });

    // ========== STEP 4: Create and Run Agent ==========
    
    // Create agent with configuration
    const agent = createAgent({
      name: 'readme-architect',
      system: agentConfig.systemPrompt,
      model: openai({
        model: agentConfig.selectedModel.model,
        apiKey: process.env.AZURE_OPENAI_API_KEY!,
        baseUrl: process.env.AZURE_OPENAI_ENDPOINT!,
        defaultParameters: { 
          temperature: agentConfig.selectedModel.temp,
        },
      }),
    });

    const agentResult = await agent.run(agentConfig.userMessage);
    
    // ========== STEP 5: Parse and Save Response ==========
    const result = await step.run('parse-and-save', async () => {
      const fullOutput = lastAssistantTextMessage(agentResult);

      // Parse structured sections
      const thinkingMatch = fullOutput?.match(/<THINKING>([\s\S]*?)<\/THINKING>/);
      const summaryMatch = fullOutput?.match(/<SUMMARY>([\s\S]*?)<\/SUMMARY>/);
      const readmeMatch = fullOutput?.match(/<README>([\s\S]*?)<\/README>/);

      const thinking = thinkingMatch ? thinkingMatch[1].trim() : null;
      const summary = summaryMatch ? summaryMatch[1].trim() : null;
      const readme = readmeMatch ? readmeMatch[1].trim() : fullOutput;

      // Fallback summary if parsing failed
      const displayMessage = summary || `I've generated a ${agentConfig.template} README for your project. Here are the key sections included:\n\n` +
        `• Project overview and description\n` +
        `• Installation instructions\n` +
        `• Usage examples\n` +
        (agentConfig.template === 'api' ? `• API documentation\n` : '') +
        (agentConfig.template === 'documentation' ? `• Comprehensive reference\n` : '') +
        `\nYou can review it below!`;

      // Save message
      const message = await prisma.message.create({
        data: {
          projectId,
          content: displayMessage,
          role: 'ASSISTANT',
          type: 'RESULT',
          model: agentConfig.selectedModel.model,
        },
      });

      // Save README fragment with metadata
      await prisma.fragment.create({
        data: {
          messageId: message.id,
          readme: readme || "",
        },
      });

      return {
        messageId: message.id,
        readmeContent: readme,
        thinking,
        summary: displayMessage,
        template: agentConfig.template,
      };
    });

    // ========== STEP 6: Optional GitHub Update ==========
    if (project.autoUpdate && project.repository) {
      await step.run('update-github', async () => {
        try {
          const octokit = await getInstallationOctokit(
            parseInt(project.repository!.installation.installationId)
          );

          const repo = project.repository!;
          const readmePath = repo.readmePath || 'README.md';

          let sha: string | undefined;
          try {
            const { data } = await octokit.rest.repos.getContent({
              owner: repo.ownerLogin,
              repo: repo.name,
              path: readmePath,
            });
            if ('sha' in data) sha = data.sha;
          } catch {}

          await octokit.rest.repos.createOrUpdateFileContents({
            owner: repo.ownerLogin,
            repo: repo.name,
            path: readmePath,
            message: `docs: ${sha ? 'Update' : 'Create'} README via AI`,
            content: Buffer.from(result.readmeContent as string).toString('base64'),
            sha,
            branch: repo.defaultBranch,
          });

          await prisma.repository.update({
            where: { id: repo.id },
            data: {
              hasReadme: true,
              lastSyncedAt: new Date(),
              syncStatus: 'completed',
            },
          });

          return { updated: true };
        } catch (err: any) {
          console.error('GitHub update failed:', err);
          return { error: err.message };
        }
      });
    }

    return {
      success: true,
      messageId: result.messageId,
      template: result.template,
      thinking: result.thinking,
      summary: result.summary,
      autoUpdated: project.autoUpdate,
    };
  }
);