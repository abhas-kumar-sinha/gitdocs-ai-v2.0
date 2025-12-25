import { z } from 'zod';
import { prisma } from '@/lib/db';
import { inngest } from '@/inngest/client';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { Prisma } from '@/generated/prisma/client';

type messageWithFragment = 
  Prisma.MessageGetPayload<{
    include: {
      fragment: true;
    };
  }>;

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const messages: messageWithFragment[] = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          fragment: true,
        },
        orderBy: {
          updatedAt: "asc",
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
          name: "readme/chat.upgrade",
          data: {
            projectId: input.projectId,
            messageId: newMessage.id
          }
        })

        return newMessage
    })
});

export type MessagesRouter = typeof messagesRouter;
