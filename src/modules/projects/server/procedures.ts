import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { prisma } from '@/lib/db';
import { inngest } from '@/inngest/client';

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        repositoryId: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: input.name,
          repositoryId: input.repositoryId,
          description: input.description,
        },
      });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.project.findMany({
      where: { userId: ctx.auth.userId },
      include: {
        repository: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        include: {
          repository: true,
          messages: {
            include: { fragment: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return project;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create user message
      const message = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.content,
          role: 'USER',
          type: 'RESULT',
        },
      });

      // Trigger AI response
      await inngest.send({
        name: 'ai/generate-response',
        data: {
          projectId: input.projectId,
          messageId: message.id,
          userId: ctx.auth.userId,
        },
      });

      return message;
    }),
});