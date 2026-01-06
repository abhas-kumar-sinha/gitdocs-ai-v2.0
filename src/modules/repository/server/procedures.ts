import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/inngest/client";

export const repositoryRouter = createTRPCRouter({
  syncRepositories: protectedProcedure
    .input(
      z.object({
        installationId: z
          .string()
          .min(1, { message: "Installation ID is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const installation = await ctx.prisma.installation.findFirst({
        where: {
          id: input.installationId,
          members: { some: { userId: ctx.auth.userId } },
        },
      });

      if (!installation) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await inngest.send({
        name: "github/sync-repositories",
        data: {
          installationId: installation.id,
        },
      });

      return { success: true };
    }),
});
