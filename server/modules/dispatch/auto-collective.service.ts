import { prisma } from "@/lib/prisma";
import { haversineDistance } from "@/lib/services/spatial";
import { LOAD_ESTIMATES_KG, AUTO_COLLECTIVE_CONFIG } from "@/app/dinas/config/auto-collective";
import type {
  EligibleReport,
  AutoCollectiveRoute,
  AutoCollectiveStop,
  AutoCollectivePreview,
  AvailableVehicle,
  AvailableOfficer,
} from "@/app/dinas/types/auto-collective";
import { LAPORAN_STATUS } from "@/lib/constants/laporan-status";

interface RawReport {
  id: string;
  lokasi_lat: number;
  lokasi_lng: number;
  kategori_ukuran: string;
  corrected_kategori_ukuran: string | null;
  priority_score: number | null;
  priority_level: string | null;
  estimated_load_unit: number | null;
  address_text: string | null;
  district: string | null;
  drainage_risk: boolean | null;
  access_obstruction_risk: boolean | null;
  waste_types: string[];
  createdAt: Date | string;
  needs_manual_review: boolean | null;
}

const ACCESS_PROFILES: Record<string, { narrowRoad: boolean; maxLoad: number }> = {
  'Motor Roda Tiga': { narrowRoad: true, maxLoad: 500 },
  'Pick Up': { narrowRoad: false, maxLoad: 1500 },
  'Dump Truck': { narrowRoad: false, maxLoad: 5000 },
  'Armroll Truck': { narrowRoad: false, maxLoad: 8000 },
};

export function computeEstimatedLoadKg(report: {
  kategori_ukuran: string;
  corrected_kategori_ukuran: string | null;
}): number {
  const effectiveSize = (report.corrected_kategori_ukuran ?? report.kategori_ukuran).toUpperCase();
  return LOAD_ESTIMATES_KG[effectiveSize] ?? LOAD_ESTIMATES_KG.UNCERTAIN;
}

export async function getEligibleReports(dinasId: string): Promise<EligibleReport[]> {
  const reports = await prisma.laporan.findMany({
    where: {
      dinas_id: dinasId,
      status: { in: [LAPORAN_STATUS.ANALYZED, LAPORAN_STATUS.WAITING] },
      petugas_id: null,
      kendaraan_id: null,
      needs_manual_review: false,
    },
    orderBy: [
      { priority_score: { sort: "desc", nulls: "last" } },
      { createdAt: "asc" },
    ],
  });

  return reports.map((r) => {
    const reportAny = r as unknown as RawReport;
    return {
      id: reportAny.id,
      lokasi_lat: reportAny.lokasi_lat,
      lokasi_lng: reportAny.lokasi_lng,
      kategori_ukuran: reportAny.kategori_ukuran,
      corrected_kategori_ukuran: reportAny.corrected_kategori_ukuran ?? null,
      priority_score: reportAny.priority_score,
      priority_level: reportAny.priority_level,
      estimated_load_unit: reportAny.estimated_load_unit,
      address_text: reportAny.address_text,
      district: reportAny.district,
      drainage_risk: reportAny.drainage_risk,
      access_obstruction_risk: reportAny.access_obstruction_risk,
      waste_types: reportAny.waste_types,
      createdAt: new Date(reportAny.createdAt as string).toISOString(),
      needs_manual_review: reportAny.needs_manual_review,
      estimatedLoadKg: computeEstimatedLoadKg({
        kategori_ukuran: reportAny.kategori_ukuran,
        corrected_kategori_ukuran: reportAny.corrected_kategori_ukuran ?? null,
      }),
    };
  });
}

export async function getAvailableVehicles(dinasId: string): Promise<AvailableVehicle[]> {
  const vehicles = await prisma.kendaraan.findMany({
    where: { dinas_id: dinasId },
    select: {
      id: true,
      jenis: true,
      kapasitas: true,
      current_load: true,
    },
  });

  return vehicles.filter((v) => v.current_load < v.kapasitas);
}

