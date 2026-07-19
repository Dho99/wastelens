/*
  Warnings:

  - A unique constraint covering the columns `[client_request_id]` on the table `LAPORAN` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[laporan_id,jenis]` on the table `TRANSAKSI_KOIN` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TEMPORARY_UPLOAD_STATUS" AS ENUM ('ACTIVE', 'USED', 'EXPIRED');

-- AlterTable
ALTER TABLE "FOTO" ADD COLUMN     "hash" TEXT,
ADD COLUMN     "mime_type" TEXT,
ADD COLUMN     "size_bytes" INTEGER;

-- AlterTable
ALTER TABLE "LAPORAN" ADD COLUMN     "access_obstruction_risk" BOOLEAN DEFAULT false,
ADD COLUMN     "address_text" TEXT,
ADD COLUMN     "analysed_at" TIMESTAMP(3),
ADD COLUMN     "analysis_provider" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "client_request_id" TEXT,
ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "drainage_risk" BOOLEAN DEFAULT false,
ADD COLUMN     "estimated_load_unit" INTEGER,
ADD COLUMN     "lokasi_accuracy" DOUBLE PRECISION,
ADD COLUMN     "lokasi_captured_at" TIMESTAMP(3),
ADD COLUMN     "lokasi_confirmed_lat" DOUBLE PRECISION,
ADD COLUMN     "lokasi_confirmed_lng" DOUBLE PRECISION,
ADD COLUMN     "lokasi_device_lat" DOUBLE PRECISION,
ADD COLUMN     "lokasi_device_lng" DOUBLE PRECISION,
ADD COLUMN     "lokasi_exif_lat" DOUBLE PRECISION,
ADD COLUMN     "lokasi_exif_lng" DOUBLE PRECISION,
ADD COLUMN     "needs_manual_review" BOOLEAN DEFAULT false,
ADD COLUMN     "photo_hash" TEXT,
ADD COLUMN     "photo_mime_type" TEXT,
ADD COLUMN     "photo_size_bytes" INTEGER,
ADD COLUMN     "priority_level" TEXT,
ADD COLUMN     "priority_score" DOUBLE PRECISION,
ADD COLUMN     "priority_weight_version" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "risk_flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "road_name" TEXT,
ADD COLUMN     "visual_indicators" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "waste_types" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "TEMPORARY_UPLOAD" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'cloudinary',
    "public_id" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL DEFAULT 'image',
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "status" "TEMPORARY_UPLOAD_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "TEMPORARY_UPLOAD_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LAPORAN_client_request_id_key" ON "LAPORAN"("client_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "TRANSAKSI_KOIN_laporan_id_jenis_key" ON "TRANSAKSI_KOIN"("laporan_id", "jenis");
