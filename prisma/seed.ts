import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { LAPORAN_STATUS } from "../lib/generated/prisma/enums";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, autoSignIn: true },
  user: {
    additionalFields: {
      nama: { type: "string", required: true },
      saldo_koin: { type: "number", defaultValue: 0 },
      status: { type: "string", defaultValue: "active" },
      role: { type: "string", defaultValue: "user" },
    },
  },
});

const KECAMATAN = [
  { nama: "Singaparna", lat: -7.354, lng: 108.118 },
  { nama: "Bungursari", lat: -7.3069, lng: 108.2517 },
  { nama: "Indihiang", lat: -7.319, lng: 108.272 },
  { nama: "Cihideung", lat: -7.331, lng: 108.237 },
  { nama: "Tawang", lat: -7.3253, lng: 108.219 },
];

const VARIATIONS = [
  { dlat: -0.0002, dlng: -0.0002 },
  { dlat: 0.0003, dlng: 0.0005 },
  { dlat: -0.0005, dlng: -0.0005 },
  { dlat: 0.0007, dlng: 0.0008 },
];

const UKURAN: Array<"small" | "medium" | "large"> = [
  "small", "small", "medium", "small",
  "medium", "large", "small", "medium",
  "large", "small", "medium", "small",
  "medium", "large", "large", "small",
  "medium", "small", "large", "medium",
];

const WASTE_TYPES = [
  ["plastic", "organic"],
  ["paper", "cardboard"],
  ["plastic"],
  ["organic", "glass"],
  ["plastic", "metal"],
  ["mixed", "organic"],
  ["paper"],
  ["plastic", "cardboard"],
];

async function createUser(email: string, name: string, role: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password: "wastelens123",
      nama: name,
      role,
    },
    asResponse: false,
  });

  return (result as { user: { id: string; email: string } }).user;
}

async function main() {
  console.log("Seeding Kota Tasikmalaya data...");

  const adminUser = await createUser(
    "admin.tasikmalaya@wastelens.id",
    "Admin DLH Tasikmalaya",
    "dinas",
  );
  console.log("  Admin user:", adminUser.email);

  const reporterUser = await createUser(
    "reporter@wastelens.id",
    "Warga Tasikmalaya",
    "user",
  );
  console.log("  Reporter user:", reporterUser.email);

  let dinas = await prisma.dinas.findFirst({
    where: { user_id: adminUser.id, nama_dinas: { contains: "Tasikmalaya" } },
  });

  if (dinas) {
    await prisma.foto.deleteMany({ where: { laporan: { dinas_id: dinas.id } } });
    await prisma.laporan.deleteMany({ where: { dinas_id: dinas.id } });
    await prisma.areaCakupan.deleteMany({ where: { dinas_id: dinas.id } });
    await prisma.dinas.delete({ where: { id: dinas.id } });
  }

  dinas = await prisma.dinas.create({
    data: {
      user_id: adminUser.id,
      nama_dinas: "Dinas Lingkungan Hidup Kota Tasikmalaya",
      kontak: "0265-331234",
    },
  });
  console.log("  Dinas:", dinas.nama_dinas);

  for (const kec of KECAMATAN) {
    await prisma.areaCakupan.create({
      data: {
        dinas_id: dinas.id,
        nama_wilayah: kec.nama,
      },
    });
  }
  console.log("  Area cakupan:", KECAMATAN.length);

  let idx = 0;
  for (let k = 0; k < KECAMATAN.length; k++) {
    const kec = KECAMATAN[k];
    for (let v = 0; v < VARIATIONS.length; v++) {
      const var_ = VARIATIONS[v];
      const lat = +(kec.lat + var_.dlat).toFixed(4);
      const lng = +(kec.lng + var_.dlng).toFixed(4);
      const ukuran = UKURAN[idx];
      const waste = WASTE_TYPES[idx % WASTE_TYPES.length];
      const loadUnit = ukuran === "small" ? 30 : ukuran === "medium" ? 100 : 300;

      const laporan = await prisma.laporan.create({
        data: {
          user_id: reporterUser.id,
          dinas_id: dinas.id,
          foto_url: "https://placehold.co/600x400/EEE/31343C?text=Laporan+" + (idx + 1),
          lokasi_lat: lat,
          lokasi_lng: lng,
          kategori_ukuran: ukuran,
          status: LAPORAN_STATUS.PENDING,
          district: kec.nama,
          city: "Kota Tasikmalaya",
          province: "Jawa Barat",
          country: "Indonesia",
          waste_types: waste,
          estimated_load_unit: loadUnit,
          priority_score: ukuran === "large" ? 0.9 : ukuran === "medium" ? 0.5 : 0.3,
          priority_level: ukuran === "large" ? "HIGH" : ukuran === "medium" ? "MEDIUM" : "LOW",
        },
      });

      await prisma.foto.create({
        data: {
          laporan_id: laporan.id,
          url: "https://placehold.co/600x400/EEE/31343C?text=Laporan+" + (idx + 1),
        },
      });

      idx++;
    }
  }

  console.log("Seeded: 1 dinas, 5 area cakupan, " + idx + " laporan");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
