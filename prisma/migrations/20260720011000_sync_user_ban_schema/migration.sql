ALTER TABLE "user"
ADD COLUMN "isBanned" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "banned_reason" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "alasan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banned_reason_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "banned_reason"
ADD CONSTRAINT "banned_reason_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
