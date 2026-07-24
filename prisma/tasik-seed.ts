import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { LAPORAN_STATUS } from "../lib/constants/laporan-status";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const TEST_REPORTS = [
  { lat: -6.914744, lng: 107.609810, size: "KECIL", load: 25, priority: 6.2, address: "Jl. Braga, Bandung" },
  { lat: -6.917464, lng: 107.619123, size: "SEDANG", load: 100, priority: 8.4, address: "Jl. Asia Afrika, Bandung" },
  { lat: -6.921857, lng: 107.607174, size: "KECIL", load: 25, priority: 5.8, address: "Jl. Otto Iskandardinata, Bandung" },
  { lat: -6.907823, lng: 107.618522, size: "BESAR", load: 300, priority: 9.1, address: "Jl. Merdeka, Bandung" },
  { lat: -6.926773, lng: 107.616268, size: "SEDANG", load: 100, priority: 7.5, address: "Jl. Lengkong Besar, Bandung" },
] as const;

async function main() {
  const dinasEmail = process.env.TEST_DINAS_EMAIL ?? "dinas1@wastelens.com";
  const reporterEmail = process.env.TEST_REPORTER_EMAIL ?? "warga1@wastelens.com";

  const [dinasUser, reporter] = await Promise.all([
    prisma.user.findUnique({
      where: { email: dinasEmail },
      include: { dinas: true },
    }),
    prisma.user.findUnique({ where: { email: reporterEmail } }),
  ]);

  const dinas = dinasUser?.dinas[0];
  if (!dinas) {
    throw new Error(`Dinas dengan email ${dinasEmail} tidak ditemukan`);
  }
  if (!reporter) {
    throw new Error(`Warga dengan email ${reporterEmail} tidak ditemukan`);
  }

  const [officerCount, vehicleCount] = await Promise.all([
    prisma.petugas.count({ where: { dinas_id: dinas.id } }),
    prisma.kendaraan.count({ where: { dinas_id: dinas.id } }),
  ]);

  if (officerCount === 0 || vehicleCount === 0) {
    throw new Error("Dinas harus memiliki minimal satu petugas dan satu kendaraan");
  }

  for (const [index, report] of TEST_REPORTS.entries()) {
    const clientRequestId = `autocollect-test-${dinas.id}-${index + 1}`;
    const data = {
      user_id: reporter.id,
      dinas_id: dinas.id,
      petugas_id: null,
      kendaraan_id: null,
      foto_url: "/images/waste_bags_stack.png",
      lokasi_lat: report.lat,
      lokasi_lng: report.lng,
      kategori_ukuran: report.size,
      status: LAPORAN_STATUS.ANALYZED,
      address_text: report.address,
      district: "Kota Bandung",
      city: "Bandung",
      province: "Jawa Barat",
      country: "Indonesia",
      waste_types: ["plastik", "organik"],
      confidence: 0.92,
      needs_manual_review: false,
      estimated_load_unit: report.load,
      priority_score: report.priority,
      priority_level: report.priority >= 9 ? "HIGH" : report.priority >= 7 ? "MEDIUM" : "LOW",
      analysed_at: new Date(),
      assigned_load_kg: null,
      load_released_at: null,
      route_order: null,
    };

    await prisma.laporan.upsert({
      where: { client_request_id: clientRequestId },
      create: { ...data, client_request_id: clientRequestId },
      update: data,
    });
  }

  console.log(`Berhasil menyiapkan ${TEST_REPORTS.length} laporan autocollect untuk ${dinas.nama_dinas}.`);
  console.log(`Login Dinas: ${dinasEmail}`);
  console.log("Buka http://localhost:3000/dinas lalu pilih titik laporan pada peta.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
