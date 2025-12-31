import { prisma } from "@/lib/db";
import { inngest } from "../client";
import type { Octokit } from "@octokit/rest";
import { publishProgress } from "@/lib/redis";
import { lastAssistantTextMessage } from "../utils";
import { Image, Message, Repository } from "@/generated/prisma/client";
import { createAgent, openai } from "@inngest/agent-kit";
import { getInstallationOctokit } from "@/lib/github/appAuth";
import { contextDiscoveryPrompt, readmeGeneratePrompt } from "@/lib/prompts/PROMPTS";
import { type ModelConfig, type RepositorySnapshot, type GitHubTreeItem, type FileContext, type ContextDiscoveryResult } from "@/types/readmeAi";

const getTodayDate = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

// ============= MODEL CONFIGS =============

const Models = {
  contextDiscovery: { model: "gpt-5-mini", temp: 1 },
  readmeGeneration: {
    fast: { model: "gpt-5-nano", temp: 1 },
    balanced: { model: "gpt-5-mini", temp: 1 },
    quality: { model: "o4-mini", temp: 1 },
  },
};

function selectReadmeModel(template: string): ModelConfig {
  if (["minimal", "hackathon"].includes(template))
    return Models.readmeGeneration.fast;
  if (["documentation", "monorepo"].includes(template))
    return Models.readmeGeneration.quality;
  return Models.readmeGeneration.balanced;
}

// ============= ERROR HANDLER =============

async function handleError(
  projectId: string,
  error: unknown,
  stage: string,
  emitProgress: (stage: string, progress: number, message: string, data?: object) => Promise<void>
): Promise<{ message: Message }> {
  console.error(`Error at stage ${stage}:`, error);

  // Determine user-friendly error message
  let userMessage = "Something went wrong. Please try again.";
  
  if (error instanceof Error) {
    const errorMsg = error.message.toLowerCase();
    
    if (errorMsg.includes("project not found")) {
      userMessage = "Project not found. Please refresh and try again.";
    } else if (errorMsg.includes("no repository linked")) {
      userMessage = "No repository is linked to this project. Please connect a repository first.";
    } else if (errorMsg.includes("no installation found")) {
      userMessage = "GitHub App installation not found. Please reinstall the app on your repository.";
    } else if (errorMsg.includes("rate limit") || errorMsg.includes("api rate")) {
      userMessage = "GitHub API rate limit exceeded. Please try again in a few minutes.";
    } else if (errorMsg.includes("not found") && errorMsg.includes("repository")) {
      userMessage = "Repository not found or access denied. Please check your permissions.";
    } else if (errorMsg.includes("authentication") || errorMsg.includes("unauthorized")) {
      userMessage = "Authentication failed. Please reconnect your GitHub account.";
    } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
      userMessage = "Network error occurred. Please check your connection and try again.";
    } else if (errorMsg.includes("timeout")) {
      userMessage = "Request timed out. Your repository might be too large. Please try again.";
    } else if (errorMsg.includes("usage row missing")) {
      userMessage = "Usage tracking error. Please contact support.";
    } else if (stage === "GENERATING_README" || stage === "DISCOVERING_CONTEXT") {
      userMessage = "AI service encountered an error. Please try again.";
    }
  }

  // Emit error progress
  await emitProgress("ERROR", 100, userMessage);

  // Save error message to database
  const message = await prisma.message.create({
    data: {
      projectId,
      content: userMessage,
      role: "ASSISTANT",
      type: "ERROR",
      model: "",
    },
  });

  return { message };
}

// ============= REPOSITORY ANALYZER =============

