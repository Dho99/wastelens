import { prisma } from "@/lib/prisma";
import { LAPORAN_STATUS } from "@/lib/constants/laporan-status";

export class DispatchValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 409,
  ) {
    super(message);
    this.name = "DispatchValidationError";
  }
}

export async function validateReportsEligible(
  reportIds: string[],
  dinasId: string,
): Promise<void> {
  const existing = await prisma.laporan.findMany({
    where: { id: { in: reportIds } },
    select: {
      id: true,
      dinas_id: true,
      status: true,
      petugas_id: true,
      kendaraan_id: true,
    },
  });

  if (existing.length !== reportIds.length) {
    const foundIds = new Set(existing.map((r) => r.id));
    const missing = reportIds.filter((id) => !foundIds.has(id));
    throw new DispatchValidationError(
      `Laporan tidak ditemukan: ${missing.join(", ")}`,
      "REPORT_NOT_FOUND",
      404,
    );
  }

  for (const report of existing) {
    if (report.dinas_id !== dinasId) {
      throw new DispatchValidationError(
        `Laporan ${report.id} bukan milik Dinas ini`,
        "REPORT_NOT_OWNED",
        403,
      );
    }

    if (report.petugas_id || report.kendaraan_id) {
      throw new DispatchValidationError(
        `Laporan ${report.id} sudah di-assign`,
        "REPORT_ALREADY_ASSIGNED",
        409,
      );
    }

    if (
      report.status !== LAPORAN_STATUS.ANALYZED &&
      report.status !== LAPORAN_STATUS.WAITING
    ) {
      throw new DispatchValidationError(
        `Laporan ${report.id} status tidak eligible: ${report.status}`,
        "REPORT_STATUS_INVALID",
        409,
      );
    }
  }
}

export async function validateVehicleCapacity(
  vehicleId: string,
  totalLoad: number,
): Promise<{ current_load: number; kapasitas: number }> {
  const vehicle = await prisma.kendaraan.findUnique({
    where: { id: vehicleId },
    select: { current_load: true, kapasitas: true },
  });

  if (!vehicle) {
    throw new DispatchValidationError(
      `Kendaraan tidak ditemukan`,
      "VEHICLE_NOT_FOUND",
      404,
    );
  }

  if (vehicle.current_load + totalLoad > vehicle.kapasitas) {
    throw new DispatchValidationError(
      `Kapasitas kendaraan tidak mencukupi. Tersedia ${vehicle.kapasitas - vehicle.current_load}, dibutuhkan ${totalLoad}`,
      "VEHICLE_CAPACITY_CHANGED",
      409,
    );
  }

  return vehicle;
}

export async function validateOfficerAvailable(officerId: string, dinasId: string): Promise<void> {
  const officer = await prisma.petugas.findFirst({
    where: { id: officerId, dinas_id: dinasId },
    select: { id: true },
  });

  if (!officer) {
    throw new DispatchValidationError(
      `Petugas tidak ditemukan atau bukan milik Dinas ini`,
      "OFFICER_UNAVAILABLE",
      404,
    );
  }
}
