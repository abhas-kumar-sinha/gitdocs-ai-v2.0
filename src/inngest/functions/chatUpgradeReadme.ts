import { prisma } from "@/lib/db";
import { inngest } from "../client";
import type { Octokit } from "@octokit/rest";
import { publishProgress } from "@/lib/redis";
import { lastAssistantTextMessage } from "../utils";
import { Message, Repository } from "@/generated/prisma/client";
import { createAgent, openai } from "@inngest/agent-kit";
import { readmeUpgradePrompt } from "@/lib/prompts/PROMPTS";
import { getInstallationOctokit } from "@/lib/github/appAuth";
import {
  type ModelConfig,
  type FileContext,
  type ConversationMessage,
} from "@/types/readmeAi";

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
  },
};

function selectChatModel(
  complexity: "simple" | "moderate" | "complex",
): ModelConfig {
  if (complexity === "simple") return Models.chatUpgrade.fast;
  if (complexity === "complex") return Models.chatUpgrade.quality;
  return Models.chatUpgrade.balanced;
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
    } else if (errorMsg.includes("invalid message")) {
      userMessage = "Message not found. Please refresh and try again.";
    } else if (errorMsg.includes("rate limit") || errorMsg.includes("api rate")) {
      userMessage = "GitHub API rate limit exceeded. Please try again in a few minutes.";
    } else if (errorMsg.includes("not found") && errorMsg.includes("repository")) {
      userMessage = "Repository not found or access denied. Please check your permissions.";
    } else if (errorMsg.includes("authentication") || errorMsg.includes("unauthorized")) {
      userMessage = "Authentication failed. Please reconnect your GitHub account.";
    } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
      userMessage = "Network error occurred. Please check your connection and try again.";
    } else if (errorMsg.includes("timeout")) {
      userMessage = "Request timed out. Please try again.";
    } else if (errorMsg.includes("usage row missing")) {
      userMessage = "Usage tracking error. Please contact support.";
    } else if (stage === "GENERATING_README") {
      userMessage = "AI service encountered an error updating the README. Please try again.";
    } else if (stage === "ANALYZING_REPO") {
      userMessage = "Failed to analyze repository. Please ensure the repository is accessible.";
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

// ============= COMPLEXITY ANALYZER =============

function analyzeRequestComplexity(
  userMessage: string,
): "simple" | "moderate" | "complex" {
  const lowerMsg = userMessage.toLowerCase();

  // Simple: typo fixes, small tweaks, formatting
  const simpleKeywords = [
    "fix typo",
    "change",
    "update",
    "add badge",
    "remove",
    "bold",
    "italics",
  ];
  if (
    simpleKeywords.some((kw) => lowerMsg.includes(kw)) &&
    userMessage.length < 100
  ) {
    return "simple";
  }

  // Complex: restructure, multiple sections, add examples, architecture
  const complexKeywords = [
    "restructure",
    "rewrite",
    "add section",
    "architecture",
    "diagram",
    "comprehensive",
  ];
  if (complexKeywords.some((kw) => lowerMsg.includes(kw))) {
    return "complex";
  }

  return "moderate";
}

// ============= DETERMINE IF NEW FILES NEEDED =============

function needsAdditionalFiles(userMessage: string): boolean {
  const lowerMsg = userMessage.toLowerCase();

  // Check if user is asking for info that might require new files
  const fileHints = [
    "add api docs",
    "include endpoints",
    "add configuration",
    "deployment",
    "docker",
    "environment variables",
    "database schema",
    "add tests section",
  ];

  return fileHints.some((hint) => lowerMsg.includes(hint));
}

// ============= FETCH ADDITIONAL FILES =============

async function fetchAdditionalContextFiles(
  userMessage: string,
  existingFiles: string[],
  octokit: Octokit,
  repo: Repository,
): Promise<FileContext[]> {
  const lowerMsg = userMessage.toLowerCase();
  const newFilesToFetch: string[] = [];

  // Smart file detection based on user request
  if (
    lowerMsg.includes("api") &&
    !existingFiles.some(
      (f) => f.includes("routes") || f.includes("controllers"),
    )
  ) {
    newFilesToFetch.push(
      "src/routes/index.ts",
      "src/api/routes.ts",
      "routes/index.js",
    );
  }

  if (
    lowerMsg.includes("docker") &&
    !existingFiles.some((f) => f.includes("Docker"))
  ) {
    newFilesToFetch.push("Dockerfile", "docker-compose.yml");
  }

  if (
    lowerMsg.includes("environment") &&
    !existingFiles.some((f) => f.includes(".env"))
  ) {
    newFilesToFetch.push(".env.example", ".env.sample");
  }

  if (
    lowerMsg.includes("test") &&
    !existingFiles.some((f) => f.includes("test"))
  ) {
    newFilesToFetch.push(
      "jest.config.js",
      "vitest.config.ts",
      "tests/setup.ts",
    );
  }

  const contexts: FileContext[] = [];

  for (const path of newFilesToFetch) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: repo.ownerLogin,
        repo: repo.name,
        path: path,
      });

      if ("content" in data && typeof data.content === "string") {
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        const size = data.size || 0;

        contexts.push({
          path,
          content:
            size < 15000
              ? content
              : content.substring(0, 3000) + "\n\n... [truncated]",
          type: size < 15000 ? "full" : "summary",
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
  repo: Repository,
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

      if ("content" in data && typeof data.content === "string") {
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        const size = data.size || 0;

        contexts.push({
          path,
          content:
            size < 15000
              ? content
              : content.substring(0, 3000) + "\n\n... [truncated]",
          type: size < 15000 ? "full" : "summary",
          size,
        });
      }
    } catch (err) {
      console.error(`Failed to fetch ${path}:`, err);
      // Continue with other files
    }
  }

  return contexts;
}

