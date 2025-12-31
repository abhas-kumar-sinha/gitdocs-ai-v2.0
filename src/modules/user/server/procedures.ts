import { z } from "zod";
import { prisma } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

const FeedbackInputSchema = z.object({
  intent: z.array(z.string()).min(1),
  outcome: z.enum(["Yes, fully", "Partially", "Not really"]),
  outputQuality: z.number().min(1).max(10),
  friction: z.string().min(1),
  insight: z.string().min(1),

  repoType: z.array(z.string()),
  missingFeature: z.string().optional(),
  nps: z.number().min(1).max(10).optional(),
});

export const userRouter = createTRPCRouter({

  getCurrent: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.auth.userId },
        include: {
          installationMemberships: {
            include: {
              installation: {
                include: {
                  repositories: {
                    take: 10,
                    orderBy: { updatedAt: "desc" },
                    include: {
                      repository: true,
                    },
                  },
                },
              },
            },
          },
          projects: {
            orderBy: { updatedAt: "desc" },
          },
        },
      });

      return user;
    }),


  completeFeedbackForm: protectedProcedure
    .input(FeedbackInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;

      // First, complete the database transaction
      const feedback = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { feedbackRewarded: true },
        });

        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

        // Save feedback (always)
        const feedbackEntry = await tx.feedback.create({
          data: {
            userId,
            ...input,
          },
        });

        // Reward only once
        if (!user.feedbackRewarded) {
          await tx.user.update({
            where: { id: userId },
            data: {
              bonusAiChatCredits: { increment: 5 },
              feedbackRewarded: true,
            },
          });
        }

        return { feedbackEntry, shouldUpdateClerk: !user.feedbackRewarded };
      });

      if (feedback.shouldUpdateClerk) {
        try {
          const client = await clerkClient();
          await client.users.updateUserMetadata(ctx.auth.clerkId, {
            publicMetadata: { feedbackRewarded: true },
          });
        } catch (clerkError) {
          console.error("Failed to update Clerk metadata:", clerkError);
        }
      }

      return feedback.feedbackEntry;
    }),
});