async function analyzeRepository(
  repo: Repository,
  octokit: Octokit,
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
    snapshot.existingReadme = Buffer.from(data.content, "base64").toString(
      "utf-8",
    );

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
      recursive: "1",
    });

    const files = tree.tree
      .filter(
        (item: GitHubTreeItem): item is GitHubTreeItem & { path: string } =>
          item.type === "blob" && typeof item.path === "string",
      )
      .map((item) => item.path);

    snapshot.totalFiles = files.length;
    snapshot.allFiles = files;

    // Extract directories and file types
    const dirSet = new Set<string>();
    files.forEach((path: string) => {
      const ext = path.split(".").pop() || "no-ext";
      snapshot.fileTypes[ext] = (snapshot.fileTypes[ext] || 0) + 1;

      const dir = path.split("/")[0];
      if (dir && !path.includes(".")) dirSet.add(dir);
    });

    snapshot.directories = Array.from(dirSet).slice(0, 20);

    // Detect frameworks
    if (files.some((p: string) => p.includes("package.json")))
      snapshot.frameworks.push("Node.js");
    if (files.some((p: string) => p.includes("requirements.txt")))
      snapshot.frameworks.push("Python");
    if (files.some((p: string) => p.includes("Cargo.toml")))
      snapshot.frameworks.push("Rust");
    if (files.some((p: string) => p.includes("go.mod")))
      snapshot.frameworks.push("Go");
    if (files.some((p: string) => p.includes("next.config")))
      snapshot.frameworks.push("Next.js");
    if (files.some((p: string) => p.includes("vite.config")))
      snapshot.frameworks.push("Vite");
    if (files.some((p: string) => p.includes("tsconfig.json")))
      snapshot.frameworks.push("TypeScript");

    // Detect features
    snapshot.features.tests = files.some(
      (p: string) => p.includes("test") || p.includes("spec"),
    );
    snapshot.features.docker = files.some((p: string) =>
      p.includes("Dockerfile"),
    );
    snapshot.features.docs = files.some((p: string) => p.includes("docs/"));
    snapshot.features.ci = files.some((p: string) =>
      p.includes(".github/workflows"),
    );
  } catch (err) {
    console.error("Failed to analyze repository structure:", err);
    throw new Error("Failed to analyze repository structure. Please ensure the repository is accessible.");
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
    name: "context-discovery",
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

  const result = await agent.run(
    "Analyze this repository and identify essential files for README generation.",
  );
  const output = lastAssistantTextMessage(result);

  try {
    const parsed = JSON.parse(output || "{}");
    return {
      requiredFiles: parsed.requiredFiles || [],
      reasoning:
        parsed.reasoning || "Auto-selected based on repository structure",
      estimatedTokens: parsed.estimatedTokens || 0,
    };
  } catch {
    // Fallback: smart defaults based on frameworks
    const defaultFiles: string[] = [];

    if (snapshot.frameworks.includes("Node.js"))
      defaultFiles.push("package.json");
    if (snapshot.frameworks.includes("Python"))
      defaultFiles.push("requirements.txt");
    if (snapshot.frameworks.includes("Rust")) defaultFiles.push("Cargo.toml");
    if (snapshot.frameworks.includes("Go")) defaultFiles.push("go.mod");

    return {
      requiredFiles: defaultFiles,
      reasoning: "Fallback selection based on detected frameworks",
      estimatedTokens: 2000,
    };
  }
}

// ============= FILE FETCHER =============

