-- DropForeignKey
ALTER TABLE "AiUsage" DROP CONSTRAINT "AiUsage_userId_fkey";

-- AddForeignKey
ALTER TABLE "AiUsage" ADD CONSTRAINT "AiUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
