/*
  Preflight: Validate no unknown status values exist before migration
*/
DO $$
DECLARE
  invalid_statuses TEXT;
BEGIN
  SELECT string_agg(DISTINCT "status", ', ')
  INTO invalid_statuses
  FROM "LAPORAN"
  WHERE "status" NOT IN (
    'ANALYZED', 'WAITING', 'PENDING',
    'DIPROSES', 'DIJEMPUT', 'SELESAI', 'DITOLAK', 'REJECTED'
  );

  IF invalid_statuses IS NOT NULL THEN
    RAISE EXCEPTION 'Status LAPORAN tidak dikenal: %', invalid_statuses;
  END IF;
END $$;

/*
  Data migration: convert legacy status values before altering column type
*/
UPDATE "LAPORAN" SET "status" = 'DIJEMPUT' WHERE "status" = 'DIPROSES';
UPDATE "LAPORAN" SET "status" = 'DITOLAK' WHERE "status" = 'REJECTED';

-- CreateEnum
CREATE TYPE "LAPORAN_STATUS" AS ENUM ('ANALYZED', 'WAITING', 'PENDING', 'DIJEMPUT', 'SELESAI', 'DITOLAK');

-- AlterTable: convert TEXT status to LAPORAN_STATUS enum with USING clause
ALTER TABLE "LAPORAN"
  ALTER COLUMN "status" TYPE "LAPORAN_STATUS"
  USING "status"::text::"LAPORAN_STATUS";

-- AlterTable: add correction columns
ALTER TABLE "LAPORAN"
  ADD COLUMN "corrected_access_obstruction_risk" BOOLEAN,
  ADD COLUMN "corrected_at" TIMESTAMP(3),
  ADD COLUMN "corrected_by" TEXT,
  ADD COLUMN "corrected_drainage_risk" BOOLEAN,
  ADD COLUMN "corrected_kategori_ukuran" TEXT,
  ADD COLUMN "correction_reason" TEXT;

-- AlterTable: add metadata column to TransaksiKoin
ALTER TABLE "TRANSAKSI_KOIN" ADD COLUMN "metadata" JSONB;

-- RenameIndex
ALTER INDEX "TRANSAKSI_KOIN_laporan_id_jenis_key" RENAME TO "uq_reward_laporan_jenis";
