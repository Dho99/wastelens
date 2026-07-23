-- CreateEnum
CREATE TYPE "ROUTE_STATUS" AS ENUM ('DRAFT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "DISPATCH_ROUTE" (
    "id" UUID NOT NULL,
    "dinas_id" UUID NOT NULL,
    "petugas_id" UUID NOT NULL,
    "kendaraan_id" UUID NOT NULL,
    "status" "ROUTE_STATUS" NOT NULL DEFAULT 'CONFIRMED',
    "estimated_distance_km" DOUBLE PRECISION,
    "estimated_duration_minutes" INTEGER,
    "total_load_kg" INTEGER NOT NULL DEFAULT 0,
    "route_geometry" JSONB,
    "routing_source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DISPATCH_ROUTE_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "LAPORAN" ADD COLUMN "route_id" UUID;

-- CreateIndex
CREATE INDEX "DISPATCH_ROUTE_dinas_id_status_idx" ON "DISPATCH_ROUTE"("dinas_id", "status");
CREATE INDEX "DISPATCH_ROUTE_kendaraan_id_status_idx" ON "DISPATCH_ROUTE"("kendaraan_id", "status");
CREATE INDEX "DISPATCH_ROUTE_petugas_id_status_idx" ON "DISPATCH_ROUTE"("petugas_id", "status");
CREATE INDEX "LAPORAN_route_id_idx" ON "LAPORAN"("route_id");

-- AddForeignKey
ALTER TABLE "DISPATCH_ROUTE" ADD CONSTRAINT "DISPATCH_ROUTE_dinas_id_fkey" FOREIGN KEY ("dinas_id") REFERENCES "DINAS"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DISPATCH_ROUTE" ADD CONSTRAINT "DISPATCH_ROUTE_petugas_id_fkey" FOREIGN KEY ("petugas_id") REFERENCES "PETUGAS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DISPATCH_ROUTE" ADD CONSTRAINT "DISPATCH_ROUTE_kendaraan_id_fkey" FOREIGN KEY ("kendaraan_id") REFERENCES "KENDARAAN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LAPORAN" ADD CONSTRAINT "LAPORAN_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "DISPATCH_ROUTE"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: group active assigned reports into DispatchRoute rows
DO $$
DECLARE
  grp RECORD;
  new_route_id UUID;
  route_status "ROUTE_STATUS";
  total_load INTEGER;
BEGIN
  FOR grp IN
    SELECT petugas_id, kendaraan_id, dinas_id,
           BOOL_OR(status = 'DIJEMPUT') AS has_in_progress,
           COALESCE(SUM(COALESCE(assigned_load_kg, 0)), 0)::INTEGER AS load_sum
    FROM "LAPORAN"
    WHERE petugas_id IS NOT NULL
      AND kendaraan_id IS NOT NULL
      AND dinas_id IS NOT NULL
      AND status IN ('PENDING', 'DIJEMPUT')
      AND route_id IS NULL
    GROUP BY petugas_id, kendaraan_id, dinas_id
  LOOP
    route_status := CASE WHEN grp.has_in_progress THEN 'IN_PROGRESS'::"ROUTE_STATUS" ELSE 'CONFIRMED'::"ROUTE_STATUS" END;
    total_load := grp.load_sum;
    new_route_id := gen_random_uuid();

    INSERT INTO "DISPATCH_ROUTE" (
      "id", "dinas_id", "petugas_id", "kendaraan_id", "status",
      "total_load_kg", "created_at", "updated_at"
    ) VALUES (
      new_route_id, grp.dinas_id, grp.petugas_id, grp.kendaraan_id, route_status,
      total_load, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    );

    UPDATE "LAPORAN"
    SET route_id = new_route_id
    WHERE petugas_id = grp.petugas_id
      AND kendaraan_id = grp.kendaraan_id
      AND dinas_id = grp.dinas_id
      AND status IN ('PENDING', 'DIJEMPUT')
      AND route_id IS NULL;
  END LOOP;
END $$;
