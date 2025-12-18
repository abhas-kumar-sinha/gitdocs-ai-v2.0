import { inngest } from '../client';
import { prisma } from '@/lib/db';
import { getInstallationOctokit, getAppOctokit } from '@/lib/github/appAuth';

export const processInstallation = inngest.createFunction(
  { id: 'github-process-installation' },
  { event: 'github/process-installation' },
  async ({ event, step }) => {
    const { userId, installationId } = event.data;

    // Get app-level octokit to fetch installation details
    const appOctokit = getAppOctokit();

    const installationData = await step.run('fetch-installation', async () => {
      const { data } = await appOctokit.request('GET /app/installations/{installation_id}', {
        installation_id: installationId,
      });
      return data;
    });

    const installation = await step.run('save-installation', async () => {
      return prisma.installation.create({
        data: {
          userId,
          installationId: installationId.toString(),
          accountId: installationData.account?.id?.toString() || '',
          accountAvatarUrl: installationData.account?.avatar_url,
          permissions: installationData.permissions,
          repositorySelection: installationData.repository_selection || 'all',
        },
      });
    });

    // Get installation-specific octokit for repo operations
    const octokit = await getInstallationOctokit(installationId);

    // Sync repositories
    await step.run('sync-repositories', async () => {
      const { data } = await octokit.rest.apps.listReposAccessibleToInstallation({
        per_page: 100,
      });

      const repos = data.repositories;

      for (const repo of repos) {
        await prisma.repository.upsert({
          where: { githubId: repo.id.toString() },
          update: {
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
    });

    return { success: true };
  }
);