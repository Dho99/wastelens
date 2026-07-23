import { prisma } from "@/lib/prisma";
import { AUTO_COLLECTIVE_CONFIG, LOAD_ESTIMATES_KG } from "@/app/dinas/config/auto-collective";
import type { AutoCollectiveStop, AvailableVehicle, EligibleReport } from "@/app/dinas/types/auto-collective";
import {
  computeEstimatedLoadKg,
  computeRouteDetails,
  isVehicleCompatible,
} from "./auto-collective.service";
import { haversineDistance } from "@/lib/services/spatial";
import { RouteStatus } from "@/lib/generated/prisma/enums";
import { notifyUser } from "@/server/websocket/notify.service";
import { createReportAssignedEvent } from "@/server/websocket/websocket.events";

export const ACTIVE_ROUTE_BLOCK_MESSAGE =
  "Kendaraan sedang menjalankan rute aktif. Pilih kendaraan lain atau masukkan laporan ke perencanaan berikutnya.";

export const ACTIVE_ROUTE_BLOCK_CODE = "ROUTE_IN_PROGRESS";

export type InsertStop = {
  reportId: string;
  lat: number;
  lng: number;
  priorityScore: number | null;
  estimatedLoadKg: number;
};

export type InsertionResult = {
  insertionIndex: number;
  orderedStops: InsertStop[];
  deltaDistanceKm: number;
  deltaDurationMinutes: number;
  totalDistanceKm: number;
  totalDurationMinutes: number;
};

function priorityOf(stop: InsertStop): number {
  return stop.priorityScore ?? 0;
}

/** Keeps non-increasing priority_score from front to back after insert. */
export function isPriorityOrderValid(ordered: InsertStop[]): boolean {
  for (let i = 1; i < ordered.length; i++) {
    if (priorityOf(ordered[i - 1]) < priorityOf(ordered[i]) - 1e-9) {
      return false;
    }
  }
  return true;
}

export function estimatePathKm(stops: InsertStop[]): number {
  let total = 0;
  for (let i = 1; i < stops.length; i++) {
    total += haversineDistance(stops[i - 1].lat, stops[i - 1].lng, stops[i].lat, stops[i].lng) / 1000;
  }
  return total;
}

/** Approx duration minutes using 8.3 m/s (~30 km/h) like OSRM fallback. */
export function estimatePathMinutes(stops: InsertStop[]): number {
  let meters = 0;
  for (let i = 1; i < stops.length; i++) {
    meters += haversineDistance(stops[i - 1].lat, stops[i - 1].lng, stops[i].lat, stops[i].lng);
  }
  return meters / 8.3 / 60;
}

/**
 * Insert newStop into existingStops (order preserved) at the index that
 * minimizes added distance/duration without violating priority monotonicity.
 */
export function findBestInsertion(
  existingStops: InsertStop[],
  newStop: InsertStop,
  measureDistanceKm: (stops: InsertStop[]) => number = estimatePathKm,
  measureDurationMin: (stops: InsertStop[]) => number = estimatePathMinutes,
): InsertionResult {
  if (existingStops.length === 0) {
    return {
      insertionIndex: 0,
      orderedStops: [newStop],
      deltaDistanceKm: 0,
      deltaDurationMinutes: 0,
      totalDistanceKm: 0,
      totalDurationMinutes: 0,
    };
  }

  const baseDistance = measureDistanceKm(existingStops);
  const baseDuration = measureDurationMin(existingStops);

  let best: InsertionResult | null = null;

  for (let i = 0; i <= existingStops.length; i++) {
    const ordered = [
      ...existingStops.slice(0, i),
      newStop,
      ...existingStops.slice(i),
    ];
    if (!isPriorityOrderValid(ordered)) continue;

    const totalDistanceKm = measureDistanceKm(ordered);
    const totalDurationMinutes = measureDurationMin(ordered);
    const deltaDistanceKm = totalDistanceKm - baseDistance;
    const deltaDurationMinutes = totalDurationMinutes - baseDuration;

    const candidate: InsertionResult = {
      insertionIndex: i,
      orderedStops: ordered,
      deltaDistanceKm,
      deltaDurationMinutes,
      totalDistanceKm,
      totalDurationMinutes,
    };

    if (
      !best ||
      candidate.deltaDurationMinutes < best.deltaDurationMinutes - 1e-9 ||
      (Math.abs(candidate.deltaDurationMinutes - best.deltaDurationMinutes) < 1e-9 &&
        candidate.deltaDistanceKm < best.deltaDistanceKm - 1e-9) ||
      (Math.abs(candidate.deltaDurationMinutes - best.deltaDurationMinutes) < 1e-9 &&
        Math.abs(candidate.deltaDistanceKm - best.deltaDistanceKm) < 1e-9 &&
        candidate.insertionIndex < best.insertionIndex)
    ) {
      best = candidate;
    }
  }

  if (!best) {
    // Fallback: append last even if priority conflicts (caller may still reject)
    const ordered = [...existingStops, newStop];
    const totalDistanceKm = measureDistanceKm(ordered);
    const totalDurationMinutes = measureDurationMin(ordered);
    best = {
      insertionIndex: existingStops.length,
      orderedStops: ordered,
      deltaDistanceKm: totalDistanceKm - baseDistance,
      deltaDurationMinutes: totalDurationMinutes - baseDuration,
      totalDistanceKm,
      totalDurationMinutes,
    };
  }

  return best;
}

