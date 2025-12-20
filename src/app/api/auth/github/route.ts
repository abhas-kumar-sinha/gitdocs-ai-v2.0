import crypto from "crypto";
import { prisma } from "@/lib/db";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function GET() {
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
      status: "PENDING"
    }
  });

  installUrl.searchParams.set('state', state);

  redirect(installUrl.toString());
}