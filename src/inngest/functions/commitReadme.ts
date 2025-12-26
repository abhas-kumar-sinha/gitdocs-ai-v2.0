import { prisma } from '@/lib/db';
import { inngest } from '../client';
import { getInstallationOctokit } from '@/lib/github/appAuth';
import { TRPCError } from '@trpc/server';

// Helper type for GitHub errors
type GitHubError = Error & { status?: number };

// Helper function to check if error is GitHub 404
function isGitHubNotFoundError(error: unknown): error is GitHubError {
  return error instanceof Error && 'status' in error && error.status === 404;
}

// Helper function to check if error is GitHub 422
function isGitHubUnprocessableError(error: unknown): error is GitHubError {
  return error instanceof Error && 'status' in error && error.status === 422;
}

export const createReadmePr = inngest.createFunction(
  { 
    id: 'create-readme-pr',
    concurrency: { limit: 10 },
  },
  { event: 'readme/create.pr' },
  async ({ event, step }) => {
    const { projectId, commitMessage, commitBranch, fragmentId } = event.data;

    // Step 1: Get fragment and project data
    const { fragment, project } = await step.run('fetch-data', async () => {
      const fragment = await prisma.fragment.findUnique({
        where: { id: fragmentId },
        select: { readme: true }
      });

      if (!fragment) {
        throw new Error(`Fragment ${fragmentId} not found`);
      }

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          repository: true
        }
      });

      if (!project?.repository) {
        throw new Error(`Project ${projectId} has no linked repository`);
      }

      return { fragment, project };
    });

    const { repository } = project;

    if (!repository) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Repository not found" });
    }

    const [owner, repo] = repository.fullName.split('/');

    if (!owner || !repo) {
      throw new Error(`Invalid repository full name: ${repository.fullName}`);
    }

    // Step 2: Get GitHub installation client
    const octokit = await getInstallationOctokit(Number(repository.installationId));

    // Step 3: Get default branch reference
    const defaultBranch = await step.run('get-default-branch', async (): Promise<string> => {
      const { data: repoData } = await octokit.rest.repos.get({
        owner,
        repo
      });
      return repoData.default_branch;
    });

    // Step 4: Get the default branch SHA
    const baseSha = await step.run('get-base-sha', async (): Promise<string> => {
      const { data: ref } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`
      });
      return ref.object.sha;
    });

    // Step 5: Create branch if it doesn't exist
    const branchCreated = await step.run('create-branch', async (): Promise<boolean> => {
      try {
        // Check if branch exists
        await octokit.rest.git.getRef({
          owner,
          repo,
          ref: `heads/${commitBranch}`
        });
        return false; // Branch already exists
      } catch (error: unknown) {
        if (isGitHubNotFoundError(error)) {
          // Branch doesn't exist, create it
          await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${commitBranch}`,
            sha: baseSha
          });
          return true; // Branch created
        }
        throw error;
      }
    });

    // Step 6: Get current README SHA (if exists)
    const currentReadmeSha = await step.run('get-readme-sha', async (): Promise<string | null> => {
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: 'README.md',
          ref: commitBranch
        });
        
        if ('sha' in data && !Array.isArray(data)) {
          return data.sha;
        }
        return null;
      } catch (error: unknown) {
        if (isGitHubNotFoundError(error)) {
          return null; // README doesn't exist
        }
        throw error;
      }
    });

    // Step 7: Create or update README
    await step.run('commit-readme', async (): Promise<void> => {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: 'README.md',
        message: commitMessage || 'Update README.md',
        content: Buffer.from(fragment.readme).toString('base64'),
        branch: commitBranch,
        ...(currentReadmeSha && { sha: currentReadmeSha })
      });
    });

    // Step 8: Create pull request
    const pullRequest = await step.run('create-pull-request', async () => {
      try {
        const { data: pr } = await octokit.rest.pulls.create({
          owner,
          repo,
          title: commitMessage || 'Update README.md',
          head: commitBranch,
          base: defaultBranch,
          body: `This PR updates the README.md file.\n\n---\n*Generated from Fragment ${fragmentId}*`
        });
        
        return {
          number: pr.number,
          url: pr.html_url,
          created: true
        };
      } catch (error: unknown) {
        // PR might already exist
        if (isGitHubUnprocessableError(error)) {
          // Find existing PR
          const { data: prs } = await octokit.rest.pulls.list({
            owner,
            repo,
            head: `${owner}:${commitBranch}`,
            base: defaultBranch,
            state: 'open'
          });
          
          if (prs.length > 0) {
            return {
              number: prs[0].number,
              url: prs[0].html_url,
              created: false
            };
          }
        }
        throw error;
      }
    });

    return {
      success: true,
      branchCreated,
      branch: commitBranch,
      pullRequest
    };
  }
);