export async function getAvailableOfficers(dinasId: string): Promise<AvailableOfficer[]> {
  const officers = await prisma.petugas.findMany({
    where: { dinas_id: dinasId },
    select: {
      id: true,
      nama: true,
    },
  });

  const taskCounts = await Promise.all(
    officers.map((o) =>
      prisma.laporan.count({
        where: {
          petugas_id: o.id,
          status: { in: [LAPORAN_STATUS.PENDING, LAPORAN_STATUS.DIJEMPUT] },
        },
      }),
    ),
  );

  return officers.map((o, i) => ({
    id: o.id,
    nama: o.nama,
    activeTaskCount: taskCounts[i],
  }));
}

export function selectBestOfficer(
  officers: AvailableOfficer[],
): AvailableOfficer | null {
  if (officers.length === 0) return null;

  const sorted = [...officers].sort((a, b) => {
    if (a.activeTaskCount !== b.activeTaskCount) {
      return a.activeTaskCount - b.activeTaskCount;
    }
    return a.nama.localeCompare(b.nama);
  });

  return sorted[0];
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return haversineDistance(lat1, lng1, lat2, lng2) / 1000;
}

async function computeOSRMDurations(
  origin: { lat: number; lng: number },
  destinations: Array<{ lat: number; lng: number }>,
): Promise<number[]> {
  try {
    const coords = [
      [origin.lng, origin.lat],
      ...destinations.map((d) => [d.lng, d.lat]),
    ];
    const coordStr = coords.map((c) => c.join(",")).join(";");
    const res = await fetch(
      `https://router.project-osrm.org/table/v1/driving/${coordStr}?sources=0&annotations=duration`,
      { signal: AbortSignal.timeout(AUTO_COLLECTIVE_CONFIG.osrmTimeoutMs) },
    );

    if (!res.ok) throw new Error("OSRM returned non-OK");
    const data = await res.json();
    if (data.code !== "Ok" || !data.durations?.[0]) throw new Error("OSRM invalid");

    return data.durations[0].slice(1) as number[];
  } catch {
    return destinations.map((d) => haversineDistance(origin.lat, origin.lng, d.lat, d.lng) / 8.3);
  }
}

