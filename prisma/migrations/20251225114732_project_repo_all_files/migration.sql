-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "allFiles" TEXT[] DEFAULT ARRAY[]::TEXT[];
