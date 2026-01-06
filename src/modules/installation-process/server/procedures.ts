import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Status } from "@/generated/prisma/enums";
import z from "zod";

export const installationProcessRouter = createTRPCRouter({
  findRecent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.installationProcess.findFirst({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        status: z.enum(Status),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.installationProcess.updateMany({
        where: {
          userId: ctx.auth.userId,
          status: Status.PENDING,
        },
        data: {
          status: input.status,
        },
      });
      return { success: true };
    }),
});
