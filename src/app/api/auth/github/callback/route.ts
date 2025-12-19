import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { inngest } from '@/inngest/client';
import { auth } from '@clerk/nextjs/server';
import crypto from "crypto";

function hashClerkId(clerkId: string) {
  return crypto
    .createHmac("sha256", process.env.STATE_ENCRYPTION_KEY!)
    .update(clerkId)
    .digest("hex");
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const installationId = searchParams.get('installation_id');
  const setupAction = searchParams.get('setup_action');
  const state = searchParams.get('state');

  if (!installationId || !state) {
    return redirect('/onboarding?error=missing_params');
  }

  const { userId } = await auth();

  if (!userId) {
    return redirect('/onboarding?error=unauthorized');
  }

  const verifiedUserId = hashClerkId(userId);

  if (verifiedUserId !== state) {
    return redirect('/onboarding?error=unauthorized');
  }

  if (setupAction === 'install' || setupAction === 'update') {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return redirect('/onboarding?error=user_not_found');
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

      return redirect('/onboarding?step=2&status=connected');
    } catch (error) {
      console.error('Installation callback error:', error);
      return redirect('/onboarding?error=installation_failed');
    }
  }

  return redirect('/onboarding');
}