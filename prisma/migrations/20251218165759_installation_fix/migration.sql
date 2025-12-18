/*
  Warnings:

  - You are about to drop the column `accountLogin` on the `Installation` table. All the data in the column will be lost.
  - You are about to drop the column `accountType` on the `Installation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Installation" DROP COLUMN "accountLogin",
DROP COLUMN "accountType";
