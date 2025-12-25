import { protectedProcedure } from "@/trpc/init";
import { prisma } from "@/lib/db";

const getTodayDate = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

export const aiUsageRouter = {
  getUsage: protectedProcedure
    .query(async ({ ctx }) => {
      const today = getTodayDate();
      
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
            maxCount: 5,
          },
        });
      }

      return usage;
    }),

};