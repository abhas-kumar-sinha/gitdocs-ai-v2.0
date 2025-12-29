/*
  Warnings:

  - You are about to drop the column `userId` on the `Installation` table. All the data in the column will be lost.
  - You are about to drop the column `installationId` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncedAt` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `syncStatus` on the `Repository` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fullName]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Installation" DROP CONSTRAINT "Installation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_installationId_fkey";

-- DropIndex
DROP INDEX "Installation_userId_idx";

-- DropIndex
DROP INDEX "Repository_installationId_idx";

-- AlterTable
ALTER TABLE "Installation" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "installationId",
DROP COLUMN "lastSyncedAt",
DROP COLUMN "syncStatus";

-- CreateTable
CREATE TABLE "InstallationMember" (
    "id" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallationRepository" (
    "id" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallationRepository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstallationMember_userId_idx" ON "InstallationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallationMember_installationId_userId_key" ON "InstallationMember"("installationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallationRepository_installationId_repositoryId_key" ON "InstallationRepository"("installationId", "repositoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_fullName_key" ON "Repository"("fullName");

-- AddForeignKey
ALTER TABLE "InstallationMember" ADD CONSTRAINT "InstallationMember_installationId_fkey" FOREIGN KEY ("installationId") REFERENCES "Installation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationMember" ADD CONSTRAINT "InstallationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationRepository" ADD CONSTRAINT "InstallationRepository_installationId_fkey" FOREIGN KEY ("installationId") REFERENCES "Installation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationRepository" ADD CONSTRAINT "InstallationRepository_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
