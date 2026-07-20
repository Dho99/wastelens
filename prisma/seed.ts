import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { auth } from "../lib/auth";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type JakartaMapReportSeed = {
    now: Date;
    dinasId: string;
    warga1Id: string;
    warga2Id: string;
};

async function seedJakartaMapReports({
    now,
    dinasId,
    warga1Id,
    warga2Id,
}: JakartaMapReportSeed) {
    return prisma.laporan.createMany({
        skipDuplicates: true,
        data: [
            {
                client_request_id: "seed-map-jakarta-gambir-v1",
                user_id: warga1Id,
                dinas_id: dinasId,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.17539,
                lokasi_lng: 106.82715,
                kategori_ukuran: "BESAR",
                status: "PENDING",
                address_text: "Kawasan Monumen Nasional, Gambir",
                road_name: "Jl. Medan Merdeka",
                district: "Gambir",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["plastik", "kertas"],
                priority_score: 8.8,
                priority_level: "HIGH",
                createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-tanah-abang-v1",
                user_id: warga2Id,
                dinas_id: dinasId,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1862,
                lokasi_lng: 106.8148,
                kategori_ukuran: "SEDANG",
                status: "PENDING",
                address_text: "Pasar Tanah Abang, Jakarta Pusat",
                road_name: "Jl. K.H. Mas Mansyur",
                district: "Tanah Abang",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["sisa_makanan", "plastik"],
                drainage_risk: true,
                priority_score: 7.4,
                priority_level: "HIGH",
                createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-senen-v1",
                user_id: warga1Id,
                dinas_id: dinasId,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1771,
                lokasi_lng: 106.8427,
                kategori_ukuran: "BESAR",
                rekomendasi_kendaraan: "Dump Truck",
                status: "DIPROSES",
                address_text: "Kawasan Pasar Senen, Jakarta Pusat",
                road_name: "Jl. Pasar Senen",
                district: "Senen",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["kayu", "plastik", "logam"],
                access_obstruction_risk: true,
                priority_score: 9.2,
                priority_level: "HIGH",
                createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-menteng-v1",
                user_id: warga2Id,
                dinas_id: dinasId,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1944,
                lokasi_lng: 106.8326,
                kategori_ukuran: "KECIL",
                status: "PENDING",
                address_text: "Taman Menteng, Jakarta Pusat",
                road_name: "Jl. HOS Cokroaminoto",
                district: "Menteng",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["plastik"],
                priority_score: 3.9,
                priority_level: "LOW",
                createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-kemayoran-v1",
                user_id: warga1Id,
                dinas_id: dinasId,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1633,
                lokasi_lng: 106.8561,
                kategori_ukuran: "SEDANG",
                status: "PENDING",
                address_text: "Kemayoran, Jakarta Pusat",
                road_name: "Jl. Garuda",
                district: "Kemayoran",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["kaca", "plastik"],
                priority_score: 6.1,
                priority_level: "MEDIUM",
                createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-sawah-besar-v1",
                user_id: warga2Id,
                dinas_id: dinasId,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1607,
                lokasi_lng: 106.8274,
                kategori_ukuran: "SEDANG",
                rekomendasi_kendaraan: "Pick Up",
                status: "DIPROSES",
                address_text: "Mangga Besar, Sawah Besar",
                road_name: "Jl. Mangga Besar Raya",
                district: "Sawah Besar",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["sisa_makanan", "kertas"],
                priority_score: 5.7,
                priority_level: "MEDIUM",
                createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
            },
        ],
    });
}

