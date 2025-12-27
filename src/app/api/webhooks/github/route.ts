import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyGitHubWebhook } from "@/lib/github/verifyWebhook";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  const headersList = await headers();
  const signature = headersList.get("x-hub-signature-256");
  const event = headersList.get("x-github-event");

  if (!signature || !event) {
    return new Response("Missing headers", { status: 400 });
  }

  const payload = await req.text();

  // Verify webhook signature
  const isValid = verifyGitHubWebhook(
    payload,
    signature,
    process.env.GITHUB_WEBHOOK_SECRET!,
  );

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  const data = JSON.parse(payload);

  // Log webhook event
  await prisma.webhookEvent.create({
    data: {
      eventType: event,
      action: data.action,
      installationId: data.installation?.id?.toString(),
      repositoryId: data.repository?.id?.toString(),
      senderId: data.sender?.id?.toString(),
      payload: data,
    },
  });

  // Handle different event types
  switch (event) {
    case "installation":
      await handleInstallation(data);
      break;
    case "installation_repositories":
      await handleInstallationRepositories(data);
      break;
    case "push":
      await handlePush(data);
      break;
    default:
      console.log(`Unhandled event: ${event}`);
  }

  return new Response("Webhook processed", { status: 200 });
}

async function handleInstallation(data: any) {
  const { action, installation, repositories, sender } = data;

  if (action === "created") {
    // Installation created - trigger sync
    console.log("managed");
  } else if (action === "deleted") {
    // Installation deleted - cleanup
    await prisma.installation.delete({
      where: { installationId: installation.id.toString() },
    });
  } else if (action === "suspend") {
    await prisma.installation.update({
      where: { installationId: installation.id.toString() },
      data: { suspended: true, suspendedAt: new Date() },
    });
  } else if (action === "unsuspend") {
    await prisma.installation.update({
      where: { installationId: installation.id.toString() },
      data: { suspended: false, suspendedAt: null },
    });
  }
}

async function handleInstallationRepositories(data: any) {
  const { action, installation, repositories_removed } = data;

  if (action === "added") {
    await inngest.send({
      name: "github/sync-repositories",
      data: {
        installationId: installation.id,
      },
    });
  } else if (action === "removed") {
    const repoIds = repositories_removed.map((r: any) => r.id.toString());
    await prisma.repository.deleteMany({
      where: { githubId: { in: repoIds } },
    });
  }
}

async function handlePush(data: any) {
  const { repository, installation, commits } = data;

  // Check if README was updated
  const readmeUpdated = commits.some((commit: any) => {
    return (
      commit.added?.includes("README.md") ||
      commit.modified?.includes("README.md")
    );
  });

  if (readmeUpdated) {
    await inngest.send({
      name: "github/readme-updated",
      data: {
        installationId: installation.id,
        repositoryId: repository.id,
        repositoryName: repository.full_name,
      },
    });
  }
}
