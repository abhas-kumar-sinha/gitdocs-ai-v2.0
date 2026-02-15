import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { GoogleGenAI } from "@google/genai";
import z from "zod";

const getTodayDate = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

const customizeComponent = async (
  template: string,
  instruction: string
): Promise<string> => {
  try {
    const ai = getClient();
    
    const modelId = "gemini-3-flash-preview"; 

    const prompt = `
      You are an expert Markdown developer.
      
      Task: Customize the following generic markdown template based strictly on the user's instruction.
      
      Generic Template:
      ${template}
      
      User Instruction:
      ${instruction}
      
      Rules:
      1. Return ONLY the markdown code.
      2. Do not wrap it in markdown code fences (like \`\`\`markdown). Return raw markdown text.
      3. Maintain the structural integrity of the component (e.g., if it's a table, keep it a table).
      4. If the instruction implies adding content, replace generic placeholders with specific content.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    const text = response.text;
    
    if (text) {
        return text.replace(/^```markdown\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    return template;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const aiUsageRouter = {
  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const today = getTodayDate();

    const user = await ctx.prisma.user.findUnique({
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
    let usage = await ctx.prisma.aiUsage.findUnique({
      where: {
        userId_date: {
          userId: ctx.auth.userId,
          date: today,
        },
      },
    });

    // If no usage exists for today, create one
    if (!usage) {
      usage = await ctx.prisma.aiUsage.create({
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

  getCustomizedComponent: protectedProcedure
    .input(z.object({
      template: z.string(),
      instruction:  z.string(),
    }))
    .mutation(async ({ input }) => {
      const response = await customizeComponent(input.template, input.instruction);

      return {response};
  })
};
