import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../lib/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 86400000)
  const threeDaysAgo = new Date(now.getTime() - 3 * 86400000)
  const oneWeekAgo = new Date(now.getTime() - 7 * 86400000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 86400000)
  const tomorrow = new Date(now.getTime() + 86400000)
  const twoDaysLater = new Date(now.getTime() + 2 * 86400000)

  // ─── 1. USERS ─────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      id: 'admin-001',
      name: 'Admin Utama',
      email: 'admin@wastelens.com',
      emailVerified: true,
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=Admin',
      createdAt: twoWeeksAgo,
      updatedAt: now,
      address: 'Jl. Sudirman No. 1, Jakarta Pusat',
      phoneNumber: '081234567890',
      saldo_koin: 0,
      status: 'active',
      role: 'admin',
    },
  })

  const dinasHead1 = await prisma.user.create({
    data: {
      id: 'dinas-head-001',
      name: 'Budi Santoso',
      email: 'dinas1@wastelens.com',
      emailVerified: true,
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=BS',
      createdAt: twoWeeksAgo,
      updatedAt: now,
      address: 'Jl. Merdeka No. 10, Bandung',
      phoneNumber: '081234567891',
      saldo_koin: 0,
      status: 'active',
      role: 'dinas',
    },
  })

  const dinasHead2 = await prisma.user.create({
    data: {
      id: 'dinas-head-002',
      name: 'Siti Rahmawati',
      email: 'dinas2@wastelens.com',
      emailVerified: true,
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=SR',
      createdAt: twoWeeksAgo,
      updatedAt: now,
      address: 'Jl. Diponegoro No. 5, Surabaya',
      phoneNumber: '081234567892',
      saldo_koin: 0,
      status: 'active',
      role: 'dinas',
    },
  })

  const petugas1 = await prisma.user.create({
    data: {
      id: 'petugas-001',
      name: 'Ahmad Rizki',
      email: 'petugas1@wastelens.com',
      emailVerified: true,
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=AR',
      createdAt: oneWeekAgo,
      updatedAt: now,
      address: 'Jl. Pahlawan No. 3, Bandung',
      phoneNumber: '081234567893',
      saldo_koin: 0,
      status: 'active',
      role: 'petugas',
    },
  })

  const petugas2 = await prisma.user.create({
    data: {
      id: 'petugas-002',
      name: 'Dewi Lestari',
      email: 'petugas2@wastelens.com',
      emailVerified: true,
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=DL',
      createdAt: oneWeekAgo,
      updatedAt: now,
      address: 'Jl. Kenanga No. 8, Surabaya',
      phoneNumber: '081234567894',
      saldo_koin: 0,
      status: 'active',
      role: 'petugas',
    },
  })

  const kopdesUser = await prisma.user.create({
    data: {
      id: 'kopdes-001',
      name: 'H. Abdullah',
      email: 'kopdes1@wastelens.com',
      emailVerified: true,
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=HA',
      createdAt: oneWeekAgo,
      updatedAt: now,
      address: 'Jl. Raya Desa No. 1, Kec. Tumpang, Malang',
      phoneNumber: '081234567895',
      saldo_koin: 0,
      status: 'active',
      role: 'kopdes',
    },
  })

  const warga1 = await prisma.user.create({
    data: {
      id: 'warga-001',
      name: 'Rina Wati',
      email: 'warga1@wastelens.com',
      emailVerified: true,
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=RW',
      createdAt: oneWeekAgo,
      updatedAt: now,
      address: 'Jl. Anggrek No. 12, Bandung',
      phoneNumber: '081234567896',
      saldo_koin: 150,
      status: 'active',
      role: 'user',
    },
  })

  const warga2 = await prisma.user.create({
    data: {
      id: 'warga-002',
      name: 'Joko Prasetyo',
      email: 'warga2@wastelens.com',
      emailVerified: true,
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=JP',
      createdAt: threeDaysAgo,
      updatedAt: now,
      address: 'Jl. Mawar No. 7, Surabaya',
      phoneNumber: '081234567897',
      saldo_koin: 50,
      status: 'active',
      role: 'user',
    },
  })

  const bannedUser = await prisma.user.create({
    data: {
      id: 'banned-001',
      name: 'Samsul Bahri',
      email: 'banned@wastelens.com',
      emailVerified: false,
      image: null,
      createdAt: oneMonthAgo,
      updatedAt: now,
      address: null,
      phoneNumber: null,
      saldo_koin: 0,
      status: 'banned',
      role: 'user',
      isBanned: true,
    },
  })

  // ─── 2. VERIFICATIONS ─────────────────────────────────────
  await prisma.verification.create({
    data: {
      id: 'ver-001',
      identifier: 'dinas1@wastelens.com',
      value: 'verif-token-dinas1-abc123',
      expiresAt: twoDaysLater,
      createdAt: now,
      updatedAt: now,
    },
  })

  await prisma.verification.create({
    data: {
      id: 'ver-002',
      identifier: 'petugas1@wastelens.com',
      value: 'verif-token-petugas1-def456',
      expiresAt: twoDaysLater,
      createdAt: now,
      updatedAt: now,
    },
  })

  // ─── 3. SESSIONS ─────────────────────────────────────────
  await prisma.session.create({
    data: {
      id: 'sess-admin-001',
      expiresAt: twoDaysLater,
      token: 'sess-token-admin-abc123xyz',
      createdAt: now,
      updatedAt: now,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
      userId: admin.id,
    },
  })

  await prisma.session.create({
    data: {
      id: 'sess-warga1-001',
      expiresAt: twoDaysLater,
      token: 'sess-token-warga1-def456uvw',
      createdAt: oneDayAgo,
      updatedAt: oneDayAgo,
      ipAddress: '192.168.1.20',
      userAgent: 'Mozilla/5.0 (Linux; Android 14) Chrome/120.0',
      userId: warga1.id,
    },
  })

  // ─── 4. ACCOUNTS ─────────────────────────────────────────
  await prisma.account.create({
    data: {
      id: 'acc-admin-001',
      accountId: 'admin-001',
      providerId: 'credential',
      userId: admin.id,
      accessToken: null,
      refreshToken: null,
      password: null,
      createdAt: twoWeeksAgo,
      updatedAt: now,
    },
  })

  await prisma.account.create({
    data: {
      id: 'acc-warga1-001',
      accountId: 'warga-001',
      providerId: 'credential',
      userId: warga1.id,
      accessToken: null,
      refreshToken: null,
      password: null,
      createdAt: oneWeekAgo,
      updatedAt: now,
    },
  })

  // ─── 5. BANNED REASONS ─────────────────────────────────
  await prisma.bannedReason.create({
    data: {
      userId: bannedUser.id,
      alasan: 'Melanggar aturan: melaporkan konten palsu sebanyak 3 kali.',
    },
  })

  // ─── 6. KOPDES ──────────────────────────────────────────
  const kopdesRecord = await prisma.kopdes.create({
    data: {
      user_id: kopdesUser.id,
      nama: 'Kopdes Sejahtera Bersama',
      alamat: 'Jl. Raya Desa No. 1, Kec. Tumpang, Kab. Malang, Jawa Timur',
    },
  })

  // ─── 7. PRODUK ─────────────────────────────────────────
  const produkBeras = await prisma.produk.create({
    data: {
      kopdes_id: kopdesRecord.id,
      nama_barang: 'Beras 5kg',
      harga_koin: 100,
      stok: 20,
    },
  })

  const produkMinyak = await prisma.produk.create({
    data: {
      kopdes_id: kopdesRecord.id,
      nama_barang: 'Minyak Goreng 1L',
      harga_koin: 50,
      stok: 30,
    },
  })

  const produkSabun = await prisma.produk.create({
    data: {
      kopdes_id: kopdesRecord.id,
      nama_barang: 'Sabun Mandi 2 pcs',
      harga_koin: 25,
      stok: 50,
    },
  })

  // ─── 8. DINAS ──────────────────────────────────────────
  const dinas1 = await prisma.dinas.create({
    data: {
      user_id: dinasHead1.id,
      nama_dinas: 'Dinas Kebersihan Kota Bandung',
      kontak: '022-1234567',
    },
  })

  const dinas2 = await prisma.dinas.create({
    data: {
      user_id: dinasHead2.id,
      nama_dinas: 'Dinas Lingkungan Hidup Kota Surabaya',
      kontak: '031-7654321',
    },
  })

  // ─── 9. AREA CAKUPAN ──────────────────────────────────
  await prisma.areaCakupan.create({
    data: { dinas_id: dinas1.id, nama_wilayah: 'Kecamatan Bandung Wetan' },
  })

  await prisma.areaCakupan.create({
    data: { dinas_id: dinas1.id, nama_wilayah: 'Kecamatan Bandung Kidul' },
  })

  await prisma.areaCakupan.create({
    data: { dinas_id: dinas2.id, nama_wilayah: 'Kecamatan Surabaya Pusat' },
  })

  await prisma.areaCakupan.create({
    data: { dinas_id: dinas2.id, nama_wilayah: 'Kecamatan Surabaya Timur' },
  })

  // ─── 10. PETUGAS ──────────────────────────────────────
  const petugas1Record = await prisma.petugas.create({
    data: {
      dinas_id: dinas1.id,
      user_id: petugas1.id,
      nama: 'Ahmad Rizki',
      no_hp: '081234567893',
    },
  })

  const petugas2Record = await prisma.petugas.create({
    data: {
      dinas_id: dinas2.id,
      user_id: petugas2.id,
      nama: 'Dewi Lestari',
      no_hp: '081234567894',
    },
  })

  // ─── 11. KENDARAAN ────────────────────────────────────
  const kendaraan1 = await prisma.kendaraan.create({
    data: {
      dinas_id: dinas1.id,
      jenis: 'Dump Truck',
      kapasitas: 5000,
      current_load: 0,
    },
  })

  const kendaraan2 = await prisma.kendaraan.create({
    data: {
      dinas_id: dinas1.id,
      jenis: 'Pick Up',
      kapasitas: 1500,
      current_load: 500,
    },
  })

  const kendaraan3 = await prisma.kendaraan.create({
    data: {
      dinas_id: dinas2.id,
      jenis: 'Armroll Truck',
      kapasitas: 8000,
      current_load: 2000,
    },
  })

  // ─── 12. LAPORAN ──────────────────────────────────────
  const laporan1 = await prisma.laporan.create({
    data: {
      user_id: warga1.id,
      dinas_id: dinas1.id,
      foto_url: 'https://res.cloudinary.com/wastelens/image/upload/laporan1.jpg',
      lokasi_lat: -6.9175,
      lokasi_lng: 107.6191,
      kategori_ukuran: 'SEDANG',
      status: 'PENDING',
      address_text: 'Jl. Braga No. 28, Bandung',
      city: 'Bandung',
      province: 'Jawa Barat',
      country: 'Indonesia',
      waste_types: ['plastik', 'kertas'],
    },
  })

  const laporan2 = await prisma.laporan.create({
    data: {
      user_id: warga1.id,
      dinas_id: dinas1.id,
      petugas_id: petugas1Record.id,
      kendaraan_id: kendaraan1.id,
      foto_url: 'https://res.cloudinary.com/wastelens/image/upload/laporan2.jpg',
      lokasi_lat: -6.9217,
      lokasi_lng: 107.6072,
      kategori_ukuran: 'BESAR',
      rekomendasi_kendaraan: 'Dump Truck',
      status: 'DIPROSES',
      address_text: 'Jl. Asia Afrika, Bandung',
      road_name: 'Jl. Asia Afrika',
      district: 'Bandung Wetan',
      city: 'Bandung',
      province: 'Jawa Barat',
      country: 'Indonesia',
      waste_types: ['kayu', 'elektronik'],
      priority_score: 8.5,
      priority_level: 'HIGH',
    },
  })

  const laporan3 = await prisma.laporan.create({
    data: {
      user_id: warga2.id,
      dinas_id: dinas2.id,
      petugas_id: petugas2Record.id,
      kendaraan_id: kendaraan3.id,
      foto_url: 'https://res.cloudinary.com/wastelens/image/upload/laporan3.jpg',
      lokasi_lat: -7.2575,
      lokasi_lng: 112.7521,
      kategori_ukuran: 'KECIL',
      status: 'SELESAI',
      address_text: 'Jl. Tunjungan No. 1, Surabaya',
      city: 'Surabaya',
      province: 'Jawa Timur',
      country: 'Indonesia',
      waste_types: ['plastik'],
      priority_score: 3.2,
      priority_level: 'LOW',
    },
  })

  const laporan4 = await prisma.laporan.create({
    data: {
      user_id: warga2.id,
      dinas_id: null,
      foto_url: 'https://res.cloudinary.com/wastelens/image/upload/laporan4.jpg',
      lokasi_lat: -7.2658,
      lokasi_lng: 112.7456,
      kategori_ukuran: 'SEDANG',
      status: 'DITOLAK',
      address_text: 'Jl. Raya Kertajaya, Surabaya',
      city: 'Surabaya',
      province: 'Jawa Timur',
      country: 'Indonesia',
      waste_types: ['sisa_makanan', 'plastik'],
      drainage_risk: true,
      needs_manual_review: true,
      confidence: 0.45,
    },
  })

  const laporan5 = await prisma.laporan.create({
    data: {
      user_id: warga1.id,
      dinas_id: dinas1.id,
      petugas_id: petugas1Record.id,
      kendaraan_id: kendaraan2.id,
      foto_url: 'https://res.cloudinary.com/wastelens/image/upload/laporan5.jpg',
      lokasi_lat: -6.9147,
      lokasi_lng: 107.6269,
      kategori_ukuran: 'BESAR',
      status: 'SELESAI',
      address_text: 'Jl. Cihampelas, Bandung',
      city: 'Bandung',
      province: 'Jawa Barat',
      country: 'Indonesia',
      waste_types: ['plastik', 'kaca', 'logam'],
      priority_score: 9.1,
      priority_level: 'HIGH',
    },
  })

  // ─── 13. FOTO ──────────────────────────────────────────
  await prisma.foto.create({
    data: {
      laporan_id: laporan1.id,
      url: 'https://res.cloudinary.com/wastelens/image/upload/laporan1.jpg',
      hash: 'a1b2c3d4e5f6',
      mime_type: 'image/jpeg',
      size_bytes: 2_450_000,
    },
  })

  await prisma.foto.create({
    data: {
      laporan_id: laporan2.id,
      url: 'https://res.cloudinary.com/wastelens/image/upload/laporan2.jpg',
      hash: 'b2c3d4e5f6a1',
      mime_type: 'image/jpeg',
      size_bytes: 3_120_000,
    },
  })

  await prisma.foto.create({
    data: {
      laporan_id: laporan3.id,
      url: 'https://res.cloudinary.com/wastelens/image/upload/laporan3.jpg',
      hash: 'c3d4e5f6a1b2',
      mime_type: 'image/jpeg',
      size_bytes: 1_890_000,
    },
  })

  await prisma.foto.create({
    data: {
      laporan_id: laporan4.id,
      url: 'https://res.cloudinary.com/wastelens/image/upload/laporan4.jpg',
      mime_type: 'image/png',
      size_bytes: 4_100_000,
    },
  })

  await prisma.foto.create({
    data: {
      laporan_id: laporan5.id,
      url: 'https://res.cloudinary.com/wastelens/image/upload/laporan5.jpg',
      hash: 'd4e5f6a1b2c3',
      mime_type: 'image/jpeg',
      size_bytes: 2_780_000,
    },
  })

  // ─── 14. TRANSAKSI KOIN ────────────────────────────────
  // Unique constraint: [laporan_id, jenis] — only 1 entry per (laporan, jenis)
  await prisma.transaksiKoin.create({
    data: {
      user_id: warga1.id,
      laporan_id: laporan5.id,
      jumlah: 50,
      jenis: 'KREDIT',
    },
  })

  await prisma.transaksiKoin.create({
    data: {
      user_id: warga2.id,
      laporan_id: laporan3.id,
      jumlah: 25,
      jenis: 'KREDIT',
    },
  })

  await prisma.transaksiKoin.create({
    data: {
      user_id: warga1.id,
      laporan_id: laporan5.id,
      jumlah: 50,
      jenis: 'DEBIT',
    },
  })

  // ─── 15. VERIFIKASI PICKUP ─────────────────────────────
  await prisma.verifikasiPickup.create({
    data: {
      laporan_id: laporan3.id,
      foto_sebelum: 'https://res.cloudinary.com/wastelens/image/upload/laporan3_sebelum.jpg',
      foto_sesudah: 'https://res.cloudinary.com/wastelens/image/upload/laporan3_sesudah.jpg',
    },
  })

  await prisma.verifikasiPickup.create({
    data: {
      laporan_id: laporan5.id,
      foto_sebelum: 'https://res.cloudinary.com/wastelens/image/upload/laporan5_sebelum.jpg',
      foto_sesudah: 'https://res.cloudinary.com/wastelens/image/upload/laporan5_sesudah.jpg',
    },
  })

  // ─── 16. NOTIFIKASI ────────────────────────────────────
  await prisma.notifikasi.create({
    data: {
      user_id: warga1.id,
      laporan_id: laporan1.id,
      pesan: 'Laporan Anda telah diterima dan sedang dalam antrian.',
      status_baca: true,
    },
  })

  await prisma.notifikasi.create({
    data: {
      user_id: warga1.id,
      laporan_id: laporan2.id,
      pesan: 'Laporan Anda sedang diproses oleh petugas.',
      status_baca: false,
    },
  })

  await prisma.notifikasi.create({
    data: {
      user_id: warga2.id,
      laporan_id: laporan3.id,
      pesan: 'Laporan Anda telah selesai. Anda mendapat 25 koin!',
      status_baca: true,
    },
  })

  await prisma.notifikasi.create({
    data: {
      user_id: warga1.id,
      laporan_id: laporan5.id,
      pesan: 'Laporan Anda telah selesai. Anda mendapat 50 koin!',
      status_baca: false,
    },
  })

  // ─── 17. PENUKARAN ─────────────────────────────────────
  await prisma.penukaran.create({
    data: {
      user_id: warga1.id,
      produk_id: produkMinyak.id,
      jumlah_koin: 50,
      status: 'SELESAI',
      qr_token: 'QR-MGK-001-A1B2',
      redeemed_at: oneDayAgo,
    },
  })

  await prisma.penukaran.create({
    data: {
      user_id: warga1.id,
      produk_id: produkSabun.id,
      jumlah_koin: 25,
      status: 'PENDING',
    },
  })

  // ─── 18. TEMPORARY UPLOAD ──────────────────────────────
  await prisma.temporaryUpload.create({
    data: {
      user_id: warga1.id,
      provider: 'cloudinary',
      public_id: 'temp/warga1_upload1',
      secure_url: 'https://res.cloudinary.com/wastelens/image/upload/temp/warga1_upload1.jpg',
      resource_type: 'image',
      mime_type: 'image/jpeg',
      size_bytes: 1_800_000,
      status: 'ACTIVE',
      expiresAt: twoDaysLater,
    },
  })

  await prisma.temporaryUpload.create({
    data: {
      user_id: warga1.id,
      provider: 'cloudinary',
      public_id: 'temp/warga1_upload2',
      secure_url: 'https://res.cloudinary.com/wastelens/image/upload/temp/warga1_upload2.jpg',
      resource_type: 'image',
      mime_type: 'image/jpeg',
      size_bytes: 2_100_000,
      status: 'USED',
      expiresAt: oneDayAgo,
      usedAt: oneDayAgo,
    },
  })

  console.log('✅ Seed data berhasil dibuat!')
  console.log('📊 Ringkasan:')
  console.log('   - 9 User (admin, dinas, petugas, kopdes, warga, banned)')
  console.log('   - 2 Verification, 2 Session, 2 Account')
  console.log('   - 1 BannedReason, 1 Kopdes, 3 Produk')
  console.log('   - 2 Dinas, 4 AreaCakupan, 2 Petugas, 3 Kendaraan')
  console.log('   - 5 Laporan, 5 Foto, 3 TransaksiKoin')
  console.log('   - 2 VerifikasiPickup, 4 Notifikasi')
  console.log('   - 2 Penukaran, 2 TemporaryUpload')
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
