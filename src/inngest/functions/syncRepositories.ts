import { inngest } from "../client";
import { prisma } from "@/lib/db";
import { getInstallationOctokit } from "@/lib/github/appAuth";

export const syncRepositories = inngest.createFunction(
  { id: "github-sync-repositories" },
  { event: "github/sync-repositories" },
  async ({ event, step }) => {
    const { installationId, actualInstallationId } = event.data;

    // ----------------------------------------------------
    // STEP 1: Fetch Installation
    // ----------------------------------------------------
    const installation = await step.run("fetch-installation", async () => {
      if (actualInstallationId) {
        return prisma.installation.findUnique({
          where: { installationId: String(actualInstallationId) },
        });
      }

      return prisma.installation.findUnique({
        where: { id: installationId },
      });
    });

    if (!installation) {
      throw new Error("Installation not found");
    }

    // ----------------------------------------------------
    // STEP 2: Get Octokit for Installation
    // ----------------------------------------------------
    const octokit = await getInstallationOctokit(
      parseInt(installation.installationId),
    );

    // ----------------------------------------------------
    // STEP 3: Fetch repositories from GitHub
    // ----------------------------------------------------
    const repos = await step.run("fetch-repos", async () => {
      const { data } =
        await octokit.rest.apps.listReposAccessibleToInstallation({
          per_page: 100,
        });

      return data.repositories;
    });

    // ----------------------------------------------------
    // STEP 4: Upsert repositories + link to installation
    // ----------------------------------------------------
    await step.run("upsert-repos", async () => {
      for (const repo of repos) {
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
      }
    });

    return { success: true, count: repos.length };
  },
);
