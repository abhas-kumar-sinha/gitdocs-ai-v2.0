import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { createReadmePr } from "@/inngest/functions/commitReadme";
import { syncRepositories } from "@/inngest/functions/syncRepositories";
import { chatUpgradeReadme } from "@/inngest/functions/chatUpgradeReadme";
import { initialReadmeBuild } from "@/inngest/functions/initialReadmeBuild";
import { processInstallation } from "@/inngest/functions/processInstallation";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processInstallation,
    syncRepositories,
    initialReadmeBuild,
    chatUpgradeReadme,
    createReadmePr,
  ],
});
