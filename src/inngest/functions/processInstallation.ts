import { inngest } from '../client';
import { prisma } from '@/lib/db';
import { getInstallationOctokit, getAppOctokit } from '@/lib/github/appAuth';

export const processInstallation = inngest.createFunction(
  { id: 'github-process-installation' },
  { event: 'github/process-installation' },
  async ({ event, step }) => {
    const { userId, installationId, action = 'install' } = event.data;

    // Get app-level octokit to fetch installation details
    const appOctokit = getAppOctokit();

    const installationData = await step.run('fetch-installation', async () => {
      const { data } = await appOctokit.rest.apps.getInstallation({
        installation_id: installationId,
      });
      return data;
    });

    const installation = await step.run('upsert-installation', async () => {
      return prisma.installation.upsert({
        where: { installationId: installationId.toString() },
        update: {
          accountId: installationData.account?.id?.toString() || '',
          accountName: installationData.account?.name?.toString() || '',
          accountAvatarUrl: installationData.account?.avatar_url,
          permissions: installationData.permissions,
          repositorySelection: installationData.repository_selection || 'all',
        },
        create: {
          userId,
          installationId: installationId.toString(),
          accountId: installationData.account?.id?.toString() || '',
          accountName: installationData.account?.name?.toString() || '',
          accountAvatarUrl: installationData.account?.avatar_url,
          permissions: installationData.permissions,
          repositorySelection: installationData.repository_selection || 'all',
        },
      });
    });

    // Get installation-specific octokit for repo operations
    const octokit = await getInstallationOctokit(installationId);

    // Sync repositories
    const data = await step.run('sync-repositories', async () => {
      const { data } = await octokit.rest.apps.listReposAccessibleToInstallation({
        per_page: 100,
      });

      const currentGithubRepoIds = data.repositories.map((repo) => repo.id.toString());

      // Upsert all accessible repositories
      for (const repo of data.repositories) {
        await prisma.repository.upsert({
          where: { githubId: repo.id.toString() },
          update: {
            installationId: installation.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            private: repo.private,
            defaultBranch: repo.default_branch || 'main',
            url: repo.html_url,
            ownerLogin: repo.owner!.login,
            ownerType: repo.owner!.type!,
            language: repo.language,
            topics: repo.topics || [],
            stargazers: repo.stargazers_count || 0,
            watchers: repo.watchers_count || 0,
            forks: repo.forks_count || 0,
            lastSyncedAt: new Date(),
            syncStatus: 'completed',
          },
          create: {
            installationId: installation.id,
            githubId: repo.id.toString(),
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            private: repo.private,
            defaultBranch: repo.default_branch || 'main',
            url: repo.html_url,
            ownerLogin: repo.owner!.login,
            ownerType: repo.owner!.type!,
            language: repo.language,
            topics: repo.topics || [],
            stargazers: repo.stargazers_count || 0,
            watchers: repo.watchers_count || 0,
            forks: repo.forks_count || 0,
            lastSyncedAt: new Date(),
            syncStatus: 'completed',
          },
        });
      }

      // If this is an update action, remove repos that are no longer accessible
      if (action === 'update') {
        const existingRepos = await prisma.repository.findMany({
          where: { installationId: installation.id },
          select: { githubId: true },
        });

        const reposToRemove = existingRepos
          .map((repo) => repo.githubId)
          .filter((githubId) => !currentGithubRepoIds.includes(githubId));

        if (reposToRemove.length > 0) {
          await prisma.repository.deleteMany({
            where: {
              installationId: installation.id,
              githubId: { in: reposToRemove },
            },
          });
        }
      }

      return data;
    });

    return { 
      success: true, 
      action,
      reposCount: data.repositories.length 
    };
  }
);