async function computeRouteDetails(
  stops: AutoCollectiveStop[],
): Promise<Pick<AutoCollectiveRoute, "routeGeometry" | "estimatedDistanceKm" | "estimatedDurationMinutes" | "routingSource">> {
  const fallbackGeometry = stops.map((stop) => [stop.lng, stop.lat] as [number, number]);
  let fallbackDistanceKm = 0;

  for (let index = 1; index < stops.length; index++) {
    fallbackDistanceKm += haversineKm(
      stops[index - 1].lat,
      stops[index - 1].lng,
      stops[index].lat,
      stops[index].lng,
    );
  }

  if (stops.length < 2) {
    return {
      routeGeometry: fallbackGeometry,
      estimatedDistanceKm: 0,
      estimatedDurationMinutes: 0,
      routingSource: "HAVERSINE",
    };
  }

  try {
    const coordinates = stops.map((stop) => `${stop.lng},${stop.lat}`).join(";");
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`,
      { signal: AbortSignal.timeout(AUTO_COLLECTIVE_CONFIG.osrmTimeoutMs) },
    );
    if (!response.ok) throw new Error("OSRM returned non-OK");

    const data = await response.json() as {
      code?: string;
      routes?: Array<{
        distance: number;
        duration: number;
        geometry: { coordinates: [number, number][] };
      }>;
    };
    const osrmRoute = data.routes?.[0];
    if (data.code !== "Ok" || !osrmRoute?.geometry.coordinates.length) {
      throw new Error("OSRM returned an invalid route");
    }

    return {
      routeGeometry: osrmRoute.geometry.coordinates,
      estimatedDistanceKm: Math.round((osrmRoute.distance / 1000) * 10) / 10,
      estimatedDurationMinutes: Math.max(1, Math.round(osrmRoute.duration / 60)),
      routingSource: "OSRM",
    };
  } catch {
    return {
      routeGeometry: fallbackGeometry,
      estimatedDistanceKm: Math.round(fallbackDistanceKm * 10) / 10,
      estimatedDurationMinutes: Math.round((fallbackDistanceKm / 30) * 60),
      routingSource: "HAVERSINE",
    };
  }
}

function isNarrowRoadCompatible(jenis: string): boolean {
  const profile = ACCESS_PROFILES[jenis];
  return profile?.narrowRoad ?? false;
}

function estimateRouteDistanceHaversine(stops: AutoCollectiveStop[]): number {
  let total = 0;
  for (let i = 1; i < stops.length; i++) {
    total += haversineKm(stops[i - 1].lat, stops[i - 1].lng, stops[i].lat, stops[i].lng);
  }
  return total;
}

function nearestNeighborOrder(
  stops: AutoCollectiveStop[],
  distanceMatrix: Map<string, Map<string, number>> | null,
): AutoCollectiveStop[] {
  if (stops.length <= 1) return stops;

  if (stops.length === 2) {
    const pa = stops[0].priorityScore ?? 0;
    const pb = stops[1].priorityScore ?? 0;
    if (pb > pa) return [stops[1], stops[0]];
    if (pa > pb) return [stops[0], stops[1]];
    return stops[0].reportId.localeCompare(stops[1].reportId) <= 0
      ? [stops[0], stops[1]]
      : [stops[1], stops[0]];
  }

  const unvisited = new Set(stops.map((s) => s.reportId));
  const reportMap = new Map(stops.map((s) => [s.reportId, s]));

  const sortedByPriority = [...stops].sort((a, b) => {
    const pa = a.priorityScore ?? 0;
    const pb = b.priorityScore ?? 0;
    if (pb !== pa) return pb - pa;
    return a.reportId.localeCompare(b.reportId);
  });

  const result: AutoCollectiveStop[] = [sortedByPriority[0]];
  unvisited.delete(result[0].reportId);

  while (unvisited.size > 0) {
    const current = result[result.length - 1];
    let nearestId: string | null = null;
    let nearestDist = Infinity;

    for (const candidateId of unvisited) {
      const d = distanceMatrix
        ? (distanceMatrix.get(current.reportId)?.get(candidateId) ?? Infinity)
        : haversineKm(current.lat, current.lng, reportMap.get(candidateId)!.lat, reportMap.get(candidateId)!.lng);

      if (d < nearestDist) {
        nearestDist = d;
        nearestId = candidateId;
      }
    }

    if (nearestId) {
      result.push(reportMap.get(nearestId)!);
      unvisited.delete(nearestId);
    }
  }

  return result;
}

function isVehicleCompatible(
  vehicle: AvailableVehicle,
  report: EligibleReport,
): boolean {
  if (report.access_obstruction_risk && !isNarrowRoadCompatible(vehicle.jenis)) {
    return false;
  }
  return true;
}

function scoreVehicleForReport(
  vehicle: AvailableVehicle,
  report: EligibleReport,
  routeTotalLoad: number,
  nearestStopDistanceKm: number | null,
  nStops: number,
): number {
  const availableCapacity = vehicle.kapasitas - vehicle.current_load;
  const remainingAfterLoad = availableCapacity - routeTotalLoad - report.estimatedLoadKg;

  if (remainingAfterLoad < 0) return -Infinity;

  if (nStops >= AUTO_COLLECTIVE_CONFIG.maxStopsPerRoute) return -Infinity;

  if (report.access_obstruction_risk && !isNarrowRoadCompatible(vehicle.jenis)) {
    return -Infinity;
  }

  const utilization = 1 - (remainingAfterLoad / vehicle.kapasitas);
  const utilizationScore = utilization * 0.35;

  const wasteScore = (1 - utilization) * 0.15;

  const distanceScore = nearestStopDistanceKm != null
    ? (1 - Math.min(nearestStopDistanceKm, AUTO_COLLECTIVE_CONFIG.maxRouteDistanceKm) / AUTO_COLLECTIVE_CONFIG.maxRouteDistanceKm) * 0.25
    : 0;

  const continuityScore = routeTotalLoad > 0 ? 0.15 : 0;

  return utilizationScore + wasteScore + distanceScore + continuityScore;
}

// ─── Neighbor Finding ───────────────────────────────────────────────

export async function findNeighborReports(
  sourceReportId: string,
  dinasId: string,
  maxRadiusKm?: number,
  maxDriveMinutes?: number,
): Promise<{ neighborIds: string[] }> {
  const radius = maxRadiusKm ?? AUTO_COLLECTIVE_CONFIG.neighborHaversineRadiusKm;
  const maxDrive = maxDriveMinutes ?? AUTO_COLLECTIVE_CONFIG.neighborMaxDriveDurationMinutes;

  const allEligible = await getEligibleReports(dinasId);

  const source = allEligible.find((r) => r.id === sourceReportId);
  if (!source) return { neighborIds: [sourceReportId] };

  const haversineCandidates = allEligible.filter((r) => {
    if (r.id === sourceReportId) return false;
    const dist = haversineKm(source.lokasi_lat, source.lokasi_lng, r.lokasi_lat, r.lokasi_lng);
    return dist <= radius;
  });

  if (haversineCandidates.length === 0) {
    return { neighborIds: [sourceReportId] };
  }

  const durations = await computeOSRMDurations(
    { lat: source.lokasi_lat, lng: source.lokasi_lng },
    haversineCandidates.map((c) => ({ lat: c.lokasi_lat, lng: c.lokasi_lng })),
  );

  const neighborIds: string[] = [sourceReportId];
  for (let i = 0; i < haversineCandidates.length; i++) {
    if (durations[i] / 60 <= maxDrive) {
      neighborIds.push(haversineCandidates[i].id);
    }
  }

  return { neighborIds };
}

// ─── Minimum Vehicle Bin Packing ────────────────────────────────────

function tryAssignReports(
  reports: EligibleReport[],
  vehicles: AvailableVehicle[],
): { assignment: Map<number, EligibleReport[]>; unassigned: EligibleReport[]; success: boolean } {
  const sortedByPriority = [...reports].sort((a, b) => {
    const pa = a.priority_score ?? 0;
    const pb = b.priority_score ?? 0;
    if (pb !== pa) return pb - pa;
    return a.createdAt.localeCompare(b.createdAt);
  });

  const assignment = new Map<number, EligibleReport[]>();
  const routeLoads = new Map<number, number>();
  const routeStops = new Map<number, number>();

  for (let i = 0; i < vehicles.length; i++) {
    assignment.set(i, []);
    routeLoads.set(i, 0);
    routeStops.set(i, 0);
  }

  const unassigned: EligibleReport[] = [];

  for (const report of sortedByPriority) {
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (let idx = 0; idx < vehicles.length; idx++) {
      const vehicle = vehicles[idx];
      const currentLoad = routeLoads.get(idx) ?? 0;
      const currentStops = routeStops.get(idx) ?? 0;

      if (!isVehicleCompatible(vehicle, report)) continue;

      const remainingCapacity = vehicle.kapasitas - vehicle.current_load - currentLoad;
      if (report.estimatedLoadKg > remainingCapacity) continue;

      if (currentStops >= AUTO_COLLECTIVE_CONFIG.maxStopsPerRoute) continue;

      const assignedStops = assignment.get(idx) ?? [];
      let nearestDist: number | null = null;
      if (assignedStops.length > 0) {
        let minDist = Infinity;
        for (const s of assignedStops) {
          const d = haversineKm(s.lokasi_lat, s.lokasi_lng, report.lokasi_lat, report.lokasi_lng);
          if (d < minDist) minDist = d;
        }
        nearestDist = minDist;
      }

      const score = scoreVehicleForReport(vehicle, report, currentLoad, nearestDist, currentStops);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    }

    if (bestIdx >= 0) {
      assignment.get(bestIdx)!.push(report);
      routeLoads.set(bestIdx, (routeLoads.get(bestIdx) ?? 0) + report.estimatedLoadKg);
      routeStops.set(bestIdx, (routeStops.get(bestIdx) ?? 0) + 1);
    } else {
      unassigned.push(report);
    }
  }

  const assignedCount = [...assignment.values()].reduce((s, a) => s + a.length, 0);
  const success = assignedCount === reports.length;

  return { assignment, unassigned, success };
}

function createStopFromReport(report: EligibleReport): AutoCollectiveStop {
  return {
    reportId: report.id,
    lat: report.lokasi_lat,
    lng: report.lokasi_lng,
    address: report.address_text,
    priorityLevel: report.priority_level,
    priorityScore: report.priority_score,
    estimatedLoadKg: report.estimatedLoadKg,
    sizeCategory: report.kategori_ukuran,
    drainageRisk: report.drainage_risk,
    accessObstructionRisk: report.access_obstruction_risk,
    wasteTypes: report.waste_types,
  };
}

function buildRouteFromAssignment(
  vehicle: AvailableVehicle,
  reports: EligibleReport[],
  officer: AvailableOfficer | null,
  routeCounter: number,
  distanceMatrix: Map<string, Map<string, number>> | null,
): AutoCollectiveRoute {
  const stops = reports.map((r) => createStopFromReport(r));
  const orderedStops = nearestNeighborOrder(stops, distanceMatrix);

  const totalLoad = orderedStops.reduce((s, st) => s + st.estimatedLoadKg, 0);
  const availableCapacity = vehicle.kapasitas - vehicle.current_load;

  const haversineDist = estimateRouteDistanceHaversine(orderedStops);

  return {
    temporaryRouteId: `preview-${routeCounter}`,
    petugasId: officer?.id ?? null,
    petugasNama: officer?.nama ?? null,
    kendaraanId: vehicle.id,
    kendaraanJenis: vehicle.jenis,
    kendaraanPlat: null,
    vehicleCapacity: vehicle.kapasitas,
    availableCapacity,
    totalEstimatedLoad: totalLoad,
    remainingCapacity: availableCapacity - totalLoad,
    estimatedDistanceKm: Math.round(haversineDist * 10) / 10,
    estimatedDurationMinutes: Math.round((haversineDist / 30) * 60),
    routingSource: "HAVERSINE",
    routeGeometry: orderedStops.map((st) => [st.lng, st.lat] as [number, number]),
    stops: orderedStops,
  };
}

// ─── Route Optimization ─────────────────────────────────────────────

function routeTotalHaversineDistance(stops: AutoCollectiveStop[]): number {
  let d = 0;
  for (let i = 1; i < stops.length; i++) {
    d += haversineKm(stops[i - 1].lat, stops[i - 1].lng, stops[i].lat, stops[i].lng);
  }
  return d;
}

function optimizeTwoOpt(route: AutoCollectiveRoute): boolean {
  if (route.stops.length <= 2) return false;
  let improved = false;

  for (let i = 1; i < route.stops.length - 1; i++) {
    for (let j = i + 1; j < route.stops.length; j++) {
      const beforeDist = routeTotalHaversineDistance(route.stops);
      const newStops = [...route.stops];
      newStops.splice(i, j - i + 1, ...route.stops.slice(i, j + 1).reverse());
      const afterDist = routeTotalHaversineDistance(newStops);

      if (afterDist < beforeDist) {
        route.stops = newStops;
        route.estimatedDistanceKm = Math.round(afterDist * 10) / 10;
        route.estimatedDurationMinutes = Math.round((afterDist / 30) * 60);
        improved = true;
      }
    }
  }

  return improved;
}

function tryRelocateStop(
  fromRoute: AutoCollectiveRoute,
  toRoute: AutoCollectiveRoute,
  stopIdx: number,
): boolean {
  const stop = fromRoute.stops[stopIdx];
  if (!stop) return false;

  const toRemainingCap = toRoute.remainingCapacity;
  if (stop.estimatedLoadKg > toRemainingCap) return false;
  if (toRoute.stops.length >= AUTO_COLLECTIVE_CONFIG.maxStopsPerRoute) return false;

  const fromBefore = routeTotalHaversineDistance(fromRoute.stops);
  const toBefore = routeTotalHaversineDistance(toRoute.stops);

  const newFromStops = fromRoute.stops.filter((_, i) => i !== stopIdx);

  let bestPos = -1;
  let bestCombined = Infinity;
  for (let pos = 0; pos <= toRoute.stops.length; pos++) {
    const testStops = [...toRoute.stops];
    testStops.splice(pos, 0, stop);
    const d = routeTotalHaversineDistance(testStops);
    if (d < bestCombined) {
      bestCombined = d;
      bestPos = pos;
    }
  }

  const afterToDist = bestCombined;
  const afterFromDist = routeTotalHaversineDistance(newFromStops);
  const totalBefore = fromBefore + toBefore;
  const totalAfter = afterFromDist + afterToDist;

  if (totalAfter >= totalBefore) return false;

  const checkCapacityFrom = fromRoute.totalEstimatedLoad - stop.estimatedLoadKg;
  const checkCapacityTo = toRoute.totalEstimatedLoad + stop.estimatedLoadKg;

  const fromVehicleIdx = -1;
  const toVehicleIdx = -1;

  if (checkCapacityTo > toRoute.vehicleCapacity - (toRoute.vehicleCapacity - toRoute.availableCapacity)) {
    const toUsed = toRoute.vehicleCapacity - toRoute.remainingCapacity;
    if (checkCapacityTo > toRoute.vehicleCapacity - (toRoute.vehicleCapacity - toRoute.availableCapacity)) {
      return false;
    }
  }

  fromRoute.stops = newFromStops;
  fromRoute.totalEstimatedLoad = checkCapacityFrom;
  fromRoute.remainingCapacity = fromRoute.availableCapacity - checkCapacityFrom;
  fromRoute.estimatedDistanceKm = Math.round(afterFromDist * 10) / 10;
  fromRoute.estimatedDurationMinutes = Math.round((afterFromDist / 30) * 60);
  fromRoute.routeGeometry = fromRoute.stops.map((st) => [st.lng, st.lat] as [number, number]);

  toRoute.stops.splice(bestPos, 0, stop);
  toRoute.totalEstimatedLoad = checkCapacityTo;
  toRoute.remainingCapacity = toRoute.availableCapacity - checkCapacityTo;
  toRoute.estimatedDistanceKm = Math.round(afterToDist * 10) / 10;
  toRoute.estimatedDurationMinutes = Math.round((afterToDist / 30) * 60);
  toRoute.routeGeometry = toRoute.stops.map((st) => [st.lng, st.lat] as [number, number]);

  return true;
}

function trySwapStops(
  routeA: AutoCollectiveRoute,
  routeB: AutoCollectiveRoute,
  idxA: number,
  idxB: number,
): boolean {
  const stopA = routeA.stops[idxA];
  const stopB = routeB.stops[idxB];
  if (!stopA || !stopB) return false;

  const newLoadA = routeA.totalEstimatedLoad - stopA.estimatedLoadKg + stopB.estimatedLoadKg;
  const newLoadB = routeB.totalEstimatedLoad - stopB.estimatedLoadKg + stopA.estimatedLoadKg;

  const availA = routeA.availableCapacity;
  const availB = routeB.availableCapacity;

  if (newLoadA > availA || newLoadB > availB) return false;

  const beforeA = routeTotalHaversineDistance(routeA.stops);
  const beforeB = routeTotalHaversineDistance(routeB.stops);
  const totalBefore = beforeA + beforeB;

  const newStopsA = routeA.stops.map((s, i) => (i === idxA ? stopB : s));
  const newStopsB = routeB.stops.map((s, i) => (i === idxB ? stopA : s));

  const afterA = routeTotalHaversineDistance(newStopsA);
  const afterB = routeTotalHaversineDistance(newStopsB);
  const totalAfter = afterA + afterB;

  if (totalAfter >= totalBefore) return false;

  routeA.stops = newStopsA;
  routeA.totalEstimatedLoad = newLoadA;
  routeA.remainingCapacity = availA - newLoadA;
  routeA.estimatedDistanceKm = Math.round(afterA * 10) / 10;
  routeA.estimatedDurationMinutes = Math.round((afterA / 30) * 60);
  routeA.routeGeometry = newStopsA.map((st) => [st.lng, st.lat] as [number, number]);

  routeB.stops = newStopsB;
  routeB.totalEstimatedLoad = newLoadB;
  routeB.remainingCapacity = availB - newLoadB;
  routeB.estimatedDistanceKm = Math.round(afterB * 10) / 10;
  routeB.estimatedDurationMinutes = Math.round((afterB / 30) * 60);
  routeB.routeGeometry = newStopsB.map((st) => [st.lng, st.lat] as [number, number]);

  return true;
}

function tryMergeRoutes(
  routeA: AutoCollectiveRoute,
  routeB: AutoCollectiveRoute,
  vehicles: AvailableVehicle[],
  officers: AvailableOfficer[],
): AutoCollectiveRoute | null {
  const combinedLoad = routeA.totalEstimatedLoad + routeB.totalEstimatedLoad;
  const combinedStops = routeA.stops.length + routeB.stops.length;

  if (combinedStops > AUTO_COLLECTIVE_CONFIG.maxStopsPerRoute) return null;

  const vehicleA = vehicles.find((v) => v.id === routeA.kendaraanId);
  const vehicleB = vehicles.find((v) => v.id === routeB.kendaraanId);

  if (!vehicleA || !vehicleB) return null;

  let bestVehicle: AvailableVehicle | null = null;
  let bestVehicleId: string | null = null;
  let bestJenis: string | null = null;
  let bestCapacity = 0;

  for (const v of [vehicleA, vehicleB]) {
    const avail = v.kapasitas - v.current_load;
    if (combinedLoad <= avail) {
      if (v.kapasitas > bestCapacity) {
        bestCapacity = v.kapasitas;
        bestVehicle = v;
        bestVehicleId = v.id;
        bestJenis = v.jenis;
      }
    }
  }

  if (!bestVehicle) return null;

  const mergedStops = [...routeA.stops, ...routeB.stops];
  const ordered = nearestNeighborOrder(mergedStops, null);

  const mergedDistance = routeTotalHaversineDistance(ordered);

  if (mergedDistance > AUTO_COLLECTIVE_CONFIG.maxRouteDistanceKm) return null;

  let mergedOfficer = routeA.petugasId ? { id: routeA.petugasId, nama: routeA.petugasNama ?? null } : null;
  if (!mergedOfficer && routeB.petugasId) {
    mergedOfficer = { id: routeB.petugasId, nama: routeB.petugasNama ?? null };
  }

  const mergedDuration = Math.round((mergedDistance / 30) * 60);
  if (mergedDuration > AUTO_COLLECTIVE_CONFIG.maxEstimatedDurationMinutes) return null;

  return {
    temporaryRouteId: `${routeA.temporaryRouteId}-merged`,
    petugasId: mergedOfficer?.id ?? null,
    petugasNama: mergedOfficer?.nama ?? null,
    kendaraanId: bestVehicleId,
    kendaraanJenis: bestJenis,
    kendaraanPlat: null,
    vehicleCapacity: bestCapacity,
    availableCapacity: bestCapacity,
    totalEstimatedLoad: combinedLoad,
    remainingCapacity: bestCapacity - combinedLoad,
    estimatedDistanceKm: Math.round(mergedDistance * 10) / 10,
    estimatedDurationMinutes: mergedDuration,
    routingSource: "HAVERSINE",
    routeGeometry: ordered.map((st) => [st.lng, st.lat] as [number, number]),
    stops: ordered,
  };
}

function optimizeRoutes(
  routes: AutoCollectiveRoute[],
  vehicles: AvailableVehicle[],
  officers: AvailableOfficer[],
): AutoCollectiveRoute[] {
  let improved = true;
  let iterations = 0;

  while (improved && iterations < AUTO_COLLECTIVE_CONFIG.maxOptimizationIterations) {
    improved = false;
    iterations++;

    for (const route of routes) {
      if (AUTO_COLLECTIVE_CONFIG.enableTwoOpt) {
        if (optimizeTwoOpt(route)) improved = true;
      }
    }

    if (AUTO_COLLECTIVE_CONFIG.enableCrossRouteOptimization) {
      for (let i = 0; i < routes.length; i++) {
        for (let j = i + 1; j < routes.length; j++) {
          for (let si = 0; si < routes[i].stops.length; si++) {
            if (tryRelocateStop(routes[i], routes[j], si)) {
              improved = true;
              break;
            }
          }
          if (improved) break;

          for (let si = 0; si < routes[i].stops.length && !improved; si++) {
            for (let sj = 0; sj < routes[j].stops.length; sj++) {
              if (trySwapStops(routes[i], routes[j], si, sj)) {
                improved = true;
                break;
              }
            }
          }
        }
        if (improved) break;
      }
    }

    if (AUTO_COLLECTIVE_CONFIG.enableRouteMerging && routes.length > 1) {
      for (let i = 0; i < routes.length; i++) {
        for (let j = i + 1; j < routes.length; j++) {
          const merged = tryMergeRoutes(routes[i], routes[j], vehicles, officers);
          if (merged) {
            routes[i] = merged;
            routes.splice(j, 1);
            improved = true;
            break;
          }
        }
        if (improved) break;
      }
    }
  }

  return routes;
}

// ─── Main Entry Point ───────────────────────────────────────────────

export async function buildMinimumVehicleRoutes(
  eligibleReports: EligibleReport[],
  vehicles: AvailableVehicle[],
  officers: AvailableOfficer[],
): Promise<AutoCollectivePreview> {
  if (eligibleReports.length === 0) {
    return { routes: [], unassignedReports: [] };
  }

  const deduped = new Map<string, EligibleReport>();
  for (const r of eligibleReports) {
    if (!deduped.has(r.id)) {
      deduped.set(r.id, r);
    }
  }
  const uniqueReports = [...deduped.values()];

  let result: { routes: AutoCollectiveRoute[]; unassigned: EligibleReport[] } | null = null;

  for (let nVehicles = 1; nVehicles <= vehicles.length; nVehicles++) {
    const selectedVehicles = vehicles.slice(0, nVehicles);
    const { assignment, unassigned } = tryAssignReports(uniqueReports, selectedVehicles);

    if (unassigned.length === 0) {
      let routeCounter = 0;
      const routes: AutoCollectiveRoute[] = [];

      for (let idx = 0; idx < selectedVehicles.length; idx++) {
        const assignedReports = assignment.get(idx) ?? [];
        if (assignedReports.length === 0) continue;

        routeCounter++;
        const officer = officers.length > 0
          ? selectBestOfficer(officers.filter((o) => !routes.some((r) => r.petugasId === o.id)))
          : null;

        const route = buildRouteFromAssignment(selectedVehicles[idx], assignedReports, officer, routeCounter, null);

        if (route.stops.length > 1) {
          const haversineDist = routeTotalHaversineDistance(route.stops);
          if (haversineDist > AUTO_COLLECTIVE_CONFIG.maxRouteDistanceKm) {
            result = { routes: [], unassigned: uniqueReports };
            break;
          }
          const duration = Math.round((haversineDist / 30) * 60);
          if (duration > AUTO_COLLECTIVE_CONFIG.maxEstimatedDurationMinutes) {
            result = { routes: [], unassigned: uniqueReports };
            break;
          }
        }

        routes.push(route);
      }

      if (result === null) {
        result = { routes, unassigned };
        break;
      }
    } else {
      const assignedCount = uniqueReports.length - unassigned.length;
      if (assignedCount > 0) {
        let routeCounter = 0;
        const routes: AutoCollectiveRoute[] = [];

        for (let idx = 0; idx < selectedVehicles.length; idx++) {
          const assignedReports = assignment.get(idx) ?? [];
          if (assignedReports.length === 0) continue;

          routeCounter++;
          const officer = officers.length > 0
            ? selectBestOfficer(officers.filter((o) => !routes.some((r) => r.petugasId === o.id)))
            : null;

          routes.push(buildRouteFromAssignment(selectedVehicles[idx], assignedReports, officer, routeCounter, null));
        }

        result = { routes, unassigned };
      }
    }
  }

  if (!result) {
    result = { routes: [], unassigned: uniqueReports };
  }

  let optimizedRoutes = result.routes;
  if (optimizedRoutes.length > 0) {
    optimizedRoutes = optimizeRoutes(result.routes, vehicles, officers);
  }

  if (optimizedRoutes.length > 0) {
    const allAssignedIds = new Set<string>();
    for (const route of optimizedRoutes) {
      for (const stop of route.stops) {
        if (allAssignedIds.has(stop.reportId)) {
          console.error(`Duplicate reportId ${stop.reportId} detected after optimization`);
        }
        allAssignedIds.add(stop.reportId);
      }
    }

    if (result.unassigned.length > 0) {
      result.unassigned = result.unassigned.filter((r) => !allAssignedIds.has(r.id));
    }
  }

  await Promise.all(
    optimizedRoutes.map(async (route) => {
      Object.assign(route, await computeRouteDetails(route.stops));
    }),
  );

  const unassignedReports: EligibleReport[] = result.unassigned;

  return {
    routes: optimizedRoutes,
    unassignedReports,
  };
}

export { computeRouteDetails, isVehicleCompatible };

export function __testing__() {
  return {
    isVehicleCompatible,
    scoreVehicleForReport,
    nearestNeighborOrder,
    routeTotalHaversineDistance,
    tryAssignReports,
    optimizeTwoOpt,
    tryRelocateStop,
    trySwapStops,
    tryMergeRoutes,
    createStopFromReport,
    buildRouteFromAssignment,
    ACCESS_PROFILES,
  };
}
