import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import crypto from "crypto";

function hashClerkId(clerkId: string) {
  return crypto
    .createHmac("sha256", process.env.STATE_ENCRYPTION_KEY!)
    .update(clerkId)
    .digest("hex");
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const installUrl = new URL('https://github.com/apps/gitdocs-ai/installations/new');
  
  const state = hashClerkId(userId)

  installUrl.searchParams.set('state', state);

  redirect(installUrl.toString());
}