export function assertRouteAllowsAppend(status: RouteStatus): void {
  if (status === "IN_PROGRESS") {
    const err = new Error(ACTIVE_ROUTE_BLOCK_MESSAGE) as Error & { code: string; status: number };
    err.code = ACTIVE_ROUTE_BLOCK_CODE;
    err.status = 409;
    throw err;
  }
  if (status === "COMPLETED" || status === "CANCELLED") {
    const err = new Error(`Rute berstatus ${status} tidak dapat diubah`) as Error & {
      code: string;
      status: number;
    };
    err.code = "ROUTE_LOCKED";
    err.status = 409;
    throw err;
  }
}

function toInsertStop(report: {
  id: string;
  lokasi_lat: number;
  lokasi_lng: number;
  priority_score: number | null;
  kategori_ukuran: string;
  corrected_kategori_ukuran: string | null;
  assigned_load_kg?: number | null;
}): InsertStop {
  return {
    reportId: report.id,
    lat: report.lokasi_lat,
    lng: report.lokasi_lng,
    priorityScore: report.priority_score,
    estimatedLoadKg:
      report.assigned_load_kg ??
      computeEstimatedLoadKg({
        kategori_ukuran: report.kategori_ukuran,
        corrected_kategori_ukuran: report.corrected_kategori_ukuran,
      }),
  };
}

function toAutoCollectiveStop(stop: InsertStop, meta?: Partial<AutoCollectiveStop>): AutoCollectiveStop {
  return {
    reportId: stop.reportId,
    lat: stop.lat,
    lng: stop.lng,
    address: meta?.address ?? null,
    priorityLevel: meta?.priorityLevel ?? null,
    priorityScore: stop.priorityScore,
    estimatedLoadKg: stop.estimatedLoadKg,
    sizeCategory: meta?.sizeCategory ?? "KECIL",
    drainageRisk: meta?.drainageRisk ?? false,
    accessObstructionRisk: meta?.accessObstructionRisk ?? false,
    wasteTypes: meta?.wasteTypes ?? [],
  };
}

export type AppendPreviewResult = {
  routeId: string;
  routeStatus: RouteStatus;
  reportId: string;
  insertionIndex: number;
  proposedOrder: string[];
  capacityBefore: number;
  capacityAfter: number;
  vehicleCapacity: number;
  deltaDistanceKm: number;
  deltaDurationMinutes: number;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  impactToken: string;
};

function makeImpactToken(parts: {
  routeId: string;
  reportId: string;
  proposedOrder: string[];
  insertionIndex: number;
}): string {
  return Buffer.from(
    JSON.stringify({
      routeId: parts.routeId,
      reportId: parts.reportId,
      proposedOrder: parts.proposedOrder,
      insertionIndex: parts.insertionIndex,
    }),
  ).toString("base64url");
}

export function parseImpactToken(token: string): {
  routeId: string;
  reportId: string;
  proposedOrder: string[];
  insertionIndex: number;
} {
  return JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
}

