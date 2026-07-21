import { prisma } from "@/lib/prisma";
import { findDinasByDistrict } from "./spatial";

const LOAD_ESTIMATES: Record<string, number> = {
  small: 30,
  medium: 100,
  large: 300,
};

export async function autoAssignDinas(
  district: string | null
): Promise<{ dinas_id: string | null; petugas_id: string | null; kendaraan_id: string | null }> {
  if (!district || district.trim() === "") {
    return { dinas_id: null, petugas_id: null, kendaraan_id: null };
  }

  const dinas = await findDinasByDistrict(district);
  if (!dinas) {
    return { dinas_id: null, petugas_id: null, kendaraan_id: null };
  }

  return { dinas_id: dinas.dinasId, petugas_id: null, kendaraan_id: null };
}

export async function assignKendaraan(
  dinasId: string,
  rekomendasiKendaraan: string | null,
  kategoriUkuran: string
): Promise<{ kendaraan_id: string | null; petugas_id: string | null }> {
  const vehicleType = rekomendasiKendaraan ?? fallbackVehicle(kategoriUkuran);

  const available = await prisma.$queryRaw<Array<{ id: string; current_load: number; kapasitas: number }>>`
    SELECT id, current_load, kapasitas FROM "KENDARAAN"
    WHERE dinas_id = ${dinasId}::uuid
      AND jenis = ${vehicleType}
      AND current_load < kapasitas
    ORDER BY current_load ASC
    LIMIT 1
  `;

  if (!available || available.length === 0) {
    return { kendaraan_id: null, petugas_id: null };
  }

  const vehicle = available[0];
  const estimatedLoad = LOAD_ESTIMATES[kategoriUkuran] ?? 50;

  await prisma.kendaraan.update({
    where: { id: vehicle.id },
    data: { current_load: { increment: estimatedLoad } },
  });

  const petugas = await prisma.petugas.findFirst({
    where: { dinas_id: dinasId },
    orderBy: { id: "asc" },
  });

  return {
    kendaraan_id: vehicle.id,
    petugas_id: petugas?.id ?? null,
  };
}

export function fallbackVehicle(kategoriUkuran: string): string {
  switch (kategoriUkuran) {
    case "small":
      return "pickup";
    case "medium":
      return "tossa";
    case "large":
      return "truck";
    default:
      return "pickup";
  }
}
