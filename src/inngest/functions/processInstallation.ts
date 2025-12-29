import { Status } from "@/generated/prisma/enums";
import { inngest } from "../client";
import { prisma } from "@/lib/db";
import { getInstallationOctokit, getAppOctokit } from "@/lib/github/appAuth";
import { RequestError } from "octokit";

export const processInstallation = inngest.createFunction(
  { id: "github-process-installation" },
  { event: "github/process-installation" },
  async ({ event, step }) => {
    const {
      userId,
      installationId,
      action = "install",
      permissions,
    } = event.data;

    // Get app-level octokit to fetch installation details
    const appOctokit = getAppOctokit();

    const installationData = await step.run("fetch-installation", async () => {
      const { data } = await appOctokit.rest.apps.getInstallation({
        installation_id: installationId,
      });
      return data;
    });

    const installation = await step.run("upsert-installation", async () => {
      return prisma.installation.upsert({
        where: { installationId: installationId.toString() },
        update: {
          accountId: installationData.account?.id?.toString() || "",
          accountName: installationData.account?.name?.toString() || "",
          accountAvatarUrl: installationData.account?.avatar_url,
          permissions,
          repositorySelection: installationData.repository_selection || "all",
        },
        create: {
          installationId: installationId.toString(),
          accountId: installationData.account?.id?.toString() || "",
          accountName: installationData.account?.name?.toString() || "",
          accountAvatarUrl: installationData.account?.avatar_url,
          permissions,
          repositorySelection: installationData.repository_selection || "all",
        },
      });
    });

    await step.run("upsert-installation-member", async () => {
      return prisma.installationMember.upsert({
        where: {
          installationId_userId: {
            installationId: installation.id,
            userId,
          },
        },
        update: {}, // nothing to update for now
        create: {
          installationId: installation.id,
          userId,
          role: "owner",
        },
      });
    });

    // Get installation-specific octokit for repo operations
    const octokit = await getInstallationOctokit(installationId);

    // Sync repositories
    const data = await step.run("sync-repositories", async () => {
      const { data } =
        await octokit.rest.apps.listReposAccessibleToInstallation({
          per_page: 100,
        });

      const currentGithubRepoIds = data.repositories.map((repo) =>
        repo.id.toString(),
      );

      // Parallelize README checks
      const reposWithReadmeInfo = await Promise.all(
        data.repositories.map(async (repo) => {
          try {
            const { data: readmeData } = await octokit.rest.repos.getReadme({
              owner: repo.owner!.login,
              repo: repo.name,
            });
            return { ...repo, hasReadme: true, readmeSha: readmeData.sha };
          } catch (error) {
            if (error instanceof RequestError && error.status === 404) {
              return { ...repo, hasReadme: false, readmeSha: null };
            }
            throw error;
          }
        }),
      );

      // ✅ GLOBAL repo data ONLY
      const getGlobalRepoData = (repo: (typeof reposWithReadmeInfo)[0]) => ({
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
        watchers: repo.watchers_count || 0,
        forks: repo.forks_count || 0,
        hasReadme: repo.hasReadme,
        readmeSha: repo.readmeSha,
      });

      // ✅ Upsert repositories + link to installation
      await Promise.all(
        reposWithReadmeInfo.map(async (repo) => {
          // 1️⃣ Global repository
          const repository = await prisma.repository.upsert({
            where: { githubId: repo.id.toString() },
            update: getGlobalRepoData(repo),
            create: {
              githubId: repo.id.toString(),
              ...getGlobalRepoData(repo),
            },
          });

          // 2️⃣ Installation-specific state
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
        }),
      );

      // Remove repos no longer accessible for THIS installation
      if (action === "update") {
        await prisma.installationRepository.deleteMany({
          where: {
            installationId: installation.id,
            repository: {
              githubId: {
                notIn: currentGithubRepoIds,
              },
            },
          },
        });
      }

      return data;
    });


    await step.run("inform-frontend", async () => {
      await prisma.installationProcess.updateMany({
        where: {
          userId,
          status: Status.PENDING,
        },
        data: {
          status: Status.COMPLETED,
        },
      });
    });

    return {
      success: true,
      action,
      reposCount: data.repositories.length,
    };
  },
);