export async function previewAppendToRoute(
  dinasId: string,
  routeId: string,
  reportId: string,
): Promise<AppendPreviewResult> {
  const route = await prisma.dispatchRoute.findFirst({
    where: { id: routeId, dinas_id: dinasId },
    include: {
      kendaraan: true,
      laporan: {
        where: { status: { in: ["PENDING", "DIJEMPUT"] } },
        orderBy: { route_order: "asc" },
      },
    },
  });

  if (!route) {
    const err = new Error("Rute tidak ditemukan") as Error & { code: string; status: number };
    err.code = "ROUTE_NOT_FOUND";
    err.status = 404;
    throw err;
  }

  assertRouteAllowsAppend(route.status);

  const report = await prisma.laporan.findFirst({
    where: { id: reportId, dinas_id: dinasId },
  });

  if (!report) {
    const err = new Error("Laporan tidak ditemukan") as Error & { code: string; status: number };
    err.code = "REPORT_NOT_FOUND";
    err.status = 404;
    throw err;
  }

  if (report.petugas_id || report.kendaraan_id || report.route_id) {
    const err = new Error("Laporan sudah memiliki assignment") as Error & { code: string; status: number };
    err.code = "REPORT_ALREADY_ASSIGNED";
    err.status = 409;
    throw err;
  }

  if (report.status !== "ANALYZED" && report.status !== "WAITING") {
    const err = new Error(`Status laporan tidak eligible: ${report.status}`) as Error & {
      code: string;
      status: number;
    };
    err.code = "REPORT_NOT_ELIGIBLE";
    err.status = 409;
    throw err;
  }

  const newLoad = computeEstimatedLoadKg({
    kategori_ukuran: report.kategori_ukuran,
    corrected_kategori_ukuran: report.corrected_kategori_ukuran,
  });

  if (newLoad <= 0) {
    const err = new Error("Load laporan tidak pasti / nol") as Error & { code: string; status: number };
    err.code = "UNCERTAIN_LOAD";
    err.status = 409;
    throw err;
  }

  const vehicle: AvailableVehicle = {
    id: route.kendaraan.id,
    jenis: route.kendaraan.jenis,
    kapasitas: route.kendaraan.kapasitas,
    current_load: route.kendaraan.current_load,
  };

  const eligibleLike: EligibleReport = {
    id: report.id,
    lokasi_lat: report.lokasi_lat,
    lokasi_lng: report.lokasi_lng,
    kategori_ukuran: report.kategori_ukuran,
    corrected_kategori_ukuran: report.corrected_kategori_ukuran,
    priority_score: report.priority_score,
    priority_level: report.priority_level,
    estimated_load_unit: report.estimated_load_unit,
    estimatedLoadKg: newLoad,
    address_text: report.address_text,
    district: report.district,
    drainage_risk: report.drainage_risk,
    access_obstruction_risk: report.access_obstruction_risk,
    waste_types: report.waste_types,
    createdAt: report.createdAt.toISOString(),
    needs_manual_review: report.needs_manual_review,
  };

  if (!isVehicleCompatible(vehicle, eligibleLike)) {
    const err = new Error("Kendaraan tidak kompatibel dengan akses lokasi") as Error & {
      code: string;
      status: number;
    };
    err.code = "ACCESS_INCOMPATIBLE";
    err.status = 409;
    throw err;
  }

  if (route.laporan.length + 1 > AUTO_COLLECTIVE_CONFIG.maxStopsPerRoute) {
    const err = new Error("Batas jumlah stop per rute terlampaui") as Error & { code: string; status: number };
    err.code = "MAX_STOPS";
    err.status = 409;
    throw err;
  }

  if (route.kendaraan.current_load + newLoad > route.kendaraan.kapasitas) {
    const err = new Error("Kapasitas kendaraan tidak mencukupi") as Error & { code: string; status: number };
    err.code = "CAPACITY";
    err.status = 409;
    throw err;
  }

  const existing = route.laporan.map(toInsertStop);
  const incoming = toInsertStop({ ...report, assigned_load_kg: newLoad });
  const insertion = findBestInsertion(existing, incoming);

  if (
    insertion.totalDistanceKm > AUTO_COLLECTIVE_CONFIG.maxRouteDistanceKm ||
    insertion.totalDurationMinutes > AUTO_COLLECTIVE_CONFIG.maxEstimatedDurationMinutes
  ) {
    const err = new Error("Batas jarak atau durasi rute terlampaui") as Error & { code: string; status: number };
    err.code = "ROUTE_LIMIT";
    err.status = 409;
    throw err;
  }

  const proposedOrder = insertion.orderedStops.map((s) => s.reportId);
  const impactToken = makeImpactToken({
    routeId,
    reportId,
    proposedOrder,
    insertionIndex: insertion.insertionIndex,
  });

  return {
    routeId,
    routeStatus: route.status,
    reportId,
    insertionIndex: insertion.insertionIndex,
    proposedOrder,
    capacityBefore: route.kendaraan.current_load,
    capacityAfter: route.kendaraan.current_load + newLoad,
    vehicleCapacity: route.kendaraan.kapasitas,
    deltaDistanceKm: insertion.deltaDistanceKm,
    deltaDurationMinutes: insertion.deltaDurationMinutes,
    totalDistanceKm: insertion.totalDistanceKm,
    totalDurationMinutes: insertion.totalDurationMinutes,
    impactToken,
  };
}

