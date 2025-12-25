-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "contextFiles" TEXT[] DEFAULT ARRAY[]::TEXT[];
