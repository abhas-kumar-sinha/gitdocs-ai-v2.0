import { prisma } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.auth.userId },
        include: {
          installations: {
            include: {
              repositories: {
                take: 10,
                orderBy: { updatedAt: 'desc' },
              },
            },
          },
          projects: {
            orderBy: { updatedAt: 'desc' },
          },
        },
      });

      return user;
    }),

  completeOnboarding: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = await prisma.user.update({
        where: { id: ctx.auth.userId },
        data: { onboardingCompleted: true },
      });

      const client = await clerkClient()
      
      client.users.updateUserMetadata(ctx.auth.userId!, {
        publicMetadata: { onboardingCompleted: true },
      });

      return user;
    }),
});