async function fetchContextFiles(
  filePaths: string[],
  octokit: Octokit,
  repo: Repository,
): Promise<FileContext[]> {
  const contexts: FileContext[] = [];

  for (const path of filePaths) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: repo.ownerLogin,
        repo: repo.name,
        path: path,
      });

      if ("content" in data && typeof data.content === "string") {
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        const size = data.size || 0;

        // Full content for small files, summary for large ones
        if (size < 15000) {
          contexts.push({
            path,
            content,
            type: "full",
            size,
          });
        } else {
          contexts.push({
            path,
            content:
              content.substring(0, 3000) +
              "\n\n... [truncated, file too large]",
            type: "summary",
            size,
          });
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${path}:`, err);
      // Continue with other files even if one fails
    }
  }

  return contexts;
}

// ============= MAIN FUNCTION =============

export const initialReadmeBuild = inngest.createFunction(
  {
    id: "readme-initial-build",
    concurrency: { limit: 5 },
  },
  { event: "readme/initial.build" },
  async ({ event, step }) => {
    const { projectId, userId } = event.data;

    const emitProgress = async (
      stage: string,
      progress: number,
      message: string,
      data?: object,
    ) => {
      try {
        await publishProgress(projectId, {
          stage,
          progress,
          message,
          timestamp: Date.now(),
          ...data,
        });
      } catch (err) {
        console.error("Failed to emit progress:", err);
        // Don't throw - continue execution
      }
    };

    try {
      await emitProgress("CHECKING_ACCESS", 10, "Checking usage limits...");
      
      // ========== STEP 1: Check Access ==========
      const access = await step.run("check-access", async () => {
        try {
          const today = getTodayDate();

          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              bonusAiChatCredits: true,
              dailyAiChatLimit: true,
            },
          });

          if (!user) {
            return false;
          }

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
                maxCount: user.bonusAiChatCredits + user.dailyAiChatLimit,
              },
            });
          }

          if (usage.maxCount - usage.count > 0) {
            return true;
          }

          return false;
        } catch (err) {
          console.error("Error checking access:", err);
          throw new Error("Failed to check usage limits. Please try again.");
        }
      });

      if (!access) {
        await emitProgress("ACCESS_DENIED", 100, "Usage Limit Exceeded...");
        const message = await prisma.message.create({
          data: {
            projectId,
            content:
              "You're all set for today \nYou've reached today's usage limit.\nNew credits will be available tomorrow. \nTake a break — we'll be ready when you're back 🙂",
            role: "ASSISTANT",
            type: "ERROR",
            model: "",
          },
        });

        return { message };
      }

      await emitProgress("FETCHING_PROJECT", 20, "Loading project details...");
      
      // ========== STEP 2: Fetch Project ==========
      const project = await step.run("fetch-project-context", async () => {
        try {
          const proj = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
              repository: {
                include: {
                  installations: {
                    include: {
                      installation: true,
                    },
                  },
                },
              },
              messages: {
                orderBy: { createdAt: "asc" },
                include: {
                  fragment: true,
                  images: true,
                },
              },
            },
          });

          if (!proj) throw new Error("Project not found");
          if (!proj.repository) throw new Error("No repository linked");
          if (proj.repository.installations.length === 0) {
            throw new Error("No installation found for repository");
          }

          return proj;
        } catch (err) {
          console.error("Error fetching project:", err);
          throw err;
        }
      });

      if (!project.repository) {
        throw new Error("No repository linked to this project");
      }

      // ========== STEP 3: Get Octokit ==========
      const installation = project.repository.installations[0].installation;
      
      let octokit: Octokit;
      try {
        octokit = await getInstallationOctokit(
          parseInt(installation.installationId),
        ) as unknown as Octokit;
      } catch (err) {
        console.error("Error getting Octokit:", err);
        throw new Error("Failed to authenticate with GitHub. Please reconnect your account.");
      }

      await emitProgress(
        "ANALYZING_REPO",
        35,
        "Analyzing repository structure...",
        { repoName: project.repository.fullName },
      );
      
      // ========== STEP 4: Analyze Repository ==========
      const snapshot = await step.run("analyze-repository", async () => {
        try {
          return await analyzeRepository(
            project.repository! as unknown as Repository,
            octokit,
          );
        } catch (err) {
          console.error("Error analyzing repository:", err);
          throw err;
        }
      });

      await emitProgress(
        "DISCOVERING_CONTEXT",
        50,
        "AI is analyzing your codebase...",
        {
          totalFiles: snapshot.totalFiles,
          frameworks: snapshot.frameworks,
        },
      );
      
      // ========== STEP 5: Discover Context Files ==========
      let contextDiscovery: ContextDiscoveryResult;
      try {
        contextDiscovery = await discoverContextFiles(
          snapshot,
          project.template || "standard",
        );
      } catch (err) {
        console.error("Error discovering context:", err);
        throw new Error("AI service encountered an error analyzing your codebase.");
      }

      // ========== STEP 6: Fetch Context Files ==========
      const contextFiles = await step.run("fetch-context-files", async () => {
        try {
          const files = await fetchContextFiles(
            contextDiscovery.requiredFiles,
            octokit,
            project.repository! as unknown as Repository,
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
        } catch (err) {
          console.error("Error fetching context files:", err);
          throw new Error("Failed to fetch repository files. Please check repository permissions.");
        }
      });

      await emitProgress("GENERATING_README", 80, "AI is writing your README...");
      
      // ========== STEP 7: Generate README ==========
      const selectedModel = selectReadmeModel(project.template || "standard");
      const latestMessage = project.messages[0];
      
      const systemPrompt = readmeGeneratePrompt(
        snapshot,
        project.template || "standard",
        contextFiles,
        contextDiscovery.reasoning,
        (latestMessage?.images || []) as unknown as Image[],
      );

      let agentResult;
      try {
        const agent = createAgent({
          name: "readme-architect",
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

        const userMessage = latestMessage!.content || "Generate a comprehensive README for this project.";

        agentResult = await agent.run(userMessage);
      } catch (err) {
        console.error("Error generating README:", err);
        throw new Error("AI service encountered an error generating the README.");
      }

      await emitProgress("SAVING_RESULTS", 95, "Finalizing...");
      
      // ========== STEP 8: Parse and Save ==========
      const result = await step.run("parse-and-save", async () => {
        try {
          const fullOutput = lastAssistantTextMessage(agentResult);

          const thinkingMatch = fullOutput?.match(
            /<THINKING>([\s\S]*?)<\/THINKING>/,
          );
          const summaryMatch = fullOutput?.match(/<SUMMARY>([\s\S]*?)<\/SUMMARY>/);
          const readmeMatch = fullOutput?.match(/<README>([\s\S]*?)<\/README>/);

          const thinking = thinkingMatch?.[1].trim() || null;
          const summary =
            summaryMatch?.[1].trim() || "README generated successfully!";
          const readme = readmeMatch?.[1].trim() || fullOutput || "";

          // Save message
          const message = await prisma.message.create({
            data: {
              projectId,
              content: summary,
              role: "ASSISTANT",
              type: "RESULT",
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

          // Update usage
          const today = getTodayDate();
          await prisma.$transaction(async (tx) => {
            const usage = await tx.aiUsage.findUnique({
              where: {
                userId_date: {
                  userId,
                  date: today,
                },
              },
              select: { count: true },
            });

            if (!usage) {
              throw new Error("Usage row missing");
            }

            await tx.aiUsage.update({
              where: {
                userId_date: {
                  userId,
                  date: today,
                },
              },
              data: {
                count: { increment: 1 },
              },
            });

            if (usage.count >= 5) {
              await tx.user.update({
                where: { id: userId },
                data: {
                  bonusAiChatCredits: { decrement: 1 },
                },
              });
            }
          });

          return {
            messageId: message.id,
            thinking,
            summary,
            contextFilesUsed: contextFiles.length,
          };
        } catch (err) {
          console.error("Error saving results:", err);
          throw err;
        }
      });

      await emitProgress("COMPLETED", 100, "README generated! 🎉", {
        messageId: result.messageId,
        completed: true,
      });

      return {
        success: true,
        messageId: result.messageId,
        template: project.template,
        contextFilesUsed: result.contextFilesUsed,
        thinking: result.thinking,
      };

    } catch (error) {
      // Catch all errors and handle them gracefully
      const stage = error instanceof Error && error.message.includes("analyze") 
        ? "ANALYZING_REPO"
        : error instanceof Error && error.message.includes("AI service")
        ? "GENERATING_README"
        : "ERROR";

      return await handleError(projectId, error, stage, emitProgress);
    }
  },
);
