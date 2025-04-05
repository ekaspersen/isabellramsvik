/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "cloudinaryId" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "updatedAt";
