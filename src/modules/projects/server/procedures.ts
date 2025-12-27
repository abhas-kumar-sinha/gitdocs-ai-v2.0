import { z } from 'zod';
import { prisma } from '@/lib/db';
import { TRPCError } from '@trpc/server';
import { inngest } from '@/inngest/client';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { Prisma } from '@/generated/prisma/client';

export type ProjectWithChildren = Prisma.ProjectGetPayload<{
  include: {
    repository: true;
    messages: {
      include: {
        fragment: true;
      };
    };
  };
}>;

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
        name: 'readme/initial.build',
        data: {
          projectId: createdProject.id,
          userId: ctx.auth.userId
        },
      });

      return createdProject;
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      const projects: ProjectWithChildren[] = await prisma.project.findMany({
        where: { userId: ctx.auth.userId },
        include: {
          repository: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { fragment: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return projects;
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

  updateStarred: protectedProcedure
    .input(z.object({ id: z.string(), isStarred: z.boolean() }))
    .mutation(async ({ input }) => {
      const currentProject = await prisma.project.findUnique({
        where: { id: input.id },
        select: { updatedAt: true }
      });

      const project = await prisma.project.update({
        where: { id: input.id },
        data: { 
          isStarred: input.isStarred,
          updatedAt: currentProject?.updatedAt // Keep the original timestamp
        }
      });
      
      return project;
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1).max(100) }))
    .mutation(async ({ input }) => {
      const currentProject = await prisma.project.findUnique({
        where: { id: input.id },
        select: { updatedAt: true }
      });

      const project = await prisma.project.update({
        where: { id: input.id },
        data: { 
          name: input.name,
          updatedAt: currentProject?.updatedAt
        }
      });
      
      return project;
    }),

  createPr: protectedProcedure
    .input(z.object({ id: z.string(), commitMessage: z.string().min(1).max(100), commitBranch: z.string().min(1), fragmentId: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const response = await inngest.send({
        name: 'readme/create.pr',
        data: {
          projectId: input.id,
          commitMessage: input.commitMessage,
          commitBranch: input.commitBranch,
          fragmentId: input.fragmentId
        },
      });

      return response;
    })
});