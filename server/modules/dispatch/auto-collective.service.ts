import { prisma } from "@/lib/prisma";
import { haversineDistance } from "@/lib/services/spatial";
import { LOAD_ESTIMATES_KG, AUTO_COLLECTIVE_CONFIG } from "@/app/dinas/config/auto-collective";
import type {
  EligibleReport,
  AutoCollectiveRoute,
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

export function computeEstimatedLoadKg(report: {
  kategori_ukuran: string;
  corrected_kategori_ukuran: string | null;
}): number {
  const effectiveSize = (report.corrected_kategori_ukuran ?? report.kategori_ukuran).toUpperCase();
  return LOAD_ESTIMATES_KG[effectiveSize] ?? LOAD_ESTIMATES_KG.UNCERTAIN;
}

export function computeRouteScore(
  duration: number,
  priorityScore: number | null,
  maxDuration: number,
  maxPriority: number,
): number {
  const normDuration = maxDuration > 0 ? duration / maxDuration : 0;
  const normPriority = maxPriority > 0 ? ((priorityScore ?? 0) / maxPriority) : 0;
  return (
    AUTO_COLLECTIVE_CONFIG.distanceWeight * normDuration -
    AUTO_COLLECTIVE_CONFIG.priorityWeight * normPriority
  );
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

export function selectBestVehicle(
  vehicles: AvailableVehicle[],
  requiredLoad: number,
): AvailableVehicle | null {
  const eligible = vehicles.filter(
    (v) => v.kapasitas - v.current_load >= requiredLoad,
  );

  if (eligible.length === 0) return null;

  eligible.sort((a, b) => {
    const wasteA = a.kapasitas - a.current_load - requiredLoad;
    const wasteB = b.kapasitas - b.current_load - requiredLoad;
    return wasteA - wasteB;
  });

  return eligible[0];
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
  stops: AutoCollectiveRoute["stops"],
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

export async function buildCollectiveRoutes(
  eligibleReports: EligibleReport[],
  vehicles: AvailableVehicle[],
  officers: AvailableOfficer[],
): Promise<AutoCollectivePreview> {
  const remaining = [...eligibleReports];
  const routes: AutoCollectiveRoute[] = [];
  const unassignedReports: EligibleReport[] = [];
  const usedVehicleIds = new Set<string>();
  const usedOfficerIds = new Set<string>();
  let routeCounter = 0;

  while (remaining.length > 0) {
    if (vehicles.length === 0 || officers.length === 0) break;

    const seed = remaining[0];
    const requiredLoad = seed.estimatedLoadKg;

    const unusedVehicles = vehicles.filter((v) => !usedVehicleIds.has(v.id));
    const bestVehicle = selectBestVehicle(unusedVehicles, requiredLoad);
    if (!bestVehicle) {
      // A high-priority oversized report must not prevent smaller reports from
      // being considered for the remaining fleet.
      unassignedReports.push(seed);
      remaining.splice(0, 1);
      continue;
    }

    const unusedOfficers = officers.filter((o) => !usedOfficerIds.has(o.id));
    if (unusedOfficers.length === 0) break;
    const bestOfficer = selectBestOfficer(unusedOfficers);
    if (!bestOfficer) break;

    routeCounter++;
    const route: AutoCollectiveRoute = {
      temporaryRouteId: `preview-${routeCounter}`,
      petugasId: bestOfficer.id,
      petugasNama: bestOfficer.nama,
      kendaraanId: bestVehicle.id,
      kendaraanJenis: bestVehicle.jenis,
      kendaraanPlat: null,
      vehicleCapacity: bestVehicle.kapasitas,
      availableCapacity: bestVehicle.kapasitas - bestVehicle.current_load,
      totalEstimatedLoad: requiredLoad,
      remainingCapacity: bestVehicle.kapasitas - bestVehicle.current_load - requiredLoad,
      estimatedDistanceKm: null,
      estimatedDurationMinutes: null,
      routingSource: "HAVERSINE",
      routeGeometry: [[seed.lokasi_lng, seed.lokasi_lat]],
      stops: [{
        reportId: seed.id,
        lat: seed.lokasi_lat,
        lng: seed.lokasi_lng,
        address: seed.address_text,
        priorityLevel: seed.priority_level,
        priorityScore: seed.priority_score,
        estimatedLoadKg: seed.estimatedLoadKg,
        sizeCategory: seed.kategori_ukuran,
        drainageRisk: seed.drainage_risk,
        accessObstructionRisk: seed.access_obstruction_risk,
        wasteTypes: seed.waste_types,
      }],
    };

    usedVehicleIds.add(bestVehicle.id);
    usedOfficerIds.add(bestOfficer.id);

    remaining.splice(0, 1);

    let currentOrigin = { lat: seed.lokasi_lat, lng: seed.lokasi_lng };
    let remainingCapacity = route.remainingCapacity;
    let maxPriority = Math.max(1, seed.priority_score ?? 0);

    for (const stop of route.stops) {
      maxPriority = Math.max(maxPriority, stop.priorityScore ?? 0);
    }

    while (
      route.stops.length < AUTO_COLLECTIVE_CONFIG.maxStopsPerRoute &&
      remainingCapacity > 0 &&
      remaining.length > 0
    ) {
      const candidates = remaining.filter((r) => r.estimatedLoadKg <= remainingCapacity);
      if (candidates.length === 0) break;

      const durations = await computeOSRMDurations(
        currentOrigin,
        candidates.map((c) => ({ lat: c.lokasi_lat, lng: c.lokasi_lng })),
      );

      const feasibleCandidates: Array<{ candidate: typeof candidates[0]; duration: number; index: number }> = [];
      for (let i = 0; i < candidates.length; i++) {
        const projectedDistance = (route.estimatedDistanceKm ?? 0) +
          haversineKm(currentOrigin.lat, currentOrigin.lng, candidates[i].lokasi_lat, candidates[i].lokasi_lng);
        const projectedDuration = (route.estimatedDurationMinutes ?? 0) + durations[i] / 60;

        if (projectedDistance <= AUTO_COLLECTIVE_CONFIG.maxRouteDistanceKm &&
            projectedDuration <= AUTO_COLLECTIVE_CONFIG.maxEstimatedDurationMinutes) {
          feasibleCandidates.push({ candidate: candidates[i], duration: durations[i], index: i });
        }
      }

      if (feasibleCandidates.length === 0) break;

      const maxDuration = Math.max(...feasibleCandidates.map((f) => f.duration), 1);
      let bestIndex = 0;
      let bestScore = Infinity;

      for (let i = 0; i < feasibleCandidates.length; i++) {
        const score = computeRouteScore(
          feasibleCandidates[i].duration,
          feasibleCandidates[i].candidate.priority_score,
          maxDuration,
          maxPriority,
        );

        if (score < bestScore) {
          bestScore = score;
          bestIndex = i;
        } else if (Math.abs(score - bestScore) < 0.001) {
          const curr = feasibleCandidates[i].candidate;
          const prev = feasibleCandidates[bestIndex].candidate;
          if (
            (curr.priority_score ?? 0) > (prev.priority_score ?? 0) ||
            (curr.priority_score === prev.priority_score && curr.createdAt < prev.createdAt) ||
            (curr.priority_score === prev.priority_score && curr.createdAt === prev.createdAt && curr.id < prev.id)
          ) {
            bestScore = score;
            bestIndex = i;
          }
        }
      }

      const selected = feasibleCandidates[bestIndex].candidate;
      const selectedDuration = feasibleCandidates[bestIndex].duration;

      const cumulativeDistance = (route.estimatedDistanceKm ?? 0) +
        haversineKm(currentOrigin.lat, currentOrigin.lng, selected.lokasi_lat, selected.lokasi_lng);
      const cumulativeDuration = (route.estimatedDurationMinutes ?? 0) + selectedDuration / 60;

      route.stops.push({
        reportId: selected.id,
        lat: selected.lokasi_lat,
        lng: selected.lokasi_lng,
        address: selected.address_text,
        priorityLevel: selected.priority_level,
        priorityScore: selected.priority_score,
        estimatedLoadKg: selected.estimatedLoadKg,
        sizeCategory: selected.kategori_ukuran,
        drainageRisk: selected.drainage_risk,
        accessObstructionRisk: selected.access_obstruction_risk,
        wasteTypes: selected.waste_types,
      });

      route.totalEstimatedLoad += selected.estimatedLoadKg;
      remainingCapacity -= selected.estimatedLoadKg;
      route.remainingCapacity = remainingCapacity;
      route.estimatedDistanceKm = Math.round(cumulativeDistance * 10) / 10;
      route.estimatedDurationMinutes = Math.round(cumulativeDuration);
      currentOrigin = { lat: selected.lokasi_lat, lng: selected.lokasi_lng };
      maxPriority = Math.max(maxPriority, selected.priority_score ?? 0);

      const origIdx = remaining.findIndex((r) => r.id === selected.id);
      if (origIdx !== -1) remaining.splice(origIdx, 1);
    }

    routes.push(route);
  }

  await Promise.all(
    routes.map(async (route) => {
      Object.assign(route, await computeRouteDetails(route.stops));
    }),
  );

  return {
    routes,
    unassignedReports: [...unassignedReports, ...remaining],
  };
}
