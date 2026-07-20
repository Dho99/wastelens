/*
  Warnings:

  - You are about to drop the column `nama` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "nama",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_number" TEXT;

-- CreateTable
CREATE TABLE "banned_reason" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "alasan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banned_reason_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "banned_reason" ADD CONSTRAINT "banned_reason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
