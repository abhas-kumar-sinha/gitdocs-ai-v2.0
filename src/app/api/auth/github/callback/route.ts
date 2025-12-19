import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { inngest } from '@/inngest/client';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const installationId = searchParams.get('installation_id');
  const setupAction = searchParams.get('setup_action');
  const state = searchParams.get('state');

  if (!installationId || !state) {
    return redirect('/github/install?error=missing_params');
  }

  const { userId } = await auth();

  if (!userId) {
    return redirect('/github/install?error=unauthorized');
  }

  const verified = await prisma.installationProcess.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {state: true}
  });

  if (verified?.state !== state) {
    return redirect('/github/install?error=unauthorized');
  }

  if (setupAction === 'install' || setupAction === 'update') {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return redirect('/github/install?error=user_not_found');
      }

      // Trigger Inngest to process installation
      await inngest.send({
        name: 'github/process-installation',
        data: {
          userId: user.id,
          installationId: parseInt(installationId),
          action: setupAction,
        },
      });

      return redirect('/github/install?status=connected');
    } catch (error) {
      console.error('Installation callback error:', error);
      return redirect('/github/install?error=installation_failed');
    }
  }

  return redirect('/github/install');
}