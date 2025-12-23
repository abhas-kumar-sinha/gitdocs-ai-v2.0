import crypto from "crypto";
import { prisma } from "@/lib/db";
import { redirect } from 'next/navigation';
import { NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { Permission } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {clerkId: userId},
    select: {id: true}
  })

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const permissions = searchParams.get("permissions");

  const installUrl = new URL('https://github.com/apps/gitdocs-ai/installations/new');
  
  const state = crypto.randomUUID();

  // Discarding any previous pending process
  await prisma.installationProcess.updateMany({
    where: {
      userId: user.id,
      status: "PENDING"
    },
    data: {
      status: "FAILED"
    }
  });

  // Then create the new pending process
  await prisma.installationProcess.create({
    data: {
      userId: user.id,
      state,
      permissions: permissions ? permissions === "read" ? Permission.READ : Permission.WRITE : Permission.READ,
      status: "PENDING"
    }
  });

  installUrl.searchParams.set('state', state);

  redirect(installUrl.toString());
}
