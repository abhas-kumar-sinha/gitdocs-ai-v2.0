import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const installUrl = new URL('https://github.com/apps/gitdocs-ai/installations/new');
  installUrl.searchParams.set('state', userId);

  redirect(installUrl.toString());
}