/*
  Warnings:

  - You are about to drop the column `coachingTipsId` on the `DietTip` table. All the data in the column will be lost.
  - You are about to drop the column `coachingTipsId` on the `ExerciseTip` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CoachingTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Music` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Track` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `DietTip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ExerciseTip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'THERAPIST');

-- DropForeignKey
ALTER TABLE "CoachingTips" DROP CONSTRAINT "CoachingTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "DietTip" DROP CONSTRAINT "DietTip_coachingTipsId_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseTip" DROP CONSTRAINT "ExerciseTip_coachingTipsId_fkey";

-- DropForeignKey
ALTER TABLE "Mood" DROP CONSTRAINT "Mood_userId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_musicId_fkey";

-- AlterTable
ALTER TABLE "DietTip" DROP COLUMN "coachingTipsId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExerciseTip" DROP COLUMN "coachingTipsId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mood",
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "salt" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "CoachingTips";

-- DropTable
DROP TABLE "Mood";

-- DropTable
DROP TABLE "Music";

-- DropTable
DROP TABLE "Track";

-- AddForeignKey
ALTER TABLE "ExerciseTip" ADD CONSTRAINT "ExerciseTip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietTip" ADD CONSTRAINT "DietTip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
