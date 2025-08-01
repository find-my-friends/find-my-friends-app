/*
  Warnings:

  - The primary key for the `GroupEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdById` on the `GroupEvent` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `GroupEvent` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `GroupEvent` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `GroupEvent` table. All the data in the column will be lost.
  - You are about to drop the `Stuff` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `datetime` to the `GroupEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `GroupEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupEvent" DROP CONSTRAINT "GroupEvent_pkey",
DROP COLUMN "createdById",
DROP COLUMN "date",
DROP COLUMN "description",
DROP COLUMN "tags",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "datetime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hostId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GroupEvent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GroupEvent_id_seq";

-- DropTable
DROP TABLE "Stuff";

-- DropEnum
DROP TYPE "Condition";

-- CreateTable
CREATE TABLE "_RSVPs" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RSVPs_AB_unique" ON "_RSVPs"("A", "B");

-- CreateIndex
CREATE INDEX "_RSVPs_B_index" ON "_RSVPs"("B");

-- AddForeignKey
ALTER TABLE "GroupEvent" ADD CONSTRAINT "GroupEvent_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RSVPs" ADD CONSTRAINT "_RSVPs_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RSVPs" ADD CONSTRAINT "_RSVPs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
