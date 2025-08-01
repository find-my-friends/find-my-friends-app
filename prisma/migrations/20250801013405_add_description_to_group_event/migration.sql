/*
  Warnings:

  - Added the required column `description` to the `GroupEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupEvent" ADD COLUMN     "description" TEXT NOT NULL;
