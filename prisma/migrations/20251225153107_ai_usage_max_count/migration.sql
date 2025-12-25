-- AlterTable
ALTER TABLE "AiUsage" ADD COLUMN     "maxCount" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isHelpful" BOOLEAN;
