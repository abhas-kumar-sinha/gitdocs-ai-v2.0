/*
  Warnings:

  - Added the required column `accountName` to the `Installation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Installation" ADD COLUMN     "accountName" TEXT NOT NULL;
