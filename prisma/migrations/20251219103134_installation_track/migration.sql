-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- CreateTable
CREATE TABLE "InstallationProcess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "InstallationProcess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InstallationProcess" ADD CONSTRAINT "InstallationProcess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
