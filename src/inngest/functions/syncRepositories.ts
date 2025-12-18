import { inngest } from '../client';
import { prisma } from '@/lib/db';
import { getInstallationOctokit } from '@/lib/github/appAuth';

export const syncRepositories = inngest.createFunction(
  { id: 'github-sync-repositories' },
  { event: 'github/sync-repositories' },
  async ({ event, step }) => {
    const { installationId } = event.data;

    const installation = await step.run('fetch-installation', async () => {
      return prisma.installation.findUnique({
        where: { id: installationId },
      });
    });

    if (!installation) {
      throw new Error('Installation not found');
    }

    const octokit = await getInstallationOctokit(parseInt(installation.installationId));

    const repos = await step.run('fetch-repos', async () => {
      const { data } = await octokit.rest.apps.listReposAccessibleToInstallation({
        per_page: 100,
      });
      return data.repositories;
    });

    await step.run('upsert-repos', async () => {
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
            language: repo.language,
            topics: repo.topics || [],
            stargazers: repo.stargazers_count || 0,
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
            lastSyncedAt: new Date(),
            syncStatus: 'completed',
          },
        });
      }
    });

    return { success: true, count: repos.length };
  }
);