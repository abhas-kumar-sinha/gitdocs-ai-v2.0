/*
  Warnings:

  - The `permissions` column on the `Installation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('READ', 'WRITE');

-- AlterTable
ALTER TABLE "Installation" DROP COLUMN "permissions",
ADD COLUMN     "permissions" "Permission" NOT NULL DEFAULT 'READ';

-- AlterTable
ALTER TABLE "InstallationProcess" ADD COLUMN     "permissions" "Permission" NOT NULL DEFAULT 'READ',
ALTER COLUMN "status" SET DEFAULT 'PENDING';
