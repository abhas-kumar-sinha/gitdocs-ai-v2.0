import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { prisma } from '@/lib/db';
import { inngest } from '@/inngest/client';

export const installationRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return prisma.installation.findMany({
        where: { userId: ctx.auth.userId },
        include: {
          repositories: {
            orderBy: { updatedAt: 'desc' },
          },
        },
      });
    }),

  syncRepositories: protectedProcedure
    .input(z.object({ installationId: z.string().min(1, { message: 'Installation ID is required' }) }))
    .mutation(async ({ ctx, input }) => {
      const installation = await prisma.installation.findFirst({
        where: {
          id: input.installationId,
          userId: ctx.auth.userId,
        },
      });

      if (!installation) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await inngest.send({
        name: 'github/sync-repositories',
        data: {
          installationId: installation.id,
          userId: ctx.auth.userId,
        },
      });

      return { success: true };
    }),
});