export async function confirmAppendToRoute(
  dinasId: string,
  routeId: string,
  reportId: string,
  impactToken: string,
): Promise<{
  routeId: string;
  proposedOrder: string[];
  routeGeometry: [number, number][];
  estimatedDistanceKm: number | null;
  estimatedDurationMinutes: number | null;
}> {
  const token = parseImpactToken(impactToken);
  if (token.routeId !== routeId || token.reportId !== reportId) {
    const err = new Error("Impact token tidak cocok") as Error & { code: string; status: number };
    err.code = "IMPACT_TOKEN_MISMATCH";
    err.status = 400;
    throw err;
  }

  const result = await prisma.$transaction(async (tx) => {
    const routeRows = await tx.$queryRawUnsafe<Array<{ id: string; status: RouteStatus; kendaraan_id: string; petugas_id: string }>>(
      `SELECT id, status, kendaraan_id, petugas_id FROM "DISPATCH_ROUTE" WHERE id = $1::uuid AND dinas_id = $2::uuid FOR UPDATE`,
      routeId,
      dinasId,
    );
    if (routeRows.length === 0) {
      const err = new Error("Rute tidak ditemukan") as Error & { code: string; status: number };
      err.code = "ROUTE_NOT_FOUND";
      err.status = 404;
      throw err;
    }
    const routeLock = routeRows[0];
    assertRouteAllowsAppend(routeLock.status);

    await tx.$queryRawUnsafe(
      `SELECT id FROM "KENDARAAN" WHERE id = $1::uuid FOR UPDATE`,
      routeLock.kendaraan_id,
    );
    await tx.$queryRawUnsafe(
      `SELECT id FROM "PETUGAS" WHERE id = $1::uuid FOR UPDATE`,
      routeLock.petugas_id,
    );

    const reportRows = await tx.$queryRawUnsafe<
      Array<{
        id: string;
        user_id: string;
        petugas_id: string | null;
        kendaraan_id: string | null;
        route_id: string | null;
        status: string;
        lokasi_lat: number;
        lokasi_lng: number;
        priority_score: number | null;
        kategori_ukuran: string;
        corrected_kategori_ukuran: string | null;
        access_obstruction_risk: boolean | null;
      }>
    >(
      `SELECT id, user_id, petugas_id, kendaraan_id, route_id, status, lokasi_lat, lokasi_lng, priority_score,
              kategori_ukuran, corrected_kategori_ukuran, access_obstruction_risk
       FROM "LAPORAN" WHERE id = $1::uuid AND dinas_id = $2::uuid FOR UPDATE`,
      reportId,
      dinasId,
    );

    if (reportRows.length === 0) {
      const err = new Error("Laporan tidak ditemukan") as Error & { code: string; status: number };
      err.code = "REPORT_NOT_FOUND";
      err.status = 404;
      throw err;
    }

    const report = reportRows[0];
    if (report.petugas_id || report.kendaraan_id || report.route_id) {
      const err = new Error("Laporan sudah memiliki assignment") as Error & { code: string; status: number };
      err.code = "REPORT_ALREADY_ASSIGNED";
      err.status = 409;
      throw err;
    }
    if (report.status !== "ANALYZED" && report.status !== "WAITING") {
      const err = new Error("Status laporan tidak eligible") as Error & { code: string; status: number };
      err.code = "REPORT_NOT_ELIGIBLE";
      err.status = 409;
      throw err;
    }

    const existingReports = await tx.laporan.findMany({
      where: {
        route_id: routeId,
        status: { in: ["PENDING", "DIJEMPUT"] },
      },
      orderBy: { route_order: "asc" },
    });

    for (const stop of existingReports) {
      await tx.$queryRawUnsafe(`SELECT id FROM "LAPORAN" WHERE id = $1::uuid FOR UPDATE`, stop.id);
    }

    const vehicle = await tx.kendaraan.findUniqueOrThrow({ where: { id: routeLock.kendaraan_id } });
    const newLoad = computeEstimatedLoadKg({
      kategori_ukuran: report.kategori_ukuran,
      corrected_kategori_ukuran: report.corrected_kategori_ukuran,
    });

    if (vehicle.current_load + newLoad > vehicle.kapasitas) {
      const err = new Error("Kapasitas kendaraan tidak mencukupi") as Error & { code: string; status: number };
      err.code = "CAPACITY";
      err.status = 409;
      throw err;
    }

    if (existingReports.length + 1 > AUTO_COLLECTIVE_CONFIG.maxStopsPerRoute) {
      const err = new Error("Batas jumlah stop per rute terlampaui") as Error & { code: string; status: number };
      err.code = "MAX_STOPS";
      err.status = 409;
      throw err;
    }

    const vehicleAvail: AvailableVehicle = {
      id: vehicle.id,
      jenis: vehicle.jenis,
      kapasitas: vehicle.kapasitas,
      current_load: vehicle.current_load,
    };
    const eligibleLike: EligibleReport = {
      id: report.id,
      lokasi_lat: report.lokasi_lat,
      lokasi_lng: report.lokasi_lng,
      kategori_ukuran: report.kategori_ukuran,
      corrected_kategori_ukuran: report.corrected_kategori_ukuran,
      priority_score: report.priority_score,
      priority_level: null,
      estimated_load_unit: null,
      estimatedLoadKg: newLoad,
      address_text: null,
      district: null,
      drainage_risk: false,
      access_obstruction_risk: report.access_obstruction_risk,
      waste_types: [],
      createdAt: new Date().toISOString(),
      needs_manual_review: false,
    };
    if (!isVehicleCompatible(vehicleAvail, eligibleLike)) {
      const err = new Error("Kendaraan tidak kompatibel dengan akses lokasi") as Error & {
        code: string;
        status: number;
      };
      err.code = "ACCESS_INCOMPATIBLE";
      err.status = 409;
      throw err;
    }

    const existing = existingReports.map(toInsertStop);
    const incoming = toInsertStop({ ...report, assigned_load_kg: newLoad });
    const insertion = findBestInsertion(existing, incoming);

    if (
      insertion.totalDistanceKm > AUTO_COLLECTIVE_CONFIG.maxRouteDistanceKm ||
      insertion.totalDurationMinutes > AUTO_COLLECTIVE_CONFIG.maxEstimatedDurationMinutes
    ) {
      const err = new Error("Batas jarak atau durasi rute terlampaui") as Error & { code: string; status: number };
      err.code = "ROUTE_LIMIT";
      err.status = 409;
      throw err;
    }

    const assignResult = await tx.laporan.updateMany({
      where: {
        id: reportId,
        dinas_id: dinasId,
        petugas_id: null,
        kendaraan_id: null,
        route_id: null,
        status: { in: ["ANALYZED", "WAITING"] },
      },
      data: {
        petugas_id: routeLock.petugas_id,
        kendaraan_id: routeLock.kendaraan_id,
        route_id: routeId,
        status: "PENDING",
        assigned_load_kg: newLoad,
        load_released_at: null,
        route_order: insertion.insertionIndex + 1,
      },
    });

    if (assignResult.count !== 1) {
      const err = new Error("Laporan gagal di-assign (mungkin sudah diambil)") as Error & {
        code: string;
        status: number;
      };
      err.code = "REPORT_ALREADY_ASSIGNED";
      err.status = 409;
      throw err;
    }

    for (let i = 0; i < insertion.orderedStops.length; i++) {
      const stopId = insertion.orderedStops[i].reportId;
      await tx.laporan.update({
        where: { id: stopId },
        data: { route_order: i + 1 },
      });
    }

    await tx.kendaraan.update({
      where: { id: vehicle.id },
      data: { current_load: { increment: newLoad } },
    });

    const details = await computeRouteDetails(
      insertion.orderedStops.map((s) => toAutoCollectiveStop(s)),
    );

    const totalLoad = insertion.orderedStops.reduce((sum, s) => sum + s.estimatedLoadKg, 0);

    await tx.dispatchRoute.update({
      where: { id: routeId },
      data: {
        estimated_distance_km: details.estimatedDistanceKm,
        estimated_duration_minutes: details.estimatedDurationMinutes,
        total_load_kg: totalLoad,
        route_geometry: details.routeGeometry,
        routing_source: details.routingSource,
      },
    });

    return {
      routeId,
      proposedOrder: insertion.orderedStops.map((s) => s.reportId),
      routeGeometry: details.routeGeometry,
      estimatedDistanceKm: details.estimatedDistanceKm,
      estimatedDurationMinutes: details.estimatedDurationMinutes,
      petugasId: routeLock.petugas_id,
      reporterUserId: report.user_id,
      reportId,
    };
  });

  const petugas = await prisma.petugas.findUnique({
    where: { id: result.petugasId },
    select: { user_id: true },
  });

  if (petugas?.user_id) {
    await notifyUser({
      userId: petugas.user_id,
      laporanId: result.reportId,
      pesan: "Laporan baru ditambahkan ke rute pickup Anda. Segera periksa daftar tugas.",
      event: createReportAssignedEvent({
        laporanId: result.reportId,
        petugasId: result.petugasId,
      }),
    });
  }

  if (result.reporterUserId) {
    await notifyUser({
      userId: result.reporterUserId,
      laporanId: result.reportId,
      pesan: "Laporan Anda telah dijadwalkan untuk dijemput.",
      event: createReportAssignedEvent({
        laporanId: result.reportId,
        petugasId: result.petugasId,
      }),
    });
  }

  return {
    routeId: result.routeId,
    proposedOrder: result.proposedOrder,
    routeGeometry: result.routeGeometry,
    estimatedDistanceKm: result.estimatedDistanceKm,
    estimatedDurationMinutes: result.estimatedDurationMinutes,
  };
}

