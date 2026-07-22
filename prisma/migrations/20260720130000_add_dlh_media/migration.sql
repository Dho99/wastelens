CREATE TABLE "DLH_MEDIA" (
    "id" UUID NOT NULL,
    "dinas_id" UUID NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'profile',
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DLH_MEDIA_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DLH_MEDIA_dinas_id_kind_idx" ON "DLH_MEDIA"("dinas_id", "kind");

ALTER TABLE "DLH_MEDIA"
ADD CONSTRAINT "DLH_MEDIA_dinas_id_fkey"
FOREIGN KEY ("dinas_id") REFERENCES "DINAS"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
