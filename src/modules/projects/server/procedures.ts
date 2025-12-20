import { z } from 'zod';
import { prisma } from '@/lib/db';
import { TRPCError } from '@trpc/server';
import { inngest } from '@/inngest/client';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        prompt: z.string().min(1, { message: "Prompt cannot be empty" }).max(1000, { message: "Prompt cannot be longer than 1000 characters" }),
        repositoryId: z.string().min(1, { message: "Repository cannot be empty" }),
        template: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: input.name,
          repositoryId: input.repositoryId,
          template: input.template,
          messages: {
            create: {
              content: input.prompt,
              role: 'USER',
              type: 'RESULT',
            },
          }
        },
      });

      await inngest.send({
        name: 'ai/generate-response',
        data: {
          projectId: createdProject.id,
        },
      });

      return createdProject;
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
        throw new TRPCError({ code: 'NOT_FOUND', message: "Project not found" });
      }

      return project;
    }),
});