import crypto from "crypto";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Permission } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const permissionsParam = searchParams.get("permissions");

    // Determine permissions to use
    let permissionToSet: Permission;

    if (permissionsParam === "existing") {
      const existing = await prisma.installation.findFirst({
        where: { userId: user.id },
        select: { permissions: true },
      });

      if (!existing || !existing.permissions) {
        return new Response(
          "No existing installation found. Cannot use existing permissions.",
          { status: 400 },
        );
      }

      permissionToSet = existing.permissions;
    } else if (permissionsParam === "write") {
      permissionToSet = Permission.WRITE;
    } else {
      // Default to READ (includes null, "read", or any other value)
      permissionToSet = Permission.READ;
    }

    const state = crypto.randomUUID();

    // Use a transaction to avoid race conditions
    await prisma.$transaction(async (tx) => {
      // Cancel any pending processes
      await tx.installationProcess.updateMany({
        where: {
          userId: user.id,
          status: "PENDING",
        },
        data: {
          status: "FAILED",
        },
      });

      // Create new pending process
      await tx.installationProcess.create({
        data: {
          userId: user.id,
          state,
          permissions: permissionToSet,
          status: "PENDING",
        },
      });
    });

    const installUrl = new URL(
      "https://github.com/apps/gitdocs-ai/installations/new",
    );
    installUrl.searchParams.set("state", state);

    return NextResponse.redirect(installUrl.toString());
  } catch (error) {
    console.error("GitHub installation setup error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
