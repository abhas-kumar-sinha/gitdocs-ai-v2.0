import { subscribeToProgress } from '@/lib/redis';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  const { projectId } = await params;
  const encoder = new TextEncoder();

  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const cleanup = (unsubscribe?: () => void, heartbeat?: NodeJS.Timeout) => {
        if (closed) return;
        closed = true;

        if (heartbeat) clearInterval(heartbeat);
        if (unsubscribe) unsubscribe();

        try {
          controller.close();
        } catch {}
      };

      // Initial connect event
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: 'connected',
            stage: 'CONNECTED',
            progress: 0,
            message: 'Connected',
            timestamp: Date.now(),
          })}\n\n`
        )
      );

      // Subscribe to Redis
      const unsubscribe = subscribeToProgress(projectId, (data) => {
        if (closed) return;

        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );

          // ✅ Final event → cleanup EVERYTHING
          if (data.completed || data.error) {
            setTimeout(() => cleanup(unsubscribe, heartbeat), 500);
          }
        } catch (e) {
          console.warn(e)
          cleanup(unsubscribe, heartbeat);
        }
      });

      // Heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          cleanup(unsubscribe, heartbeat);
        }
      }, 15000);

      // Client disconnect
      request.signal.addEventListener('abort', () => {
        cleanup(unsubscribe, heartbeat);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