export async function createDispatchRouteForAssignment(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  input: {
    dinasId: string;
    petugasId: string;
    kendaraanId: string;
    stopIds: string[];
    routeOrder: number[];
    totalLoadKg: number;
  },
): Promise<string> {
  const stops = await tx.laporan.findMany({
    where: { id: { in: input.stopIds } },
    select: {
      id: true,
      lokasi_lat: true,
      lokasi_lng: true,
      priority_score: true,
      assigned_load_kg: true,
      kategori_ukuran: true,
      corrected_kategori_ukuran: true,
      address_text: true,
      priority_level: true,
      drainage_risk: true,
      access_obstruction_risk: true,
      waste_types: true,
    },
  });

  const byId = new Map(stops.map((s) => [s.id, s]));
  const orderedStops: AutoCollectiveStop[] = [];
  for (let i = 0; i < input.stopIds.length; i++) {
    const raw = byId.get(input.stopIds[i]);
    if (!raw) continue;
    orderedStops.push({
      reportId: raw.id,
      lat: raw.lokasi_lat,
      lng: raw.lokasi_lng,
      address: raw.address_text,
      priorityLevel: raw.priority_level,
      priorityScore: raw.priority_score,
      estimatedLoadKg:
        raw.assigned_load_kg ??
        (LOAD_ESTIMATES_KG[(raw.corrected_kategori_ukuran ?? raw.kategori_ukuran).toUpperCase()] ?? 0),
      sizeCategory: raw.kategori_ukuran,
      drainageRisk: raw.drainage_risk,
      accessObstructionRisk: raw.access_obstruction_risk,
      wasteTypes: raw.waste_types,
    });
  }

  const details = await computeRouteDetails(orderedStops);

  const created = await tx.dispatchRoute.create({
    data: {
      dinas_id: input.dinasId,
      petugas_id: input.petugasId,
      kendaraan_id: input.kendaraanId,
      status: "CONFIRMED",
      estimated_distance_km: details.estimatedDistanceKm,
      estimated_duration_minutes: details.estimatedDurationMinutes,
      total_load_kg: input.totalLoadKg,
      route_geometry: details.routeGeometry,
      routing_source: details.routingSource,
    },
  });

  for (let i = 0; i < input.stopIds.length; i++) {
    await tx.laporan.update({
      where: { id: input.stopIds[i] },
      data: {
        route_id: created.id,
        route_order: input.routeOrder[i] ?? i + 1,
      },
    });
  }

  return created.id;
}
