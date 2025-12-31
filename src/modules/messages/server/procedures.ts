import { z } from "zod";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Prisma } from "@/generated/prisma/client";

type messageWithFragment = Prisma.MessageGetPayload<{
  include: {
    fragment: true;
    images: true;
  };
}>;

export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const messages: messageWithFragment[] = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          fragment: true,
          images: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });

      return messages;
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Value is Required" })
          .max(1000, { message: "Value is too long" }),
        projectId: z.string().min(1, { message: "Project ID is Required" }),
        images: z
          .array(
            z.object({
              name: z.string(),
              mimeType: z.string(),
              size: z.number(),
              url: z.string(),
              publicId: z.string(),
              width: z.number().optional(),
              height: z.number().optional(),
              role: z
                .enum(["BANNER", "SCREENSHOT", "DIAGRAM", "LOGO", "OTHER"])
                .optional(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.$transaction(async (tx) => {
        // 1️⃣ Create the message
        const newMessage = await tx.message.create({
          data: {
            projectId: input.projectId,
            content: input.value,
            role: "USER",
            type: "RESULT",
          },
        });

        // 2️⃣ Create images linked to BOTH project & message
        if (input.images?.length) {
          await tx.image.createMany({
            data: input.images.map((img) => ({
              projectId: input.projectId,
              messageId: newMessage.id,

              name: img.name,
              mimeType: img.mimeType,
              size: img.size,
              role: img.role ?? "SCREENSHOT",

              url: img.url,
              publicId: img.publicId,

              width: img.width,
              height: img.height,
            })),
          });
        }

        // 3️⃣ Trigger async AI job
        await inngest.send({
          name: "readme/chat.upgrade",
          data: {
            projectId: input.projectId,
            messageId: newMessage.id,
            userId: ctx.auth.userId,
          },
        });

        return newMessage;
      });
    }),

});

export type MessagesRouter = typeof messagesRouter;
