import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { prisma } from '@/lib/db';
import { inngest } from '@/inngest/client';

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure
    .query(async () => {
      const projects = await prisma.project.findMany({
        orderBy: {
          updatedAt: "desc",
        }
      });

      return projects;
    }),
  
  create: baseProcedure
    .input(
      z.object({
        value: z.string()
          .min(1, { message : "Value is Required" })
          .max(1000, { message : "Value is too long" }),
      }),
    )
    .mutation(async ({ input }) => {

      const createdProject = await prisma.project.create({
        data: {
          name: "test",
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            }
          }
        }
      })

      await inngest.send({
          name: "code-agent",
          data: {
              value: input.value,
              projectId: createdProject.id,
          }
      });

      return createdProject;
    })
});

export type ProjectsRouter = typeof projectsRouter;
