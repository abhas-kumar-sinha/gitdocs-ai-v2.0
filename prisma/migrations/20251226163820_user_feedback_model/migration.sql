/*
  Warnings:

  - You are about to drop the column `feedbackCompleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "feedbackCompleted",
ADD COLUMN     "feedbackRewarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "intent" TEXT[],
    "outcome" TEXT NOT NULL,
    "outputQuality" INTEGER NOT NULL,
    "friction" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "repoType" TEXT[],
    "missingFeature" TEXT,
    "nps" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