async function seedMapReportsIntoExistingDatabase(now: Date) {
    const [dinasUser, warga1, warga2] = await Promise.all([
        prisma.user.findUnique({ where: { email: "dinas1@wastelens.com" } }),
        prisma.user.findUnique({ where: { email: "warga1@wastelens.com" } }),
        prisma.user.findUnique({ where: { email: "warga2@wastelens.com" } }),
    ]);

    if (!dinasUser || !warga1 || !warga2) {
        throw new Error("Data akun seed belum lengkap. Reset database lalu jalankan seed kembali.");
    }

    const dinas = await prisma.dinas.findFirst({ where: { user_id: dinasUser.id } });
    if (!dinas) {
        throw new Error("Data dinas seed tidak ditemukan. Reset database lalu jalankan seed kembali.");
    }

    return seedJakartaMapReports({
        now,
        dinasId: dinas.id,
        warga1Id: warga1.id,
        warga2Id: warga2.id,
    });
}

async function main() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 86400000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 86400000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 86400000);
    const twoDaysLater = new Date(now.getTime() + 2 * 86400000);
    const tomorrow = new Date(now.getTime() + 86400000);

    const existingSeedUser = await prisma.user.findUnique({
        where: { email: "admin@wastelens.com" },
        select: { id: true },
    });

    if (existingSeedUser) {
        const result = await seedMapReportsIntoExistingDatabase(now);
        console.log(`✅ Seed database lama selesai: ${result.count} titik laporan Jakarta ditambahkan.`);
        return;
    }

    const userId = (email: string): string => {
        const id = userMap.get(email);
        if (!id) throw new Error(`User not found: ${email}`);
        return id;
    };

    // ─── 1. USERS ─────────────────────────────────────────────
    type UserSeed = {
        email: string;
        password: string;
        name: string;
        role: string;
    };

    const usersData: UserSeed[] = [
        {
            email: "admin@wastelens.com",
            password: "password123",
            name: "Admin Utama",
            role: "admin",
        },
        {
            email: "dinas1@wastelens.com",
            password: "password123",
            name: "Budi Santoso",
            role: "dinas",
        },
        {
            email: "dinas2@wastelens.com",
            password: "password123",
            name: "Siti Rahmawati",
            role: "dinas",
        },
        {
            email: "petugas1@wastelens.com",
            password: "password123",
            name: "Ahmad Rizki",
            role: "petugas",
        },
        {
            email: "petugas2@wastelens.com",
            password: "password123",
            name: "Dewi Lestari",
            role: "petugas",
        },
        {
            email: "kopdes1@wastelens.com",
            password: "password123",
            name: "H. Abdullah",
            role: "kopdes",
        },
        {
            email: "warga1@wastelens.com",
            password: "password123",
            name: "Rina Wati",
            role: "user",
        },
        {
            email: "warga2@wastelens.com",
            password: "password123",
            name: "Joko Prasetyo",
            role: "user",
        },
        {
            email: "banned@wastelens.com",
            password: "password123",
            name: "Samsul Bahri",
            role: "user",
        },
    ];

    const userMap = new Map<string, string>();

    for (const data of usersData) {
        const result = await auth.api.signUpEmail({ body: data });

        const userId = (result as { user?: { id: string } })?.user?.id ?? "";
        if (!userId) throw new Error(`Gagal membuat user: ${data.email}`);

        userMap.set(data.email, userId);
    }

    await prisma.user.update({
        where: { id: userId("admin@wastelens.com") },
        data: {
            saldo_koin: 0,
            status: "active",
            address: "Jl. Sudirman No. 1, Jakarta Pusat",
            phoneNumber: "081234567890",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=Admin",
            createdAt: twoWeeksAgo,
            emailVerified: true,
        },
    });

    await prisma.user.update({
        where: { id: userId("dinas1@wastelens.com") },
        data: {
            saldo_koin: 0,
            status: "active",
            address: "Jl. Merdeka No. 10, Bandung",
            phoneNumber: "081234567891",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=BS",
            createdAt: twoWeeksAgo,
            emailVerified: true,
        },
    });

    await prisma.user.update({
        where: { id: userId("dinas2@wastelens.com") },
        data: {
            saldo_koin: 0,
            status: "active",
            address: "Jl. Diponegoro No. 5, Surabaya",
            phoneNumber: "081234567892",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=SR",
            createdAt: twoWeeksAgo,
            emailVerified: true,
        },
    });

    await prisma.user.update({
        where: { id: userId("petugas1@wastelens.com") },
        data: {
            saldo_koin: 0,
            status: "active",
            address: "Jl. Pahlawan No. 3, Bandung",
            phoneNumber: "081234567893",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=AR",
            createdAt: oneWeekAgo,
            emailVerified: true,
        },
    });

    await prisma.user.update({
        where: { id: userId("petugas2@wastelens.com") },
        data: {
            saldo_koin: 0,
            status: "active",
            address: "Jl. Kenanga No. 8, Surabaya",
            phoneNumber: "081234567894",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=DL",
            createdAt: oneWeekAgo,
            emailVerified: true,
        },
    });

    await prisma.user.update({
        where: { id: userId("kopdes1@wastelens.com") },
        data: {
            saldo_koin: 0,
            status: "active",
            address: "Jl. Raya Desa No. 1, Kec. Tumpang, Malang",
            phoneNumber: "081234567895",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=HA",
            createdAt: oneWeekAgo,
            emailVerified: true,
        },
    });

    await prisma.user.update({
        where: { id: userId("warga1@wastelens.com") },
        data: {
            saldo_koin: 150,
            status: "active",
            address: "Jl. Anggrek No. 12, Bandung",
            phoneNumber: "081234567896",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=RW",
            createdAt: oneWeekAgo,
            emailVerified: true,
        },
    });

    await prisma.user.update({
        where: { id: userId("warga2@wastelens.com") },
        data: {
            saldo_koin: 50,
            status: "active",
            address: "Jl. Mawar No. 7, Surabaya",
            phoneNumber: "081234567897",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=JP",
            createdAt: threeDaysAgo,
            emailVerified: true,
        },
    });

    await prisma.user.update({
        where: { id: userId("banned@wastelens.com") },
        data: {
            saldo_koin: 0,
            status: "banned",
            isBanned: true,
            createdAt: oneMonthAgo,
            emailVerified: false,
        },
    });

    // ─── 2. VERIFICATIONS ─────────────────────────────────────
    await prisma.verification.create({
        data: {
            id: "ver-001",
            identifier: "dinas1@wastelens.com",
            value: "verif-token-dinas1-abc123",
            expiresAt: twoDaysLater,
            createdAt: now,
            updatedAt: now,
        },
    });

    await prisma.verification.create({
        data: {
            id: "ver-002",
            identifier: "petugas1@wastelens.com",
            value: "verif-token-petugas1-def456",
            expiresAt: twoDaysLater,
            createdAt: now,
            updatedAt: now,
        },
    });

    // ─── 3. BANNED REASONS ─────────────────────────────────
    await prisma.bannedReason.create({
        data: {
            userId: userId("banned@wastelens.com"),
            alasan: "Melanggar aturan: melaporkan konten palsu sebanyak 3 kali.",
        },
    });

    // ─── 4. KOPDES ──────────────────────────────────────────
    const kopdesRecord = await prisma.kopdes.create({
        data: {
            user_id: userId("kopdes1@wastelens.com"),
            nama: "Kopdes Sejahtera Bersama",
            alamat: "Jl. Raya Desa No. 1, Kec. Tumpang, Kab. Malang, Jawa Timur",
        },
    });

    // ─── 5. PRODUK ─────────────────────────────────────────
    const produkBeras = await prisma.produk.create({
        data: {
            kopdes_id: kopdesRecord.id,
            nama_barang: "Beras 5kg",
            harga_koin: 100,
            stok: 20,
        },
    });

    const produkMinyak = await prisma.produk.create({
        data: {
            kopdes_id: kopdesRecord.id,
            nama_barang: "Minyak Goreng 1L",
            harga_koin: 50,
            stok: 30,
        },
    });

    const produkSabun = await prisma.produk.create({
        data: {
            kopdes_id: kopdesRecord.id,
            nama_barang: "Sabun Mandi 2 pcs",
            harga_koin: 25,
            stok: 50,
        },
    });

    // ─── 6. DINAS ──────────────────────────────────────────
    const dinas1 = await prisma.dinas.create({
        data: {
            user_id: userId("dinas1@wastelens.com"),
            nama_dinas: "Dinas Kebersihan Kota Bandung",
            kontak: "022-1234567",
        },
    });

    const dinas2 = await prisma.dinas.create({
        data: {
            user_id: userId("dinas2@wastelens.com"),
            nama_dinas: "Dinas Lingkungan Hidup Kota Surabaya",
            kontak: "031-7654321",
        },
    });

    // ─── 7. AREA CAKUPAN ──────────────────────────────────
    await prisma.areaCakupan.create({
        data: { dinas_id: dinas1.id, nama_wilayah: "Kecamatan Bandung Wetan" },
    });

    await prisma.areaCakupan.create({
        data: { dinas_id: dinas1.id, nama_wilayah: "Kecamatan Bandung Kidul" },
    });

    await prisma.areaCakupan.create({
        data: { dinas_id: dinas2.id, nama_wilayah: "Kecamatan Surabaya Pusat" },
    });

    await prisma.areaCakupan.create({
        data: { dinas_id: dinas2.id, nama_wilayah: "Kecamatan Surabaya Timur" },
    });

    // ─── 8. PETUGAS ──────────────────────────────────────
    const petugas1Record = await prisma.petugas.create({
        data: {
            dinas_id: dinas1.id,
            user_id: userId("petugas1@wastelens.com"),
            nama: "Ahmad Rizki",
            no_hp: "081234567893",
        },
    });

    const petugas2Record = await prisma.petugas.create({
        data: {
            dinas_id: dinas2.id,
            user_id: userId("petugas2@wastelens.com"),
            nama: "Dewi Lestari",
            no_hp: "081234567894",
        },
    });

    // ─── 9. KENDARAAN ────────────────────────────────────
    const kendaraan1 = await prisma.kendaraan.create({
        data: {
            dinas_id: dinas1.id,
            jenis: "Dump Truck",
            kapasitas: 5000,
            current_load: 0,
        },
    });

    const kendaraan2 = await prisma.kendaraan.create({
        data: {
            dinas_id: dinas1.id,
            jenis: "Pick Up",
            kapasitas: 1500,
            current_load: 500,
        },
    });

    const kendaraan3 = await prisma.kendaraan.create({
        data: {
            dinas_id: dinas2.id,
            jenis: "Armroll Truck",
            kapasitas: 8000,
            current_load: 2000,
        },
    });

    // ─── 10. LAPORAN ──────────────────────────────────────
    const laporan1 = await prisma.laporan.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            dinas_id: dinas1.id,
            foto_url:
                "https://res.cloudinary.com/wastelens/image/upload/laporan1.jpg",
            lokasi_lat: -6.9175,
            lokasi_lng: 107.6191,
            kategori_ukuran: "SEDANG",
            status: "PENDING",
            address_text: "Jl. Braga No. 28, Bandung",
            city: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
            waste_types: ["plastik", "kertas"],
        },
    });

    const laporan2 = await prisma.laporan.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            dinas_id: dinas1.id,
            petugas_id: petugas1Record.id,
            kendaraan_id: kendaraan1.id,
            foto_url:
                "https://res.cloudinary.com/wastelens/image/upload/laporan2.jpg",
            lokasi_lat: -6.9217,
            lokasi_lng: 107.6072,
            kategori_ukuran: "BESAR",
            rekomendasi_kendaraan: "Dump Truck",
            status: "DIPROSES",
            address_text: "Jl. Asia Afrika, Bandung",
            road_name: "Jl. Asia Afrika",
            district: "Bandung Wetan",
            city: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
            waste_types: ["kayu", "elektronik"],
            priority_score: 8.5,
            priority_level: "HIGH",
        },
    });

    const laporan3 = await prisma.laporan.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            dinas_id: dinas2.id,
            petugas_id: petugas2Record.id,
            kendaraan_id: kendaraan3.id,
            foto_url:
                "https://res.cloudinary.com/wastelens/image/upload/laporan3.jpg",
            lokasi_lat: -7.2575,
            lokasi_lng: 112.7521,
            kategori_ukuran: "KECIL",
            status: "SELESAI",
            address_text: "Jl. Tunjungan No. 1, Surabaya",
            city: "Surabaya",
            province: "Jawa Timur",
            country: "Indonesia",
            waste_types: ["plastik"],
            priority_score: 3.2,
            priority_level: "LOW",
        },
    });

    const laporan4 = await prisma.laporan.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            dinas_id: null,
            foto_url:
                "https://res.cloudinary.com/wastelens/image/upload/laporan4.jpg",
            lokasi_lat: -7.2658,
            lokasi_lng: 112.7456,
            kategori_ukuran: "SEDANG",
            status: "DITOLAK",
            address_text: "Jl. Raya Kertajaya, Surabaya",
            city: "Surabaya",
            province: "Jawa Timur",
            country: "Indonesia",
            waste_types: ["sisa_makanan", "plastik"],
            drainage_risk: true,
            needs_manual_review: true,
            confidence: 0.45,
        },
    });

    const laporan5 = await prisma.laporan.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            dinas_id: dinas1.id,
            petugas_id: petugas1Record.id,
            kendaraan_id: kendaraan2.id,
            foto_url:
                "https://res.cloudinary.com/wastelens/image/upload/laporan5.jpg",
            lokasi_lat: -6.9147,
            lokasi_lng: 107.6269,
            kategori_ukuran: "BESAR",
            status: "SELESAI",
            address_text: "Jl. Cihampelas, Bandung",
            city: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
            waste_types: ["plastik", "kaca", "logam"],
            priority_score: 9.1,
            priority_level: "HIGH",
        },
    });

    // Laporan aktif di sekitar viewport awal dashboard DLH (Jakarta Pusat).
    // Data ini memastikan heatmap dan mode "Titik Laporan" langsung terlihat
    // ketika akun dinas pertama membuka /dinas setelah database di-seed.
    await prisma.laporan.createMany({
        skipDuplicates: true,
        data: [
            {
                client_request_id: "seed-map-jakarta-gambir-v1",
                user_id: userId("warga1@wastelens.com"),
                dinas_id: dinas1.id,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.17539,
                lokasi_lng: 106.82715,
                kategori_ukuran: "BESAR",
                status: "PENDING",
                address_text: "Kawasan Monumen Nasional, Gambir",
                road_name: "Jl. Medan Merdeka",
                district: "Gambir",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["plastik", "kertas"],
                priority_score: 8.8,
                priority_level: "HIGH",
                createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-tanah-abang-v1",
                user_id: userId("warga2@wastelens.com"),
                dinas_id: dinas1.id,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1862,
                lokasi_lng: 106.8148,
                kategori_ukuran: "SEDANG",
                status: "PENDING",
                address_text: "Pasar Tanah Abang, Jakarta Pusat",
                road_name: "Jl. K.H. Mas Mansyur",
                district: "Tanah Abang",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["sisa_makanan", "plastik"],
                drainage_risk: true,
                priority_score: 7.4,
                priority_level: "HIGH",
                createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-senen-v1",
                user_id: userId("warga1@wastelens.com"),
                dinas_id: dinas1.id,
                petugas_id: petugas1Record.id,
                kendaraan_id: kendaraan1.id,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1771,
                lokasi_lng: 106.8427,
                kategori_ukuran: "BESAR",
                rekomendasi_kendaraan: "Dump Truck",
                status: "DIPROSES",
                address_text: "Kawasan Pasar Senen, Jakarta Pusat",
                road_name: "Jl. Pasar Senen",
                district: "Senen",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["kayu", "plastik", "logam"],
                access_obstruction_risk: true,
                priority_score: 9.2,
                priority_level: "HIGH",
                createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-menteng-v1",
                user_id: userId("warga2@wastelens.com"),
                dinas_id: dinas1.id,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1944,
                lokasi_lng: 106.8326,
                kategori_ukuran: "KECIL",
                status: "PENDING",
                address_text: "Taman Menteng, Jakarta Pusat",
                road_name: "Jl. HOS Cokroaminoto",
                district: "Menteng",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["plastik"],
                priority_score: 3.9,
                priority_level: "LOW",
                createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-kemayoran-v1",
                user_id: userId("warga1@wastelens.com"),
                dinas_id: dinas1.id,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1633,
                lokasi_lng: 106.8561,
                kategori_ukuran: "SEDANG",
                status: "PENDING",
                address_text: "Kemayoran, Jakarta Pusat",
                road_name: "Jl. Garuda",
                district: "Kemayoran",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["kaca", "plastik"],
                priority_score: 6.1,
                priority_level: "MEDIUM",
                createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000),
            },
            {
                client_request_id: "seed-map-jakarta-sawah-besar-v1",
                user_id: userId("warga2@wastelens.com"),
                dinas_id: dinas1.id,
                petugas_id: petugas1Record.id,
                kendaraan_id: kendaraan2.id,
                foto_url: "/images/waste_bags_stack.png",
                lokasi_lat: -6.1607,
                lokasi_lng: 106.8274,
                kategori_ukuran: "SEDANG",
                rekomendasi_kendaraan: "Pick Up",
                status: "DIPROSES",
                address_text: "Mangga Besar, Sawah Besar",
                road_name: "Jl. Mangga Besar Raya",
                district: "Sawah Besar",
                city: "Jakarta Pusat",
                province: "DKI Jakarta",
                country: "Indonesia",
                waste_types: ["sisa_makanan", "kertas"],
                priority_score: 5.7,
                priority_level: "MEDIUM",
                createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
            },
        ],
    });

    // ─── 11. FOTO ──────────────────────────────────────────
    await prisma.foto.create({
        data: {
            laporan_id: laporan1.id,
            url: "https://res.cloudinary.com/wastelens/image/upload/laporan1.jpg",
            hash: "a1b2c3d4e5f6",
            mime_type: "image/jpeg",
            size_bytes: 2_450_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan2.id,
            url: "https://res.cloudinary.com/wastelens/image/upload/laporan2.jpg",
            hash: "b2c3d4e5f6a1",
            mime_type: "image/jpeg",
            size_bytes: 3_120_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan3.id,
            url: "https://res.cloudinary.com/wastelens/image/upload/laporan3.jpg",
            hash: "c3d4e5f6a1b2",
            mime_type: "image/jpeg",
            size_bytes: 1_890_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan4.id,
            url: "https://res.cloudinary.com/wastelens/image/upload/laporan4.jpg",
            mime_type: "image/png",
            size_bytes: 4_100_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan5.id,
            url: "https://res.cloudinary.com/wastelens/image/upload/laporan5.jpg",
            hash: "d4e5f6a1b2c3",
            mime_type: "image/jpeg",
            size_bytes: 2_780_000,
        },
    });

    // ─── 12. TRANSAKSI KOIN ────────────────────────────────
    await prisma.transaksiKoin.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            laporan_id: laporan5.id,
            jumlah: 50,
            jenis: "KREDIT",
        },
    });

    await prisma.transaksiKoin.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            laporan_id: laporan3.id,
            jumlah: 25,
            jenis: "KREDIT",
        },
    });

    await prisma.transaksiKoin.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            laporan_id: laporan5.id,
            jumlah: 50,
            jenis: "DEBIT",
        },
    });

    // ─── 13. VERIFIKASI PICKUP ─────────────────────────────
    await prisma.verifikasiPickup.create({
        data: {
            laporan_id: laporan3.id,
            foto_sebelum:
                "https://res.cloudinary.com/wastelens/image/upload/laporan3_sebelum.jpg",
            foto_sesudah:
                "https://res.cloudinary.com/wastelens/image/upload/laporan3_sesudah.jpg",
        },
    });

    await prisma.verifikasiPickup.create({
        data: {
            laporan_id: laporan5.id,
            foto_sebelum:
                "https://res.cloudinary.com/wastelens/image/upload/laporan5_sebelum.jpg",
            foto_sesudah:
                "https://res.cloudinary.com/wastelens/image/upload/laporan5_sesudah.jpg",
        },
    });

    // ─── 14. NOTIFIKASI ────────────────────────────────────
    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            laporan_id: laporan1.id,
            pesan: "Laporan Anda telah diterima dan sedang dalam antrian.",
            status_baca: true,
        },
    });

    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            laporan_id: laporan2.id,
            pesan: "Laporan Anda sedang diproses oleh petugas.",
            status_baca: false,
        },
    });

    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            laporan_id: laporan3.id,
            pesan: "Laporan Anda telah selesai. Anda mendapat 25 koin!",
            status_baca: true,
        },
    });

    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            laporan_id: laporan5.id,
            pesan: "Laporan Anda telah selesai. Anda mendapat 50 koin!",
            status_baca: false,
        },
    });

    // ─── 15. PENUKARAN ─────────────────────────────────────
    await prisma.penukaran.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            produk_id: produkMinyak.id,
            kopdes_id: kopdesRecord.id,
            quantity: 1,
            unit_coin_price: produkMinyak.harga_koin,
            jumlah_koin: produkMinyak.harga_koin,
            status: "REDEEMED",
            redeemed_at: oneDayAgo,
            expires_at: oneDayAgo,
        },
    });

    await prisma.penukaran.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            produk_id: produkSabun.id,
            kopdes_id: kopdesRecord.id,
            quantity: 1,
            unit_coin_price: produkSabun.harga_koin,
            jumlah_koin: produkSabun.harga_koin,
            status: "PENDING",
            expires_at: tomorrow,
        },
    });

    // ─── 16. TEMPORARY UPLOAD ──────────────────────────────
    await prisma.temporaryUpload.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            provider: "cloudinary",
            public_id: "temp/warga1_upload1",
            secure_url:
                "https://res.cloudinary.com/wastelens/image/upload/temp/warga1_upload1.jpg",
            resource_type: "image",
            mime_type: "image/jpeg",
            size_bytes: 1_800_000,
            status: "ACTIVE",
            expiresAt: twoDaysLater,
        },
    });

    await prisma.temporaryUpload.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            provider: "cloudinary",
            public_id: "temp/warga1_upload2",
            secure_url:
                "https://res.cloudinary.com/wastelens/image/upload/temp/warga1_upload2.jpg",
            resource_type: "image",
            mime_type: "image/jpeg",
            size_bytes: 2_100_000,
            status: "USED",
            expiresAt: oneDayAgo,
            usedAt: oneDayAgo,
        },
    });

    console.log("✅ Seed data berhasil dibuat!");
    console.log("📊 Ringkasan:");
    console.log("   - 9 User (admin, dinas, petugas, kopdes, warga, banned)");
    console.log(
        "   - 9 Account (via Better Auth signUpEmail, password: password123)",
    );
    console.log("   - 2 Verification");
    console.log("   - 1 BannedReason, 1 Kopdes, 3 Produk");
    console.log("   - 2 Dinas, 4 AreaCakupan, 2 Petugas, 3 Kendaraan");
    console.log("   - 11 Laporan (6 titik peta Jakarta), 5 Foto, 3 TransaksiKoin");
    console.log("   - 2 VerifikasiPickup, 4 Notifikasi");
    console.log("   - 2 Penukaran, 2 TemporaryUpload");
}

main()
    .catch((e) => {
        console.error("❌ Seed gagal:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
