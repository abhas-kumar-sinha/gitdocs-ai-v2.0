import { prisma } from "@/lib/db";
import { inngest } from "../client";
import { getInstallationOctokit } from "@/lib/github/appAuth";
import { TRPCError } from "@trpc/server";

// Helper type for GitHub errors
type GitHubError = Error & { status?: number };

// Helper function to check if error is GitHub 404
function isGitHubNotFoundError(error: unknown): error is GitHubError {
  return error instanceof Error && "status" in error && error.status === 404;
}

// Helper function to check if error is GitHub 422
function isGitHubUnprocessableError(error: unknown): error is GitHubError {
  return error instanceof Error && "status" in error && error.status === 422;
}

// Helper to extract image URLs from markdown
function extractImageUrls(markdown: string): string[] {
  const urls: string[] = [];
  
  // Match markdown images: ![alt](url)
  const markdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = markdownRegex.exec(markdown)) !== null) {
    urls.push(match[2]);
  }
  
  // Match HTML img tags: <img src="url" ...>
  const htmlRegex = /<img[^>]+src=["']([^"']+)["']/g;
  while ((match = htmlRegex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

// Helper to check if URL is a Cloudinary URL
function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

// Helper to download image from URL
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image from ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Helper to get file extension from URL or mime type
function getFileExtension(url: string, mimeType?: string): string {
  // Try to get from URL first
  const urlParts = url.split('?')[0].split('.');
  if (urlParts.length > 1) {
    const ext = urlParts[urlParts.length - 1].toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
      return ext;
    }
  }
  
  // Fallback to mime type
  if (mimeType) {
    const mimeMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'image/webp': 'webp',
    };
    return mimeMap[mimeType] || 'png';
  }
  
  return 'png';
}

