import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Prisma } from "@/generated/prisma/client";

export type ProjectWithChildren = Prisma.ProjectGetPayload<{
  include: {
    repository: true;
    messages: {
      include: {
        fragment: true;
      };
    };
    images: true;
  };
}>;

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        prompt: z
          .string()
          .min(1, { message: "Prompt cannot be empty" })
          .max(1000, {
            message: "Prompt cannot be longer than 1000 characters",
          }),
        repositoryId: z
          .string()
          .min(1, { message: "Repository cannot be empty" }),
        template: z.string(),
        images: z.array(
          z.object({
            name: z.string(),
            mimeType: z.string(),
            size: z.number(),
            url: z.string(),
            publicId: z.string(),
            width: z.number().optional(),
            height: z.number().optional(),
            role: z.enum(["BANNER", "SCREENSHOT", "DIAGRAM", "LOGO", "OTHER"])
              .optional(),
          })
        ).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        // 1. Create project
        const project = await tx.project.create({
          data: {
            userId: ctx.auth.userId,
            name: input.name,
            repositoryId: input.repositoryId,
            template: input.template,
          },
        });

        // 2. Create message
        const message = await tx.message.create({
          data: {
            projectId: project.id,
            content: input.prompt,
            role: "USER",
            type: "RESULT",
          },
        });

        // 3. Create images (linked to BOTH)
        if (input.images?.length) {
          await tx.image.createMany({
            data: input.images.map((img) => ({
              projectId: project.id,
              messageId: message.id,

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

        // 4. Trigger async job
        await inngest.send({
          name: "readme/initial.build",
          data: {
            projectId: project.id,
            userId: ctx.auth.userId,
          },
        });

        return project;
      });
    }),


  list: protectedProcedure.query(async ({ ctx }) => {
    const projects: ProjectWithChildren[] = await ctx.prisma.project.findMany({
      where: { userId: ctx.auth.userId },
      include: {
        repository: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { fragment: true },
        },
        images: true
      },
      orderBy: { updatedAt: "desc" },
    });

    return projects;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        include: {
          repository: true,
          messages: {
            include: { fragment: true },
            orderBy: { createdAt: "asc" },
          },
          images: true
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  updateStarred: protectedProcedure
    .input(z.object({ id: z.string(), isStarred: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const currentProject = await ctx.prisma.project.findUnique({
        where: { id: input.id, userId: ctx.auth.userId },
        select: { updatedAt: true },
      });

      const project = await ctx.prisma.project.update({
        where: { id: input.id },
        data: {
          isStarred: input.isStarred,
          updatedAt: currentProject?.updatedAt, // Keep the original timestamp
        },
      });

      return project;
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1).max(100) }))
    .mutation(async ({ input, ctx }) => {
      const currentProject = await ctx.prisma.project.findUnique({
        where: { id: input.id, userId: ctx.auth.userId },
        select: { updatedAt: true },
      });

      const project = await ctx.prisma.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          updatedAt: currentProject?.updatedAt,
        },
      });

      return project;
    }),

  createPr: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        commitMessage: z.string().min(1).max(100),
        commitBranch: z.string().min(1),
        fragmentId: z.string().min(1),
        assetsFolder: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await inngest.send({
        name: "readme/create.pr",
        data: {
          projectId: input.id,
          commitMessage: input.commitMessage,
          commitBranch: input.commitBranch,
          fragmentId: input.fragmentId,
          assetsFolder: input.assetsFolder,
        },
      });

      return response;
    }),
});
