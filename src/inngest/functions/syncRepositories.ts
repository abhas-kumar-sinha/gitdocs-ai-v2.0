import { inngest } from "../client";
import { prisma } from "@/lib/db";
import { getInstallationOctokit } from "@/lib/github/appAuth";
import { NonRetriableError } from "inngest";
import { RequestError } from "@octokit/request-error";
import { Prisma } from "@/generated/prisma/client";

export const syncRepositories = inngest.createFunction(
  { 
    id: "github-sync-repositories",
    retries: 3,
    concurrency: { limit: 10 }
  },
  { event: "github/sync-repositories" },
  async ({ event, step }) => {
    const { installationId, actualInstallationId } = event.data;

    // STEP 1: Fetch Installation
    const installation = await step.run("fetch-installation", async () => {
      try {
        if (actualInstallationId) {
          return await prisma.installation.findUnique({
            where: { installationId: String(actualInstallationId) },
          });
        }

        return await prisma.installation.findUnique({
          where: { id: installationId },
        });
      } catch (error) {
        // Database errors are retryable
        console.error("Database error fetching installation:", error);
        throw error;
      }
    });

    if (!installation) {
      // Installation not found is NOT retryable - data issue
      throw new NonRetriableError(
        `Installation not found: ${installationId || actualInstallationId}`
      );
    }

    // STEP 2: Get Octokit for Installation
    const octokit = await getInstallationOctokit(
          parseInt(installation.installationId)
        );


    // STEP 3: Fetch repositories from GitHub
    const repos = await step.run("fetch-repos", async () => {
      try {
        const { data } =
          await octokit.rest.apps.listReposAccessibleToInstallation({
            per_page: 100,
          });

        return data.repositories;
      } catch (error) {
        // Check for non-retryable GitHub API errors
        if (error instanceof RequestError) {
          if (error.status === 401 || error.status === 403) {
            throw new NonRetriableError(
              `GitHub API authentication failed: ${error.message}`
            );
          }

          if (error.status === 404) {
            throw new NonRetriableError(
              `Installation ${installation.installationId} no longer has access`
            );
          }
        }

        // Rate limit or temporary errors are retryable
        console.error("Error fetching repositories:", error);
        throw error;
      }
    });

    // STEP 4: Upsert repositories + link to installation
    await step.run("upsert-repos", async () => {
      const errors: Array<{ repo: string; error: string }> = [];

      for (const repo of repos) {
        try {
          // 1️⃣ Upsert GLOBAL repository
          const repository = await prisma.repository.upsert({
            where: { githubId: repo.id.toString() },
            update: {
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              private: repo.private,
              defaultBranch: repo.default_branch || "main",
              url: repo.html_url,
              ownerLogin: repo.owner!.login,
              ownerType: repo.owner!.type!,
              language: repo.language,
              topics: repo.topics || [],
              stargazers: repo.stargazers_count || 0,
            },
            create: {
              githubId: repo.id.toString(),
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              private: repo.private,
              defaultBranch: repo.default_branch || "main",
              url: repo.html_url,
              ownerLogin: repo.owner!.login,
              ownerType: repo.owner!.type!,
              language: repo.language,
              topics: repo.topics || [],
              stargazers: repo.stargazers_count || 0,
            },
          });

          // 2️⃣ Link repository to installation
          await prisma.installationRepository.upsert({
            where: {
              installationId_repositoryId: {
                installationId: installation.id,
                repositoryId: repository.id,
              },
            },
            update: {
              lastSyncedAt: new Date(),
              syncStatus: "completed",
            },
            create: {
              installationId: installation.id,
              repositoryId: repository.id,
              lastSyncedAt: new Date(),
              syncStatus: "completed",
            },
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          // Log individual repo errors but continue processing others
          console.error(`Error upserting repo ${repo.full_name}:`, error);
          errors.push({
            repo: repo.full_name,
            error: errorMessage,
          });
          
          // Check if it's a Prisma error
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Check if it's a schema/validation error (non-retryable)
            if (
              error.code === "P2002" || // Unique constraint violation
              error.code === "P2003"    // Foreign key constraint
            ) {
              // Continue with other repos instead of failing entirely
              continue;
            }
            
            // If it's a connection error, throw to retry the whole batch
            if (
              error.code === "P1001" || // Can't reach database
              error.code === "P1002"    // Database timeout
            ) {
              throw error;
            }
          }
          
          // Check for other validation errors
          if (errorMessage.includes("Invalid")) {
            continue;
          }
          
          // Check for connection errors
          if (errorMessage.includes("ECONNREFUSED")) {
            throw error;
          }
        }
      }

      // If we had partial failures, log them but don't fail the function
      if (errors.length > 0) {
        console.warn(
          `Completed with ${errors.length} errors:`,
          JSON.stringify(errors, null, 2)
        );
      }
    });

    return { 
      success: true, 
      count: repos.length,
      installationId: installation.id 
    };
  }
);