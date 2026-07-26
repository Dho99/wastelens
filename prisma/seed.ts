import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { auth } from "../lib/auth";
import { LAPORAN_STATUS } from "../lib/constants/laporan-status";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594398901394-4e349f0ad5e8?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=80",
];

async function main() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 86400000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 86400000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 86400000);
    const twoDaysLater = new Date(now.getTime() + 2 * 86400000);
    const tomorrow = new Date(now.getTime() + 86400000);

    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

    const KECAMATAN = {
        TAWANG: {
            name: "Tawang",
            centerLat: -7.327,
            centerLng: 108.221,
            roads: [
                "Jl. Bhayangkara", "Jl. Rangga", "Jl. RE Martadinata", "Jl. Kartini",
                "Jl. Moh. Hatta", "Jl. Otista", "Jl. Siliwangi", "Jl. Pasar Wetan",
                "Jl. Tentara Pelajar", "Jl. KZ Mustofa",
            ],
        },
        BUNGURSARI: {
            name: "Bungursari",
            centerLat: -7.317,
            centerLng: 108.199,
            roads: [
                "Jl. Bungursari", "Jl. Raya Cipedes", "Jl. Cipedes", "Jl. Sukamaju",
                "Jl. Cikalang", "Jl. Nagarasari", "Jl. Panyusuhan", "Jl. Parakannyasag",
                "Jl. Cikunten", "Jl. Cibereum",
            ],
        },
        INDIHIANG: {
            name: "Indihiang",
            centerLat: -7.308,
            centerLng: 108.274,
            roads: [
                "Jl. Indihiang", "Jl. Raya Indihiang", "Jl. Sukamulya", "Jl. Cibungkul",
                "Jl. Parung", "Jl. Cigeureung", "Jl. Sirnarasa", "Jl. Cikawung",
                "Jl. Pasir", "Jl. Leuwiliang",
            ],
        },
    } as const;

    const WASTE_OPTIONS = [
        ["plastik", "kertas"], ["plastik", "sisa_makanan"], ["kayu", "logam", "plastik"],
        ["kertas", "kaca"], ["sisa_makanan", "plastik", "kertas"], ["elektronik", "logam"],
        ["plastik", "karet"], ["kayu", "kertas", "kaca"], ["kain", "plastik"],
        ["sisa_makanan", "organik"], ["kaca", "logam", "elektronik"], ["plastik", "kayu", "logam"],
    ];

    const UKURAN_OPTIONS = [
        "KECIL", "KECIL", "KECIL", "KECIL",
        "SEDANG", "SEDANG", "SEDANG", "SEDANG",
        "BESAR", "BESAR",
    ];

    const STATUS_DISTRIBUTION: {
        status: keyof typeof LAPORAN_STATUS;
        eligible: boolean;
    }[] = [
        { status: "ANALYZED", eligible: true },
        { status: "ANALYZED", eligible: true },
        { status: "ANALYZED", eligible: true },
        { status: "ANALYZED", eligible: true },
        { status: "ANALYZED", eligible: true },
        { status: "WAITING", eligible: true },
        { status: "WAITING", eligible: true },
        { status: "WAITING", eligible: true },
        { status: "PENDING", eligible: false },
        { status: "DIJEMPUT", eligible: false },
    ];

    function rand(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    function pick<T>(arr: readonly T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function buildAddress(road: string, kecamatan: string): string {
        const num = Math.floor(rand(1, 200));
        return `${road} No. ${num}, Kec. ${kecamatan}, Kota Tasikmalaya, Jawa Barat`;
    }

    function buildWasteTypes(): string[] {
        return [...pick(WASTE_OPTIONS)];
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
        // Tasikmalaya users
        {
            email: "dinas_tasik@wastelens.com",
            password: "password123",
            name: "Bambang Supriyadi",
            role: "dinas",
        },
        {
            email: "petugas_tawang@wastelens.com",
            password: "password123",
            name: "Cecep Hermawan",
            role: "petugas",
        },
        {
            email: "petugas_bungursari@wastelens.com",
            password: "password123",
            name: "Yayat Suryana",
            role: "petugas",
        },
        {
            email: "petugas_indihiang@wastelens.com",
            password: "password123",
            name: "Dedi Kurniawan",
            role: "petugas",
        },
        {
            email: "warga_tsk1@wastelens.com",
            password: "password123",
            name: "Asep Komarudin",
            role: "user",
        },
        {
            email: "warga_tsk2@wastelens.com",
            password: "password123",
            name: "Neneng Ratnasari",
            role: "user",
        },
        {
            email: "warga_tsk3@wastelens.com",
            password: "password123",
            name: "Dadang Rustandi",
            role: "user",
        },
        {
            email: "warga_tsk4@wastelens.com",
            password: "password123",
            name: "Yanti Suryani",
            role: "user",
        },
        {
            email: "warga_tsk5@wastelens.com",
            password: "password123",
            name: "Wawan Setiawan",
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

    // Tasikmalaya user profile updates
    const tasikProfileUpdates: { email: string; address: string; phone: string }[] = [
        { email: "dinas_tasik@wastelens.com", address: "Jl. Perintis Kemerdekaan No. 1, Kota Tasikmalaya", phone: "081234567901" },
        { email: "petugas_tawang@wastelens.com", address: "Jl. Bhayangkara No. 45, Kec. Tawang", phone: "081234567902" },
        { email: "petugas_bungursari@wastelens.com", address: "Jl. Bungursari No. 12, Kec. Bungursari", phone: "081234567903" },
        { email: "petugas_indihiang@wastelens.com", address: "Jl. Indihiang No. 33, Kec. Indihiang", phone: "081234567904" },
        { email: "warga_tsk1@wastelens.com", address: "Jl. Cihideung No. 10, Kota Tasikmalaya", phone: "081234567905" },
        { email: "warga_tsk2@wastelens.com", address: "Jl. Cigeureung No. 22, Kec. Indihiang", phone: "081234567906" },
        { email: "warga_tsk3@wastelens.com", address: "Jl. Sukamaju No. 7, Kec. Bungursari", phone: "081234567907" },
        { email: "warga_tsk4@wastelens.com", address: "Jl. Pasar Wetan No. 15, Kec. Tawang", phone: "081234567908" },
        { email: "warga_tsk5@wastelens.com", address: "Jl. Raya Indihiang No. 88, Kec. Indihiang", phone: "081234567909" },
    ];

    for (const u of tasikProfileUpdates) {
        await prisma.user.update({
            where: { id: userId(u.email) },
            data: {
                address: u.address,
                phoneNumber: u.phone,
                image: `https://api.dicebear.com/9.x/initials/svg?seed=${u.email.split("@")[0]}`,
                createdAt: daysAgo(30),
                emailVerified: true,
                saldo_koin: u.email.startsWith("warga") ? Math.floor(rand(10, 200)) : 0,
            },
        });
    }

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

    const dinasTasik = await prisma.dinas.create({
        data: {
            user_id: userId("dinas_tasik@wastelens.com"),
            nama_dinas: "DLH Kota Tasikmalaya",
            kontak: "0265-123456",
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

    // Tasikmalaya area cakupan
    for (const k of Object.values(KECAMATAN)) {
        await prisma.areaCakupan.create({
            data: { dinas_id: dinasTasik.id, nama_wilayah: `Kecamatan ${k.name}` },
        });
    }

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

    // Tasikmalaya petugas
    const petugasTawang = await prisma.petugas.create({
        data: {
            dinas_id: dinasTasik.id,
            user_id: userId("petugas_tawang@wastelens.com"),
            nama: "Cecep Hermawan",
            no_hp: "081234567902",
        },
    });

    const petugasBungursari = await prisma.petugas.create({
        data: {
            dinas_id: dinasTasik.id,
            user_id: userId("petugas_bungursari@wastelens.com"),
            nama: "Yayat Suryana",
            no_hp: "081234567903",
        },
    });

    const petugasIndihiang = await prisma.petugas.create({
        data: {
            dinas_id: dinasTasik.id,
            user_id: userId("petugas_indihiang@wastelens.com"),
            nama: "Dedi Kurniawan",
            no_hp: "081234567904",
        },
    });

    const PETUGAS_BY_KECAMATAN: Record<string, { id: string }> = {
        Tawang: petugasTawang,
        Bungursari: petugasBungursari,
        Indihiang: petugasIndihiang,
    };

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

    // Tasikmalaya kendaraan
    const kendaraanDumpTruckTsk = await prisma.kendaraan.create({
        data: { dinas_id: dinasTasik.id, jenis: "Dump Truck", kapasitas: 5000, current_load: 0 },
    });

    const kendaraanArmrollTsk = await prisma.kendaraan.create({
        data: { dinas_id: dinasTasik.id, jenis: "Armroll Truck", kapasitas: 8000, current_load: 0 },
    });

    const kendaraanPickUpTsk = await prisma.kendaraan.create({
        data: { dinas_id: dinasTasik.id, jenis: "Pick Up", kapasitas: 1500, current_load: 0 },
    });

    const kendaraanMotorTsk = await prisma.kendaraan.create({
        data: { dinas_id: dinasTasik.id, jenis: "Motor Roda Tiga", kapasitas: 500, current_load: 0 },
    });

    const KENDARAAN_TSK_LIST = [
        kendaraanDumpTruckTsk,
        kendaraanArmrollTsk,
        kendaraanPickUpTsk,
        kendaraanMotorTsk,
    ];

    // ─── 10. LAPORAN ──────────────────────────────────────
    const laporan1 = await prisma.laporan.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            dinas_id: dinas1.id,
            foto_url: PLACEHOLDER_IMAGES[0],
            lokasi_lat: -6.9175,
            lokasi_lng: 107.6191,
            kategori_ukuran: "SEDANG",
            status: LAPORAN_STATUS.PENDING,
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
            foto_url: PLACEHOLDER_IMAGES[1],
            lokasi_lat: -6.9217,
            lokasi_lng: 107.6072,
            kategori_ukuran: "BESAR",
            rekomendasi_kendaraan: "Dump Truck",
            status: LAPORAN_STATUS.DIJEMPUT,
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
            foto_url: PLACEHOLDER_IMAGES[2],
            lokasi_lat: -7.2575,
            lokasi_lng: 112.7521,
            kategori_ukuran: "KECIL",
            status: LAPORAN_STATUS.SELESAI,
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
            foto_url: PLACEHOLDER_IMAGES[3],
            lokasi_lat: -7.2658,
            lokasi_lng: 112.7456,
            kategori_ukuran: "SEDANG",
            status: LAPORAN_STATUS.DITOLAK,
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
            foto_url: PLACEHOLDER_IMAGES[4],
            lokasi_lat: -6.9147,
            lokasi_lng: 107.6269,
            kategori_ukuran: "BESAR",
            status: LAPORAN_STATUS.SELESAI,
            address_text: "Jl. Cihampelas, Bandung",
            city: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
            waste_types: ["plastik", "kaca", "logam"],
            priority_score: 9.1,
            priority_level: "HIGH",
        },
    });

    const laporan6 = await prisma.laporan.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            dinas_id: dinas2.id,
            foto_url: PLACEHOLDER_IMAGES[5],
            lokasi_lat: -7.2733,
            lokasi_lng: 112.7542,
            kategori_ukuran: "BESAR",
            status: LAPORAN_STATUS.PENDING,
            address_text: "Jl. Gubeng No. 45, Surabaya",
            road_name: "Jl. Gubeng",
            district: "Gubeng",
            city: "Surabaya",
            province: "Jawa Timur",
            country: "Indonesia",
            waste_types: ["kayu", "plastik", "sisa_makanan"],
            drainage_risk: true,
            needs_manual_review: true,
            confidence: 0.62,
            priority_score: 8.3,
            priority_level: "HIGH",
        },
    });

    const laporan7 = await prisma.laporan.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            dinas_id: null,
            foto_url: PLACEHOLDER_IMAGES[6],
            lokasi_lat: -6.8936,
            lokasi_lng: 107.6136,
            kategori_ukuran: "KECIL",
            status: LAPORAN_STATUS.PENDING,
            address_text: "Jl. Dago No. 101, Bandung",
            road_name: "Jl. Dago",
            district: "Coblong",
            city: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
            waste_types: ["kertas"],
            priority_score: 2.5,
            priority_level: "LOW",
        },
    });

    const laporan8 = await prisma.laporan.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            dinas_id: null,
            foto_url: PLACEHOLDER_IMAGES[7],
            lokasi_lat: -7.3007,
            lokasi_lng: 112.7351,
            kategori_ukuran: "SEDANG",
            status: LAPORAN_STATUS.PENDING,
            address_text: "Jl. Wonokromo No. 88, Surabaya",
            road_name: "Jl. Wonokromo",
            district: "Wonokromo",
            city: "Surabaya",
            province: "Jawa Timur",
            country: "Indonesia",
            waste_types: ["plastik", "logam"],
            access_obstruction_risk: true,
            needs_manual_review: true,
            confidence: 0.55,
            priority_score: 5.8,
            priority_level: "MEDIUM",
        },
    });

    const laporan9 = await prisma.laporan.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            dinas_id: dinas1.id,
            foto_url: PLACEHOLDER_IMAGES[8],
            lokasi_lat: -6.9314,
            lokasi_lng: 107.6517,
            kategori_ukuran: "BESAR",
            status: LAPORAN_STATUS.PENDING,
            address_text: "Jl. Kiaracondong No. 67, Bandung",
            road_name: "Jl. Kiaracondong",
            district: "Kiaracondong",
            city: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
            waste_types: ["elektronik", "plastik", "kayu"],
            drainage_risk: true,
            access_obstruction_risk: true,
            needs_manual_review: true,
            confidence: 0.48,
            priority_score: 8.9,
            priority_level: "HIGH",
        },
    });

    const laporan10 = await prisma.laporan.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            dinas_id: dinas2.id,
            foto_url: PLACEHOLDER_IMAGES[9],
            lokasi_lat: -7.2894,
            lokasi_lng: 112.7154,
            kategori_ukuran: "SEDANG",
            status: LAPORAN_STATUS.PENDING,
            address_text: "Jl. Dukuh Pakis No. 22, Surabaya",
            road_name: "Jl. Dukuh Pakis",
            district: "Dukuh Pakis",
            city: "Surabaya",
            province: "Jawa Timur",
            country: "Indonesia",
            waste_types: ["sisa_makanan", "plastik"],
            confidence: 0.71,
            priority_score: 6.1,
            priority_level: "MEDIUM",
        },
    });

    // ─── 11. FOTO ──────────────────────────────────────────
    await prisma.foto.create({
        data: {
            laporan_id: laporan1.id,
            url: PLACEHOLDER_IMAGES[0],
            hash: "a1b2c3d4e5f6",
            mime_type: "image/jpeg",
            size_bytes: 2_450_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan2.id,
            url: PLACEHOLDER_IMAGES[1],
            hash: "b2c3d4e5f6a1",
            mime_type: "image/jpeg",
            size_bytes: 3_120_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan3.id,
            url: PLACEHOLDER_IMAGES[2],
            hash: "c3d4e5f6a1b2",
            mime_type: "image/jpeg",
            size_bytes: 1_890_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan4.id,
            url: PLACEHOLDER_IMAGES[3],
            mime_type: "image/png",
            size_bytes: 4_100_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan5.id,
            url: PLACEHOLDER_IMAGES[4],
            hash: "d4e5f6a1b2c3",
            mime_type: "image/jpeg",
            size_bytes: 2_780_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan6.id,
            url: PLACEHOLDER_IMAGES[5],
            hash: "e5f6a1b2c3d4",
            mime_type: "image/jpeg",
            size_bytes: 3_400_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan7.id,
            url: PLACEHOLDER_IMAGES[6],
            mime_type: "image/png",
            size_bytes: 1_200_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan8.id,
            url: PLACEHOLDER_IMAGES[7],
            hash: "f6a1b2c3d4e5",
            mime_type: "image/jpeg",
            size_bytes: 2_650_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan9.id,
            url: PLACEHOLDER_IMAGES[8],
            hash: "a1b2c3d4e5f7",
            mime_type: "image/jpeg",
            size_bytes: 3_800_000,
        },
    });

    await prisma.foto.create({
        data: {
            laporan_id: laporan10.id,
            url: PLACEHOLDER_IMAGES[9],
            mime_type: "image/png",
            size_bytes: 2_100_000,
        },
    });

    // ─── 17. LAPORAN TASIKMALAYA (auto-collective demo) ────
    const WARGA_TSK_EMAILS = [
        "warga_tsk1@wastelens.com",
        "warga_tsk2@wastelens.com",
        "warga_tsk3@wastelens.com",
        "warga_tsk4@wastelens.com",
        "warga_tsk5@wastelens.com",
    ];

    let tasikLaporanCount = 0;

    for (const [kecKey, kec] of Object.entries(KECAMATAN)) {
        const petugas = PETUGAS_BY_KECAMATAN[kecKey];

        for (let i = 0; i < 10; i++) {
            const stat = STATUS_DISTRIBUTION[i];
            const road = kec.roads[i];
            const lat = +(kec.centerLat + rand(-0.005, 0.005)).toFixed(6);
            const lng = +(kec.centerLng + rand(-0.005, 0.005)).toFixed(6);
            const ukuran = UKURAN_OPTIONS[i];
            const wasteTypes = buildWasteTypes();
            const createdAt = daysAgo(Math.floor(rand(7, 30)));
            const wargaEmail = pick(WARGA_TSK_EMAILS);
            const isEligible = stat.eligible;

            const loadMap: Record<string, number> = {
                KECIL: 25,
                SEDANG: 100,
                BESAR: 300,
            };
            const estimatedLoad = loadMap[ukuran] ?? 0;

            const laporanTsk = await prisma.laporan.create({
                data: {
                    user_id: userId(wargaEmail),
                    dinas_id: dinasTasik.id,
                    petugas_id: isEligible ? null : petugas?.id,
                    kendaraan_id: isEligible ? null : pick(KENDARAAN_TSK_LIST).id,
                    foto_url: pick(PLACEHOLDER_IMAGES),
                    lokasi_lat: lat,
                    lokasi_lng: lng,
                    kategori_ukuran: ukuran,
                    status: LAPORAN_STATUS[stat.status],
                    address_text: buildAddress(road, kec.name),
                    road_name: road,
                    district: `Kec. ${kec.name}`,
                    city: "Kota Tasikmalaya",
                    province: "Jawa Barat",
                    country: "Indonesia",
                    waste_types: wasteTypes,
                    confidence: isEligible
                        ? +(0.7 + Math.random() * 0.28).toFixed(2)
                        : +(0.4 + Math.random() * 0.4).toFixed(2),
                    needs_manual_review: !isEligible && Math.random() > 0.5,
                    estimated_load_unit: estimatedLoad,
                    drainage_risk: Math.random() > 0.7,
                    access_obstruction_risk: Math.random() > 0.85,
                    priority_score: isEligible
                        ? +(5 + Math.random() * 5).toFixed(1)
                        : +(2 + Math.random() * 3).toFixed(1),
                    priority_level: isEligible
                        ? estimatedLoad >= 300
                            ? "HIGH"
                            : estimatedLoad >= 100
                              ? "MEDIUM"
                              : "LOW"
                        : "LOW",
                    createdAt,
                    analysed_at: daysAgo(Math.floor(rand(1, 5))),
                },
            });

            await prisma.foto.create({
                data: {
                    laporan_id: laporanTsk.id,
                    url: pick(PLACEHOLDER_IMAGES),
                    hash: `tasik_${kecKey.toLowerCase()}_${i + 1}_${Math.random().toString(36).slice(2, 8)}`,
                    mime_type: "image/jpeg",
                    size_bytes: Math.floor(rand(800_000, 4_000_000)),
                },
            });

            tasikLaporanCount++;
        }
    }

    // ─── 18. UPDATE KENDARAAN LOAD (Tasikmalaya) ──────────
    const nonEligibleLaporan = await prisma.laporan.findMany({
        where: {
            dinas_id: dinasTasik.id,
            kendaraan_id: { not: null },
            status: { in: [LAPORAN_STATUS.DIJEMPUT, LAPORAN_STATUS.PENDING] },
        },
        select: { id: true, kendaraan_id: true, estimated_load_unit: true },
    });

    for (const lap of nonEligibleLaporan) {
        if (lap.kendaraan_id && lap.estimated_load_unit) {
            await prisma.kendaraan.update({
                where: { id: lap.kendaraan_id },
                data: { current_load: { increment: lap.estimated_load_unit } },
            });
        }
    }

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
            foto_sebelum: PLACEHOLDER_IMAGES[0],
            foto_sesudah: PLACEHOLDER_IMAGES[4],
        },
    });

    await prisma.verifikasiPickup.create({
        data: {
            laporan_id: laporan5.id,
            foto_sebelum: PLACEHOLDER_IMAGES[1],
            foto_sesudah: PLACEHOLDER_IMAGES[4],
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

    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            laporan_id: laporan6.id,
            pesan: "Laporan Anda telah diterima dan sedang dalam antrian.",
            status_baca: false,
        },
    });

    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            laporan_id: laporan7.id,
            pesan: "Laporan Anda telah diterima dan sedang dalam antrian.",
            status_baca: false,
        },
    });

    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            laporan_id: laporan8.id,
            pesan: "Laporan Anda telah diterima dan sedang dalam antrian.",
            status_baca: true,
        },
    });

    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            laporan_id: laporan9.id,
            pesan: "Laporan Anda telah diterima dan sedang dalam antrian prioritas tinggi.",
            status_baca: false,
        },
    });

    await prisma.notifikasi.create({
        data: {
            user_id: userId("warga2@wastelens.com"),
            laporan_id: laporan10.id,
            pesan: "Laporan Anda telah diterima dan sedang dalam antrian.",
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
            status: LAPORAN_STATUS.PENDING,
            expires_at: tomorrow,
        },
    });

    // ─── 16. TEMPORARY UPLOAD ──────────────────────────────
    await prisma.temporaryUpload.create({
        data: {
            user_id: userId("warga1@wastelens.com"),
            provider: "cloudinary",
            public_id: "temp/warga1_upload1",
            secure_url: PLACEHOLDER_IMAGES[10],
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
            secure_url: PLACEHOLDER_IMAGES[11],
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
    console.log("   - 3 Dinas (Bandung, Surabaya, Tasikmalaya), 7 AreaCakupan, 5 Petugas, 7 Kendaraan");
    console.log("   - 40 Laporan, 40 Foto, 3 TransaksiKoin");
    console.log("   - 2 VerifikasiPickup, 9 Notifikasi");
    console.log("   - 2 Penukaran, 2 TemporaryUpload");
    console.log("   - (Tasikmalaya: 30 laporan tersebar di Tawang, Bungursari, Indihiang)");
}

main()
    .catch((e) => {
        console.error("❌ Seed gagal:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
