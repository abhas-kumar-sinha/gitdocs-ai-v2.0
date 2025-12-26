/*
  Warnings:

  - You are about to drop the column `onboardingCompleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "onboardingCompleted",
ADD COLUMN     "bonusAiChatCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "feedbackCompleted" BOOLEAN NOT NULL DEFAULT false;
