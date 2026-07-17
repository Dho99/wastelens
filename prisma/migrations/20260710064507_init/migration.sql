-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nama" TEXT NOT NULL,
    "saldo_koin" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DINAS" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama_dinas" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,

    CONSTRAINT "DINAS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PETUGAS" (
    "id" UUID NOT NULL,
    "dinas_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,

    CONSTRAINT "PETUGAS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AREA_CAKUPAN" (
    "id" UUID NOT NULL,
    "dinas_id" UUID NOT NULL,
    "nama_wilayah" TEXT NOT NULL,

    CONSTRAINT "AREA_CAKUPAN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KENDARAAN" (
    "id" UUID NOT NULL,
    "dinas_id" UUID NOT NULL,
    "jenis" TEXT NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "current_load" INTEGER NOT NULL,

    CONSTRAINT "KENDARAAN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LAPORAN" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "dinas_id" UUID,
    "petugas_id" UUID,
    "kendaraan_id" UUID,
    "foto_url" TEXT NOT NULL,
    "lokasi_lat" DOUBLE PRECISION NOT NULL,
    "lokasi_lng" DOUBLE PRECISION NOT NULL,
    "kategori_ukuran" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "LAPORAN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FOTO" (
    "id" UUID NOT NULL,
    "laporan_id" UUID NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "FOTO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TRANSAKSI_KOIN" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "laporan_id" UUID NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,

    CONSTRAINT "TRANSAKSI_KOIN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VERIFIKASI_PICKUP" (
    "id" UUID NOT NULL,
    "laporan_id" UUID NOT NULL,
    "foto_sebelum" TEXT NOT NULL,
    "foto_sesudah" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VERIFIKASI_PICKUP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NOTIFIKASI" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "laporan_id" UUID NOT NULL,
    "pesan" TEXT NOT NULL,
    "status_baca" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NOTIFIKASI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KOPDES" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,

    CONSTRAINT "KOPDES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUK" (
    "id" UUID NOT NULL,
    "kopdes_id" UUID NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "harga_koin" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,

    CONSTRAINT "PRODUK_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PENUKARAN" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "produk_id" UUID NOT NULL,
    "jumlah_koin" INTEGER NOT NULL,

    CONSTRAINT "PENUKARAN_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DINAS" ADD CONSTRAINT "DINAS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PETUGAS" ADD CONSTRAINT "PETUGAS_dinas_id_fkey" FOREIGN KEY ("dinas_id") REFERENCES "DINAS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PETUGAS" ADD CONSTRAINT "PETUGAS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AREA_CAKUPAN" ADD CONSTRAINT "AREA_CAKUPAN_dinas_id_fkey" FOREIGN KEY ("dinas_id") REFERENCES "DINAS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KENDARAAN" ADD CONSTRAINT "KENDARAAN_dinas_id_fkey" FOREIGN KEY ("dinas_id") REFERENCES "DINAS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LAPORAN" ADD CONSTRAINT "LAPORAN_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LAPORAN" ADD CONSTRAINT "LAPORAN_dinas_id_fkey" FOREIGN KEY ("dinas_id") REFERENCES "DINAS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LAPORAN" ADD CONSTRAINT "LAPORAN_petugas_id_fkey" FOREIGN KEY ("petugas_id") REFERENCES "PETUGAS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LAPORAN" ADD CONSTRAINT "LAPORAN_kendaraan_id_fkey" FOREIGN KEY ("kendaraan_id") REFERENCES "KENDARAAN"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FOTO" ADD CONSTRAINT "FOTO_laporan_id_fkey" FOREIGN KEY ("laporan_id") REFERENCES "LAPORAN"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TRANSAKSI_KOIN" ADD CONSTRAINT "TRANSAKSI_KOIN_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TRANSAKSI_KOIN" ADD CONSTRAINT "TRANSAKSI_KOIN_laporan_id_fkey" FOREIGN KEY ("laporan_id") REFERENCES "LAPORAN"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VERIFIKASI_PICKUP" ADD CONSTRAINT "VERIFIKASI_PICKUP_laporan_id_fkey" FOREIGN KEY ("laporan_id") REFERENCES "LAPORAN"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NOTIFIKASI" ADD CONSTRAINT "NOTIFIKASI_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NOTIFIKASI" ADD CONSTRAINT "NOTIFIKASI_laporan_id_fkey" FOREIGN KEY ("laporan_id") REFERENCES "LAPORAN"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KOPDES" ADD CONSTRAINT "KOPDES_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRODUK" ADD CONSTRAINT "PRODUK_kopdes_id_fkey" FOREIGN KEY ("kopdes_id") REFERENCES "KOPDES"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PENUKARAN" ADD CONSTRAINT "PENUKARAN_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PENUKARAN" ADD CONSTRAINT "PENUKARAN_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "PRODUK"("id") ON DELETE CASCADE ON UPDATE CASCADE;
