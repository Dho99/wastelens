-- AlterTable
ALTER TABLE "LAPORAN" ADD COLUMN     "assigned_load_kg" INTEGER,
ADD COLUMN     "load_released_at" TIMESTAMP(3),
ADD COLUMN     "route_order" INTEGER;

-- CreateTable
CREATE TABLE "AUTO_COLLECTIVE_REQUEST" (
    "id" UUID NOT NULL,
    "dinas_id" UUID NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "request_hash" TEXT NOT NULL,
    "response_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AUTO_COLLECTIVE_REQUEST_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AUTO_COLLECTIVE_REQUEST_dinas_id_created_at_idx" ON "AUTO_COLLECTIVE_REQUEST"("dinas_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "AUTO_COLLECTIVE_REQUEST_dinas_id_idempotency_key_key" ON "AUTO_COLLECTIVE_REQUEST"("dinas_id", "idempotency_key");

-- AddForeignKey
ALTER TABLE "AUTO_COLLECTIVE_REQUEST" ADD CONSTRAINT "AUTO_COLLECTIVE_REQUEST_dinas_id_fkey" FOREIGN KEY ("dinas_id") REFERENCES "DINAS"("id") ON DELETE CASCADE ON UPDATE CASCADE;
