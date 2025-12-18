/*
  Warnings:

  - You are about to drop the column `language` on the `Fragment` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `Fragment` table. All the data in the column will be lost.
  - You are about to drop the `ReadmeVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReadmeVersion" DROP CONSTRAINT "ReadmeVersion_projectId_fkey";

-- AlterTable
ALTER TABLE "Fragment" DROP COLUMN "language",
DROP COLUMN "section";

-- DropTable
DROP TABLE "ReadmeVersion";
