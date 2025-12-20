import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { prisma } from '@/lib/db';
import { inngest } from '@/inngest/client';
import { Prisma } from '@/generated/prisma/client';

type InstallationWithRepositories =
  Prisma.InstallationGetPayload<{
    include: {
      repositories: true;
    };
  }>;

export const installationRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const installations: InstallationWithRepositories[] = await prisma.installation.findMany({
        where: { userId: ctx.auth.userId },
        include: {
          repositories: {
            orderBy: { updatedAt: 'desc' },
          },
        },
      });

      return installations;
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
        },
      });

      return { success: true };
    }),
});