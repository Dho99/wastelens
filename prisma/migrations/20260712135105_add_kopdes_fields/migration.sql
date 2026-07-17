/*
  Warnings:

  - Added the required column `updatedAt` to the `PENUKARAN` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PRODUK` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PENUKARAN" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "qr_token" TEXT,
ADD COLUMN     "redeemed_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PRODUK" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
