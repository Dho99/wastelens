import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { auth } from "../lib/auth";
import { LAPORAN_STATUS } from "../lib/generated/prisma/enums";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const KECAMATAN = {
    TAWANG: {
        name: "Tawang",
        centerLat: -7.327,
        centerLng: 108.221,
        roads: [
            "Jl. Bhayangkara",
            "Jl. Rangga",
            "Jl. RE Martadinata",
            "Jl. Kartini",
            "Jl. Moh. Hatta",
            "Jl. Otista",
            "Jl. Siliwangi",
            "Jl. Pasar Wetan",
            "Jl. Tentara Pelajar",
            "Jl. KZ Mustofa",
        ],
    },
    BUNGURSARI: {
        name: "Bungursari",
        centerLat: -7.317,
        centerLng: 108.199,
        roads: [
            "Jl. Bungursari",
            "Jl. Raya Cipedes",
            "Jl. Cipedes",
            "Jl. Sukamaju",
            "Jl. Cikalang",
            "Jl. Nagarasari",
            "Jl. Panyusuhan",
            "Jl. Parakannyasag",
            "Jl. Cikunten",
            "Jl. Cibereum",
        ],
    },
    INDIHIANG: {
        name: "Indihiang",
        centerLat: -7.308,
        centerLng: 108.274,
        roads: [
            "Jl. Indihiang",
            "Jl. Raya Indihiang",
            "Jl. Sukamulya",
            "Jl. Cibungkul",
            "Jl. Parung",
            "Jl. Cigeureung",
            "Jl. Sirnarasa",
            "Jl. Cikawung",
            "Jl. Pasir",
            "Jl. Leuwiliang",
        ],
    },
} as const;

const WASTE_OPTIONS = [
    ["plastik", "kertas"],
    ["plastik", "sisa_makanan"],
    ["kayu", "logam", "plastik"],
    ["kertas", "kaca"],
    ["sisa_makanan", "plastik", "kertas"],
    ["elektronik", "logam"],
    ["plastik", "karet"],
    ["kayu", "kertas", "kaca"],
    ["kain", "plastik"],
    ["sisa_makanan", "organik"],
    ["kaca", "logam", "elektronik"],
    ["plastik", "kayu", "logam"],
];