// Helper to sanitize filename
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const createReadmePr = inngest.createFunction(
  {
    id: "create-readme-pr",
    concurrency: { limit: 10 },
  },
  { event: "readme/create.pr" },
  async ({ event, step }) => {
    const { 
      projectId, 
      commitMessage, 
      commitBranch, 
      fragmentId,
      assetsFolderName = "assets" // Default folder name
    } = event.data;

    // Step 1: Get fragment data
    const fragment = await step.run("fetch-fragment", async () => {
      const fragment = await prisma.fragment.findUnique({
        where: { id: fragmentId },
        select: { readme: true },
      });

      if (!fragment) {
        throw new Error(`Fragment ${fragmentId} not found`);
      }

      return fragment;
    });

    // Step 2: Get project data with images
    const project = await step.run("fetch-project-context", async () => {
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
          images: true, // Fetch all project images
        },
      });

      if (!proj) throw new Error("Project not found");
      if (!proj.repository) throw new Error("No repository linked");
      if (proj.repository.installations.length === 0) {
        throw new Error("No installation found for repository");
      }

      return proj;
    });

    // Continue with validation
    const { repository } = project;
    if (!repository) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Repository not found",
      });
    }

    const [owner, repo] = repository.fullName.split("/");

    if (!owner || !repo) {
      throw new Error(`Invalid repository full name: ${repository.fullName}`);
    }

    // Step 3: Analyze images in README
    const imageAnalysis = await step.run("analyze-images", async () => {
      const readmeContent = fragment.readme;
      const imageUrls = extractImageUrls(readmeContent);
      
      // Filter for Cloudinary URLs that match project images
      const usedImages = project.images.filter(img => 
        imageUrls.some(url => 
          isCloudinaryUrl(url) && (url.includes(img.publicId) || url === img.url)
        )
      );

      return {
        usedImages,
        hasImages: usedImages.length > 0,
        totalImagesInReadme: imageUrls.length,
      };
    });

    // Step 4: Get GitHub installation client
    const installation = project.repository!.installations[0].installation;
    const octokit = await getInstallationOctokit(
      parseInt(installation.installationId),
    );

    // Step 5: Get default branch reference
    const defaultBranch = await step.run(
      "get-default-branch",
      async (): Promise<string> => {
        const { data: repoData } = await octokit.rest.repos.get({
          owner,
          repo,
        });
        return repoData.default_branch;
      },
    );

    // Step 6: Get the default branch SHA
    const baseSha = await step.run(
      "get-base-sha",
      async (): Promise<string> => {
        const { data: ref } = await octokit.rest.git.getRef({
          owner,
          repo,
          ref: `heads/${defaultBranch}`,
        });
        return ref.object.sha;
      },
    );

    // Step 7: Create branch if it doesn't exist
    const branchCreated = await step.run(
      "create-branch",
      async (): Promise<boolean> => {
        try {
          await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${commitBranch}`,
          });
          return false;
        } catch (error: unknown) {
          if (isGitHubNotFoundError(error)) {
            await octokit.rest.git.createRef({
              owner,
              repo,
              ref: `refs/heads/${commitBranch}`,
              sha: baseSha,
            });
            return true;
          }
          throw error;
        }
      },
    );

    // Step 8: Download and commit images (only if there are images)
    const imageCommits = await step.run(
      "commit-images",
      async (): Promise<{ committed: number; skipped: number }> => {
        if (!imageAnalysis.hasImages) {
          return { committed: 0, skipped: 0 };
        }

        let committed = 0;
        let skipped = 0;

        for (const image of imageAnalysis.usedImages) {
          try {
            // Download image
            const imageBuffer = await downloadImage(image.url);
            
            // Generate filename
            const extension = getFileExtension(image.url, image.mimeType);
            const sanitizedName = sanitizeFilename(image.name);
            const filename = `${sanitizedName}-${image.id.slice(-8)}.${extension}`;
            const filePath = `${assetsFolderName}/${filename}`;

            // Check if file already exists
            let existingSha: string | null = null;
            try {
              const { data } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: commitBranch,
              });
              if ("sha" in data && !Array.isArray(data)) {
                existingSha = data.sha;
              }
            } catch (error: unknown) {
              if (!isGitHubNotFoundError(error)) {
                throw error;
              }
            }

            // Commit image
            await octokit.rest.repos.createOrUpdateFileContents({
              owner,
              repo,
              path: filePath,
              message: `Add image: ${filename}`,
              content: imageBuffer.toString("base64"),
              branch: commitBranch,
              ...(existingSha && { sha: existingSha }),
            });

            committed++;
          } catch (error) {
            console.error(`Failed to commit image ${image.id}:`, error);
            skipped++;
          }
        }

        return { committed, skipped };
      },
    );

    // Step 9: Update README with relative image paths
    const updatedReadme = await step.run(
      "update-readme-image-paths",
      async (): Promise<string> => {
        let updatedContent = fragment.readme;

        if (imageAnalysis.hasImages) {
          // Replace Cloudinary URLs with relative paths
          for (const image of imageAnalysis.usedImages) {
            const extension = getFileExtension(image.url, image.mimeType);
            const sanitizedName = sanitizeFilename(image.name);
            const filename = `${sanitizedName}-${image.id.slice(-8)}.${extension}`;
            const relativePath = `./${assetsFolderName}/${filename}`;

            // Replace all occurrences of this image URL
            updatedContent = updatedContent.replace(
              new RegExp(image.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
              relativePath
            );

            // Also try to match by publicId in case URL format differs
            const publicIdPattern = new RegExp(
              `https?://[^\\s]+${image.publicId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\s)]*`,
              'g'
            );
            updatedContent = updatedContent.replace(publicIdPattern, relativePath);
          }
        }

        return updatedContent;
      },
    );

    // Step 10: Get current README SHA (if exists)
    const currentReadmeSha = await step.run(
      "get-readme-sha",
      async (): Promise<string | null> => {
        try {
          const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: "README.md",
            ref: commitBranch,
          });

          if ("sha" in data && !Array.isArray(data)) {
            return data.sha;
          }
          return null;
        } catch (error: unknown) {
          if (isGitHubNotFoundError(error)) {
            return null;
          }
          throw error;
        }
      },
    );

    // Step 11: Commit README
    await step.run("commit-readme", async (): Promise<void> => {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: "README.md",
        message: commitMessage || "Update README.md",
        content: Buffer.from(updatedReadme).toString("base64"),
        branch: commitBranch,
        ...(currentReadmeSha && { sha: currentReadmeSha }),
      });
    });

    // Step 12: Create pull request
    const pullRequest = await step.run("create-pull-request", async () => {
      try {
        const prBody = [
          "This PR updates the README.md file.",
          imageAnalysis.hasImages 
            ? `\n### Images\n- ${imageCommits.committed} image(s) added to \`${assetsFolderName}/\``
            : "",
          imageCommits.skipped > 0 
            ? `- ${imageCommits.skipped} image(s) skipped due to errors`
            : "",
          `\n---\n*Generated from Fragment ${fragmentId}*`,
        ].filter(Boolean).join('\n');

        const { data: pr } = await octokit.rest.pulls.create({
          owner,
          repo,
          title: commitMessage || "Update README.md",
          head: commitBranch,
          base: defaultBranch,
          body: prBody,
        });

        return {
          number: pr.number,
          url: pr.html_url,
          created: true,
        };
      } catch (error: unknown) {
        if (isGitHubUnprocessableError(error)) {
          const { data: prs } = await octokit.rest.pulls.list({
            owner,
            repo,
            head: `${owner}:${commitBranch}`,
            base: defaultBranch,
            state: "open",
          });

          if (prs.length > 0) {
            return {
              number: prs[0].number,
              url: prs[0].html_url,
              created: false,
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
      pullRequest,
      images: {
        total: imageAnalysis.usedImages.length,
        committed: imageCommits.committed,
        skipped: imageCommits.skipped,
        folderCreated: imageAnalysis.hasImages,
        folderName: imageAnalysis.hasImages ? assetsFolderName : null,
      },
    };
  },
);
