import { protectedProcedure } from "@/trpc/init";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";

const getTodayDate = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

export const aiUsageRouter = {
  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const today = getTodayDate();

    const user = await prisma.user.findUnique({
      where: {
        id: ctx.auth.userId,
      },
      select: {
        bonusAiChatCredits: true,
        dailyAiChatLimit: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Try to find today's usage
    let usage = await prisma.aiUsage.findUnique({
      where: {
        userId_date: {
          userId: ctx.auth.userId,
          date: today,
        },
      },
    });

    // If no usage exists for today, create one
    if (!usage) {
      usage = await prisma.aiUsage.create({
        data: {
          userId: ctx.auth.userId,
          date: today,
          count: 0,
          maxCount: user.bonusAiChatCredits + user.dailyAiChatLimit,
        },
      });
    }

    return usage;
  }),
};
