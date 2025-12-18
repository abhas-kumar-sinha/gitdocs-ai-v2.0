import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { prisma } from '@/lib/db';
import { inngest } from '@/inngest/client';

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .query(async () => {
      const messages = await prisma.message.findMany({
        orderBy: {
          updatedAt: "desc",
        }
      });

      return messages;
    }),
  
  create: baseProcedure
    .input(
      z.object({
        value: z.string()
          .min(1, { message : "Value is Required" })
          .max(1000, { message : "Value is too long" }),
        projectId: z.string()
          .min(1, { message : "Project ID is Required" })
      }),
    )
    .mutation(async ({ input }) => {
        const newMessage = await prisma.message.create({
          data: {
            projectId: input.projectId,
            content: input.value,
            role: "USER",
            type: "RESULT",
          }
        })

        await inngest.send({
          name: "code-agent",
          data: {
              value: input.value,
              projectId: input.projectId,
          }
        })

        return newMessage
    })
});

export type MessagesRouter = typeof messagesRouter;
