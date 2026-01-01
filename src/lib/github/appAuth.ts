import { App } from "octokit";

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
});

export { app };

export async function getInstallationOctokit(installationId: number) {
  const octokit = await app.getInstallationOctokit(installationId);

  return octokit;
}

export function getAppOctokit() {
  return app.octokit;
}