// ============= MAIN FUNCTION =============

export const chatUpgradeReadme = inngest.createFunction(
  {
    id: "readme-chat-upgrade",
    concurrency: { limit: 10 },
  },
  { event: "readme/chat.upgrade" },
  async ({ event, step }) => {
    const { projectId, messageId, userId } = event.data;

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

      // ========== STEP 3: Get Octokit ==========
      const installation = project.repository!.installations[0].installation;
      
      let octokit: Octokit;
      try {
        octokit = await getInstallationOctokit(
          parseInt(installation.installationId),
        ) as unknown as Octokit;
      } catch (err) {
        console.error("Error getting Octokit:", err);
        throw new Error("Failed to authenticate with GitHub. Please reconnect your account.");
      }

      // ========== STEP 4: Get User Message ==========
      const userMessage = await step.run("get-user-message", async () => {
        try {
          const msg = await prisma.message.findUnique({
            where: { id: messageId },
          });

          if (!msg || msg.role !== "USER") {
            throw new Error("Invalid message or not a user message");
          }

          return msg.content;
        } catch (err) {
          console.error("Error fetching user message:", err);
          throw err;
        }
      });

      await emitProgress(
        "ANALYZING_REQUEST",
        35,
        "Analyzing your request...",
        { repoName: project.repository?.fullName },
      );
      
      // ========== STEP 5: Analyze Complexity ==========
      const complexity = analyzeRequestComplexity(userMessage);
      const selectedModel = selectChatModel(complexity);

      // ========== STEP 6: Load Existing Context ==========
      const existingContext = await step.run(
        "load-existing-context",
        async () => {
          try {
            return await loadExistingContext(
              projectId,
              octokit,
              project.repository! as unknown as Repository,
            );
          } catch (err) {
            console.error("Error loading existing context:", err);
            // Return empty array as fallback
            return [];
          }
        },
      );

      // ========== STEP 7: Fetch Additional Files ==========
      const additionalContext = await step.run(
        "fetch-additional-files",
        async () => {
          try {
            if (!needsAdditionalFiles(userMessage)) {
              return [];
            }

            const existingPaths = project.contextFiles || [];
            return await fetchAdditionalContextFiles(
              userMessage,
              existingPaths,
              octokit,
              project.repository! as unknown as Repository,
            );
          } catch (err) {
            console.error("Error fetching additional files:", err);
            // Return empty array as fallback
            return [];
          }
        },
      );

      // Combine contexts
      const allContext = [...existingContext, ...additionalContext];

      // ========== STEP 8: Build Conversation History ==========
      const conversationHistory: ConversationMessage[] = project.messages
        .slice(0, -1) // Exclude the current user message
        .map((msg) => ({
          role: msg.role.toLowerCase() as "user" | "assistant",
          content: msg.content,
        }));

      // Get the most recent README
      const latestReadme =
        project.messages
          .slice()
          .reverse()
          .find((msg) => msg.fragment?.readme)?.fragment?.readme || "";

      // ========== STEP 9: Prepare System Prompt ==========
      const systemPrompt = readmeUpgradePrompt(
        latestReadme,
        allContext,
        conversationHistory,
        project.template || "standard",
      );

      await emitProgress("GENERATING_README", 80, "AI is updating your README...");
      
      // ========== STEP 10: Run Upgrade Agent ==========
      let agentResult;
      try {
        const agent = createAgent({
          name: "readme-upgrade-assistant",
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

        agentResult = await agent.run(userMessage);
      } catch (err) {
        console.error("Error running upgrade agent:", err);
        throw new Error("AI service encountered an error updating the README.");
      }

      await emitProgress("SAVING_RESULTS", 95, "Finalizing...");
      
      // ========== STEP 11: Parse and Save ==========
      const result = await step.run("parse-and-save-upgrade", async () => {
        try {
          const fullOutput = lastAssistantTextMessage(agentResult);

          // Parse structured output
          const thinkingMatch = fullOutput?.match(
            /<THINKING>([\s\S]*?)<\/THINKING>/,
          );
          const summaryMatch = fullOutput?.match(/<SUMMARY>([\s\S]*?)<\/SUMMARY>/);
          const readmeMatch = fullOutput?.match(/<README>([\s\S]*?)<\/README>/);

          const thinking = thinkingMatch?.[1].trim() || null;
          const summary =
            summaryMatch?.[1].trim() || "README updated successfully!";
          const readme = readmeMatch?.[1].trim() || fullOutput || "";

          // Save assistant message
          const message = await prisma.message.create({
            data: {
              projectId,
              content: summary,
              role: "ASSISTANT",
              type: "RESULT",
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
            const newContextPaths = additionalContext.map((ctx) => ctx.path);
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
            complexity,
            additionalFilesUsed: additionalContext.length,
          };
        } catch (err) {
          console.error("Error parsing and saving:", err);
          throw err;
        }
      });

      await emitProgress("COMPLETED", 100, "README updated! 🎉", {
        messageId: result.messageId,
        completed: true,
      });

      return {
        success: true,
        messageId: result.messageId,
        complexity: result.complexity,
        model: selectedModel.model,
        additionalFilesUsed: result.additionalFilesUsed,
        thinking: result.thinking,
      };

    } catch (error) {
      // Catch all errors and handle them gracefully
      const stage = error instanceof Error && error.message.includes("AI service")
        ? "GENERATING_README"
        : error instanceof Error && error.message.includes("analyze")
        ? "ANALYZING_REPO"
        : "ERROR";

      return await handleError(projectId, error, stage, emitProgress);
    }
  },
);
