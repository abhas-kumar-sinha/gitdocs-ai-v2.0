import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/inngest/client";
import { Prisma } from "@/generated/prisma/client";

export type InstallationWithRepositories = Prisma.InstallationGetPayload<{
  include: {
    repositories: {
      include: {
        repository: true;
      };
    };
  };
}>;

export const installationRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const installations: InstallationWithRepositories[] =
      await ctx.prisma.installation.findMany({
        where: {
          members: {
            some: {
              userId: ctx.auth.userId,
            },
          },
        },
        include: {
          repositories: {
            orderBy: { updatedAt: "desc" },
            include: {
              repository: true,
            },
          },
        },
      });

    return installations;
  }),

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
          members: {
            some: {
              userId: ctx.auth.userId,
            },
          },
        },
      });

      if (!installation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Installation not found or access denied",
        });
      }

      await inngest.send({
        name: "github/sync-repositories",
        data: {
          installationId: installation.id,
        },
      });

      return { success: true };
    }),

  updateInstallationAccess: protectedProcedure
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
          members: {
            some: {
              userId: ctx.auth.userId,
            },
          },
        },
        select: {
          permissions: true,
        },
      });

      if (!installation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Installation not found or access denied",
        });
      }

      const updatedInstallation = await ctx.prisma.installation.update({
        where: {
          id: input.installationId,
        },
        data: {
          permissions:
            installation.permissions === "WRITE" ? "READ" : "WRITE",
        },
      });

      return updatedInstallation;
    }),
});