const UKURAN_OPTIONS = [
    "KECIL",
    "KECIL",
    "KECIL",
    "KECIL",
    "SEDANG",
    "SEDANG",
    "SEDANG",
    "SEDANG",
    "BESAR",
    "BESAR",
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

async function main() {
    const now = new Date();

    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

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
        const id = (result as { user?: { id: string } })?.user?.id ?? "";
        if (!id) throw new Error(`Gagal membuat user: ${data.email}`);
        userMap.set(data.email, id);
    }

    // Update user profiles
    const profileUpdates: { email: string; address: string; phone: string }[] =
        [
            {
                email: "dinas_tasik@wastelens.com",
                address: "Jl. Perintis Kemerdekaan No. 1, Kota Tasikmalaya",
                phone: "081234567901",
            },
            {
                email: "petugas_tawang@wastelens.com",
                address: "Jl. Bhayangkara No. 45, Kec. Tawang",
                phone: "081234567902",
            },
            {
                email: "petugas_bungursari@wastelens.com",
                address: "Jl. Bungursari No. 12, Kec. Bungursari",
                phone: "081234567903",
            },
            {
                email: "petugas_indihiang@wastelens.com",
                address: "Jl. Indihiang No. 33, Kec. Indihiang",
                phone: "081234567904",
            },
            {
                email: "warga_tsk1@wastelens.com",
                address: "Jl. Cihideung No. 10, Kota Tasikmalaya",
                phone: "081234567905",
            },
            {
                email: "warga_tsk2@wastelens.com",
                address: "Jl. Cigeureung No. 22, Kec. Indihiang",
                phone: "081234567906",
            },
            {
                email: "warga_tsk3@wastelens.com",
                address: "Jl. Sukamaju No. 7, Kec. Bungursari",
                phone: "081234567907",
            },
            {
                email: "warga_tsk4@wastelens.com",
                address: "Jl. Pasar Wetan No. 15, Kec. Tawang",
                phone: "081234567908",
            },
            {
                email: "warga_tsk5@wastelens.com",
                address: "Jl. Raya Indihiang No. 88, Kec. Indihiang",
                phone: "081234567909",
            },
        ];

    for (const u of profileUpdates) {
        await prisma.user.update({
            where: { id: userId(u.email) },
            data: {
                address: u.address,
                phoneNumber: u.phone,
                image: `https://api.dicebear.com/9.x/initials/svg?seed=${u.email.split("@")[0]}`,
                createdAt: daysAgo(30),
                emailVerified: true,
                saldo_koin: u.email.startsWith("warga")
                    ? Math.floor(rand(10, 200))
                    : 0,
            },
        });
    }

    // ─── 2. DINAS KOTA TASIKMALAYA ──────────────────────────
    const dinas = await prisma.dinas.create({
        data: {
            user_id: userId("dinas_tasik@wastelens.com"),
            nama_dinas: "DLH Kota Tasikmalaya",
            kontak: "0265-123456",
        },
    });

    // ─── 3. AREA CAKUPAN ────────────────────────────────────
    for (const k of Object.values(KECAMATAN)) {
        await prisma.areaCakupan.create({
            data: { dinas_id: dinas.id, nama_wilayah: `Kecamatan ${k.name}` },
        });
    }

    // ─── 4. PETUGAS ──────────────────────────────────────────
    const petugasTawang = await prisma.petugas.create({
        data: {
            dinas_id: dinas.id,
            user_id: userId("petugas_tawang@wastelens.com"),
            nama: "Cecep Hermawan",
            no_hp: "081234567902",
        },
    });

    const petugasBungursari = await prisma.petugas.create({
        data: {
            dinas_id: dinas.id,
            user_id: userId("petugas_bungursari@wastelens.com"),
            nama: "Yayat Suryana",
            no_hp: "081234567903",
        },
    });

    const petugasIndihiang = await prisma.petugas.create({
        data: {
            dinas_id: dinas.id,
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

    // ─── 5. KENDARAAN ────────────────────────────────────────
    const kendaraanDumpTruck = await prisma.kendaraan.create({
        data: {
            dinas_id: dinas.id,
            jenis: "Dump Truck",
            kapasitas: 5000,
            current_load: 0,
        },
    });

    const kendaraanArmroll = await prisma.kendaraan.create({
        data: {
            dinas_id: dinas.id,
            jenis: "Armroll Truck",
            kapasitas: 8000,
            current_load: 0,
        },
    });

    const kendaraanPickUp = await prisma.kendaraan.create({
        data: {
            dinas_id: dinas.id,
            jenis: "Pick Up",
            kapasitas: 1500,
            current_load: 0,
        },
    });

    const kendaraanMotor = await prisma.kendaraan.create({
        data: {
            dinas_id: dinas.id,
            jenis: "Motor Roda Tiga",
            kapasitas: 500,
            current_load: 0,
        },
    });

    const KENDARAAN_LIST = [
        kendaraanDumpTruck,
        kendaraanArmroll,
        kendaraanPickUp,
        kendaraanMotor,
    ];

    // ─── 6. LAPORAN ──────────────────────────────────────────
    const WARGA_EMAILS = [
        "warga_tsk1@wastelens.com",
        "warga_tsk2@wastelens.com",
        "warga_tsk3@wastelens.com",
        "warga_tsk4@wastelens.com",
        "warga_tsk5@wastelens.com",
    ];

    let laporanCount = 0;

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
            const wargaEmail = pick(WARGA_EMAILS);
            const isEligible = stat.eligible;

            const loadMap: Record<string, number> = {
                KECIL: 25,
                SEDANG: 100,
                BESAR: 300,
            };
            const estimatedLoad = loadMap[ukuran] ?? 0;

            const laporan = await prisma.laporan.create({
                data: {
                    user_id: userId(wargaEmail),
                    dinas_id: dinas.id,
                    petugas_id: isEligible ? null : petugas?.id,
                    kendaraan_id: isEligible ? null : pick(KENDARAAN_LIST).id,
                    foto_url: `https://res.cloudinary.com/wastelens/image/upload/tasik/${kecKey.toLowerCase()}_laporan${i + 1}.jpg`,
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

            // Foto
            await prisma.foto.create({
                data: {
                    laporan_id: laporan.id,
                    url: `https://res.cloudinary.com/wastelens/image/upload/tasik/${kecKey.toLowerCase()}_laporan${i + 1}.jpg`,
                    hash: `tasik_${kecKey.toLowerCase()}_${i + 1}_${Math.random().toString(36).slice(2, 8)}`,
                    mime_type: "image/jpeg",
                    size_bytes: Math.floor(rand(800_000, 4_000_000)),
                },
            });

            laporanCount++;
        }
    }

    // ─── 7. UPDATE KENDARAAN LOAD ──────────────────────────
    const nonEligibleLaporan = await prisma.laporan.findMany({
        where: {
            dinas_id: dinas.id,
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

    // ─── SUMMARY ─────────────────────────────────────────────
    console.log("✅ Tasikmalaya seed berhasil dibuat!");
    console.log("📊 Ringkasan:");
    console.log(
        "   - 9 User (1 dinas, 3 petugas, 5 warga) — password: password123",
    );
    console.log("   - 1 Dinas: DLH Kota Tasikmalaya");
    console.log("   - 3 Area Cakupan (Tawang, Bungursari, Indihiang)");
    console.log("   - 3 Petugas, 4 Kendaraan");
    console.log(`   - ${laporanCount} Laporan + ${laporanCount} Foto`);
    console.log(
        "   - ~24 laporan eligible untuk auto-collective (ANALYZED/WAITING)",
    );
    console.log(
        "   - ~6 laporan tidak eligible (PENDING/DIJEMPUT, assigned ke petugas+kendaraan)",
    );
}

main()
    .catch((e) => {
        console.error("❌ Tasikmalaya seed gagal:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
