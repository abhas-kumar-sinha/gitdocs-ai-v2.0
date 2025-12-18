import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processInstallation } from "@/inngest/functions/processInstallation";
import { syncRepositories } from "@/inngest/functions/syncRepositories";
import { generateAIResponse } from "@/inngest/functions/generateAiResponse";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processInstallation,
    syncRepositories,
    generateAIResponse,
  ],
});
