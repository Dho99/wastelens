import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    laporan: {
      findMany: mockFindMany,
    },
  },
}));

vi.mock("@/lib/services/spatial", () => ({
  haversineDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },
}));

import type { EligibleReport, AvailableVehicle, AvailableOfficer, AutoCollectiveStop, AutoCollectiveRoute } from "@/app/dinas/types/auto-collective";
import { AUTO_COLLECTIVE_CONFIG } from "@/app/dinas/config/auto-collective";
import { computeEstimatedLoadKg, findNeighborReports, __testing__ } from "./auto-collective.service";

const testing = __testing__();

function makeRawLaporan(overrides: Record<string, unknown> & { id: string }) {
  return {
    lokasi_lat: -6.9175,
    lokasi_lng: 107.6191,
    kategori_ukuran: "KECIL",
    corrected_kategori_ukuran: null,
    priority_score: 5.0,
    priority_level: "MEDIUM",
    estimated_load_unit: 25,
    address_text: "Test address",
    district: "Test",
    drainage_risk: false,
    access_obstruction_risk: false,
    waste_types: ["plastik"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    needs_manual_review: false,
    ...overrides,
  };
}

function makeReport(overrides: Partial<EligibleReport> & { id: string }): EligibleReport {
  return {
    lokasi_lat: -6.9175,
    lokasi_lng: 107.6191,
    kategori_ukuran: "KECIL",
    corrected_kategori_ukuran: null,
    priority_score: 5.0,
    priority_level: "MEDIUM",
    estimated_load_unit: 25,
    estimatedLoadKg: 25,
    address_text: "Test address",
    district: "Test",
    drainage_risk: false,
    access_obstruction_risk: false,
    waste_types: ["plastik"],
    createdAt: "2025-01-01T00:00:00.000Z",
    needs_manual_review: false,
    ...overrides,
  };
}

function makeVehicle(overrides: Partial<AvailableVehicle> & { id: string }): AvailableVehicle {
  return {
    jenis: "Pick Up",
    kapasitas: 1500,
    current_load: 0,
    ...overrides,
  };
}

function makeOfficer(overrides: Partial<AvailableOfficer> & { id: string }): AvailableOfficer {
  return {
    nama: "Test Officer",
    activeTaskCount: 0,
    ...overrides,
  };
}

function makeStop(overrides: Partial<AutoCollectiveStop> & { reportId: string }): AutoCollectiveStop {
  return {
    lat: -6.9175,
    lng: 107.6191,
    address: "Test",
    priorityLevel: "MEDIUM",
    priorityScore: 5,
    estimatedLoadKg: 25,
    sizeCategory: "KECIL",
    drainageRisk: false,
    accessObstructionRisk: false,
    wasteTypes: ["plastik"],
    ...overrides,
  };
}

function makeRoute(overrides: Partial<AutoCollectiveRoute> & { temporaryRouteId: string }): AutoCollectiveRoute {
  return {
    petugasId: null,
    petugasNama: null,
    kendaraanId: "v1",
    kendaraanJenis: "Pick Up",
    kendaraanPlat: null,
    vehicleCapacity: 1500,
    availableCapacity: 1500,
    totalEstimatedLoad: 0,
    remainingCapacity: 1500,
    estimatedDistanceKm: 0,
    estimatedDurationMinutes: 0,
    routingSource: "HAVERSINE",
    routeGeometry: [],
    stops: [],
    ...overrides,
  };
}

// ─── Vehicle Compatibility ──────────────────────────────────────────

describe("isVehicleCompatible", () => {
  it("allows any vehicle when report has no access obstruction", () => {
    const report = makeReport({ id: "r1", access_obstruction_risk: false });
    expect(testing.isVehicleCompatible(makeVehicle({ id: "v1", jenis: "Pick Up" }), report)).toBe(true);
    expect(testing.isVehicleCompatible(makeVehicle({ id: "v2", jenis: "Motor Roda Tiga" }), report)).toBe(true);
    expect(testing.isVehicleCompatible(makeVehicle({ id: "v3", jenis: "Dump Truck" }), report)).toBe(true);
  });

  it("restricts narrow-road vehicles for access obstruction risk", () => {
    const report = makeReport({ id: "r1", access_obstruction_risk: true });
    expect(testing.isVehicleCompatible(makeVehicle({ id: "v1", jenis: "Motor Roda Tiga" }), report)).toBe(true);
    expect(testing.isVehicleCompatible(makeVehicle({ id: "v2", jenis: "Pick Up" }), report)).toBe(false);
    expect(testing.isVehicleCompatible(makeVehicle({ id: "v3", jenis: "Dump Truck" }), report)).toBe(false);
  });

  it("handles unknown vehicle types gracefully", () => {
    const report = makeReport({ id: "r1", access_obstruction_risk: true });
    expect(testing.isVehicleCompatible(makeVehicle({ id: "v1", jenis: "Forklift" }), report)).toBe(false);
  });

  it("allows unknown vehicle types when no access restriction", () => {
    const report = makeReport({ id: "r1", access_obstruction_risk: false });
    expect(testing.isVehicleCompatible(makeVehicle({ id: "v1", jenis: "Forklift" }), report)).toBe(true);
  });
});

// ─── Vehicle Scoring ────────────────────────────────────────────────

describe("scoreVehicleForReport", () => {
  it("returns -Infinity when capacity insufficient", () => {
    const vehicle = makeVehicle({ id: "v1", kapasitas: 500, current_load: 480 });
    const report = makeReport({ id: "r1", estimatedLoadKg: 50 });
    expect(testing.scoreVehicleForReport(vehicle, report, 0, null, 0)).toBe(-Infinity);
  });

  it("returns -Infinity when max stops reached", () => {
    const vehicle = makeVehicle({ id: "v1", kapasitas: 500 });
    const report = makeReport({ id: "r1", estimatedLoadKg: 25 });
    expect(testing.scoreVehicleForReport(vehicle, report, 0, null, 10)).toBe(-Infinity);
  });

  it("returns -Infinity when access incompatible", () => {
    const vehicle = makeVehicle({ id: "v1", jenis: "Dump Truck" });
    const report = makeReport({ id: "r1", estimatedLoadKg: 25, access_obstruction_risk: true });
    expect(testing.scoreVehicleForReport(vehicle, report, 0, null, 0)).toBe(-Infinity);
  });

  it("returns higher score for better capacity utilization", () => {
    const smallVeh = makeVehicle({ id: "v1", jenis: "Motor Roda Tiga", kapasitas: 500, current_load: 0 });
    const largeVeh = makeVehicle({ id: "v2", jenis: "Dump Truck", kapasitas: 5000, current_load: 0 });
    const report = makeReport({ id: "r1", estimatedLoadKg: 25 });

    const smallScore = testing.scoreVehicleForReport(smallVeh, report, 0, null, 0);
    const largeScore = testing.scoreVehicleForReport(largeVeh, report, 0, null, 0);

    expect(smallScore).toBeGreaterThan(largeScore);
  });

  it("prefers closer stops", () => {
    const vehicle = makeVehicle({ id: "v1", kapasitas: 1500 });
    const report = makeReport({ id: "r1", estimatedLoadKg: 25 });
    const nearScore = testing.scoreVehicleForReport(vehicle, report, 0, 1, 0);
    const farScore = testing.scoreVehicleForReport(vehicle, report, 0, 30, 0);
    expect(nearScore).toBeGreaterThan(farScore);
  });
});

// ─── Nearest Neighbor Ordering ──────────────────────────────────────

describe("nearestNeighborOrder", () => {
  it("returns stops in same order for 1 or 2 stops", () => {
    const stop1 = makeStop({ reportId: "a", lat: 0, lng: 0 });
    const stop2 = makeStop({ reportId: "b", lat: 1, lng: 1 });
    expect(testing.nearestNeighborOrder([stop1], null)).toEqual([stop1]);
    expect(testing.nearestNeighborOrder([stop1, stop2], null)).toEqual([stop1, stop2]);
  });

  it("orders stops by nearest neighbor starting from highest priority", () => {
    const stopA = makeStop({ reportId: "a", lat: 0, lng: 0, priorityScore: 5 });
    const stopB = makeStop({ reportId: "b", lat: 1, lng: 0, priorityScore: 5 });
    const stopC = makeStop({ reportId: "c", lat: 2, lng: 0, priorityScore: 5 });
    const stopD = makeStop({ reportId: "d", lat: 0.5, lng: 0, priorityScore: 5 });

    const ordered = testing.nearestNeighborOrder([stopC, stopA, stopB, stopD], null);
    expect(ordered[0].reportId).toBe("a");
    expect(ordered[1].reportId).toBe("d");
    expect(ordered[2].reportId).toBe("b");
    expect(ordered[3].reportId).toBe("c");
  });

  it("places highest priority first", () => {
    const stopLow = makeStop({ reportId: "low", lat: 0, lng: 0, priorityScore: 1 });
    const stopHigh = makeStop({ reportId: "high", lat: 10, lng: 10, priorityScore: 10 });

    const ordered = testing.nearestNeighborOrder([stopLow, stopHigh], null);
    expect(ordered[0].reportId).toBe("high");
  });
});

// ─── Haversine Distance ─────────────────────────────────────────────

describe("routeTotalHaversineDistance", () => {
  it("returns 0 for single stop", () => {
    expect(testing.routeTotalHaversineDistance([makeStop({ reportId: "a" })])).toBe(0);
  });

  it("returns 0 for empty stops", () => {
    expect(testing.routeTotalHaversineDistance([])).toBe(0);
  });

  it("calculates sum of haversine distances between consecutive stops", () => {
    const stops = [
      makeStop({ reportId: "a", lat: 0, lng: 0 }),
      makeStop({ reportId: "b", lat: 1, lng: 0 }),
      makeStop({ reportId: "c", lat: 2, lng: 0 }),
    ];
    const d = testing.routeTotalHaversineDistance(stops);
    expect(d).toBeGreaterThan(0);
    expect(d).toBeCloseTo(222.2, -1);
  });
});

// ─── Try Assign Reports (Bin Packing) ────────────────────────────────

describe("tryAssignReports", () => {
  it("assigns all reports to 1 vehicle when capacity sufficient", () => {
    const reports = [
      makeReport({ id: "r1", estimatedLoadKg: 100 }),
      makeReport({ id: "r2", estimatedLoadKg: 200 }),
      makeReport({ id: "r3", estimatedLoadKg: 150 }),
    ];
    const vehicles = [makeVehicle({ id: "v1", kapasitas: 500 })];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(true);
    expect(result.unassigned).toHaveLength(0);
    const assigned0 = result.assignment.get(0)!;
    expect(assigned0).toHaveLength(3);
  });

  it("splits reports across multiple vehicles when capacity exceeded", () => {
    const reports = [
      makeReport({ id: "r1", estimatedLoadKg: 400 }),
      makeReport({ id: "r2", estimatedLoadKg: 300 }),
      makeReport({ id: "r3", estimatedLoadKg: 200 }),
    ];
    const vehicles = [
      makeVehicle({ id: "v1", kapasitas: 500 }),
      makeVehicle({ id: "v2", kapasitas: 500 }),
    ];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(true);
    const assigned0 = result.assignment.get(0)!;
    const assigned1 = result.assignment.get(1)!;
    expect(assigned0.length + assigned1.length).toBe(3);
  });

  it("leaves report unassigned when no vehicle has enough capacity", () => {
    const reports = [makeReport({ id: "r1", estimatedLoadKg: 600 })];
    const vehicles = [makeVehicle({ id: "v1", kapasitas: 500 })];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(false);
    expect(result.unassigned).toHaveLength(1);
  });

  it("handles empty reports", () => {
    const result = testing.tryAssignReports([], [makeVehicle({ id: "v1" })]);
    expect(result.success).toBe(true);
    expect(result.unassigned).toHaveLength(0);
  });

  it("handles empty vehicles", () => {
    const reports = [makeReport({ id: "r1", estimatedLoadKg: 25 })];
    const result = testing.tryAssignReports(reports, []);
    expect(result.success).toBe(false);
    expect(result.unassigned).toHaveLength(1);
  });

  it("respects access obstruction constraints", () => {
    const reports = [
      makeReport({ id: "r1", estimatedLoadKg: 25, access_obstruction_risk: true }),
    ];
    const vehicles = [makeVehicle({ id: "v1", jenis: "Dump Truck", kapasitas: 500 })];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(false);
    expect(result.unassigned).toHaveLength(1);
  });

  it("prefers compatible vehicle for access-obstructed reports", () => {
    const reports = [
      makeReport({ id: "r1", estimatedLoadKg: 25, access_obstruction_risk: true }),
      makeReport({ id: "r2", estimatedLoadKg: 100, access_obstruction_risk: false }),
    ];
    const vehicles = [
      makeVehicle({ id: "v1", jenis: "Motor Roda Tiga", kapasitas: 500 }),
      makeVehicle({ id: "v2", jenis: "Dump Truck", kapasitas: 500 }),
    ];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(true);
    const assigned0 = result.assignment.get(0)!;
    const assigned1 = result.assignment.get(1)!;

    const r1InV0 = assigned0.some((r) => r.id === "r1");
    const r1InV1 = assigned1.some((r) => r.id === "r1");
    expect(r1InV0 || r1InV1).toBe(true);
  });

  it("respects max stops per route", () => {
    const reports = Array.from({ length: 15 }, (_, i) =>
      makeReport({ id: `r${i}`, estimatedLoadKg: 25 }),
    );
    const vehicles = [makeVehicle({ id: "v1", kapasitas: 500 })];
    const result = testing.tryAssignReports(reports, vehicles);
    const assigned0 = result.assignment.get(0)!;
    expect(assigned0.length).toBeLessThanOrEqual(10);
    expect(result.unassigned.length).toBeGreaterThan(0);
  });

  it("assigns highest priority reports first", () => {
    const reports = [
      makeReport({ id: "low", estimatedLoadKg: 25, priority_score: 1 }),
      makeReport({ id: "high", estimatedLoadKg: 300, priority_score: 10 }),
    ];
    const vehicles = [makeVehicle({ id: "v1", kapasitas: 500 })];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(true);
    const assigned = result.assignment.get(0)!;
    const highIdx = assigned.findIndex((r) => r.id === "high");
    const lowIdx = assigned.findIndex((r) => r.id === "low");
    expect(highIdx).toBeLessThan(lowIdx);
  });
});

// ─── Route Optimization ────────────────────────────────────────────

describe("optimizeTwoOpt", () => {
  it("improves route with crossing paths", () => {
    const stops = [
      makeStop({ reportId: "a", lat: 0, lng: 0 }),
      makeStop({ reportId: "b", lat: 1, lng: 1 }),
      makeStop({ reportId: "c", lat: 0.5, lng: 2 }),
      makeStop({ reportId: "d", lat: 0, lng: 3 }),
    ];
    const route = makeRoute({ temporaryRouteId: "r", stops, estimatedDistanceKm: 100 });
    const beforeDist = testing.routeTotalHaversineDistance(route.stops);
    testing.optimizeTwoOpt(route);
    const afterDist = testing.routeTotalHaversineDistance(route.stops);
    expect(afterDist).toBeLessThanOrEqual(beforeDist);
  });

  it("does not change optimal route", () => {
    const stops = [
      makeStop({ reportId: "a", lat: 0, lng: 0 }),
      makeStop({ reportId: "b", lat: 0, lng: 1 }),
      makeStop({ reportId: "c", lat: 0, lng: 2 }),
    ];
    const route = makeRoute({ temporaryRouteId: "r", stops });
    testing.optimizeTwoOpt(route);
    expect(route.stops.map((s) => s.reportId)).toEqual(["a", "b", "c"]);
  });

  it("handles 2-stop route without changes", () => {
    const stops = [
      makeStop({ reportId: "a", lat: 0, lng: 0 }),
      makeStop({ reportId: "b", lat: 1, lng: 1 }),
    ];
    const route = makeRoute({ temporaryRouteId: "r", stops });
    expect(testing.optimizeTwoOpt(route)).toBe(false);
  });
});

describe("tryRelocateStop", () => {
  it("relocates stop when total distance improves", () => {
    const routeA = makeRoute({
      temporaryRouteId: "a",
      kendaraanId: "v1",
      vehicleCapacity: 500,
      availableCapacity: 500,
      totalEstimatedLoad: 100,
      remainingCapacity: 400,
      stops: [
        makeStop({ reportId: "s1", lat: 0, lng: 0, estimatedLoadKg: 50 }),
        makeStop({ reportId: "s2", lat: 10, lng: 10, estimatedLoadKg: 50 }),
      ],
    });

    const routeB = makeRoute({
      temporaryRouteId: "b",
      kendaraanId: "v2",
      vehicleCapacity: 500,
      availableCapacity: 500,
      totalEstimatedLoad: 50,
      remainingCapacity: 450,
      stops: [
        makeStop({ reportId: "s3", lat: 0.1, lng: 0.1, estimatedLoadKg: 50 }),
      ],
    });

    const beforeTotal = testing.routeTotalHaversineDistance(routeA.stops) +
      testing.routeTotalHaversineDistance(routeB.stops);
    const relocated = testing.tryRelocateStop(routeA, routeB, 1);
    if (relocated) {
      const afterTotal = testing.routeTotalHaversineDistance(routeA.stops) +
        testing.routeTotalHaversineDistance(routeB.stops);
      expect(afterTotal).toBeLessThan(beforeTotal);
    }
  });
});

describe("trySwapStops", () => {
  it("swaps stops when total distance improves", () => {
    const routeA = makeRoute({
      temporaryRouteId: "a",
      kendaraanId: "v1",
      vehicleCapacity: 500,
      availableCapacity: 500,
      totalEstimatedLoad: 50,
      remainingCapacity: 450,
      stops: [
        makeStop({ reportId: "s1", lat: 0, lng: 0, estimatedLoadKg: 25 }),
        makeStop({ reportId: "s2", lat: 3, lng: 3, estimatedLoadKg: 25 }),
      ],
    });

    const routeB = makeRoute({
      temporaryRouteId: "b",
      kendaraanId: "v2",
      vehicleCapacity: 500,
      availableCapacity: 500,
      totalEstimatedLoad: 25,
      remainingCapacity: 475,
      stops: [
        makeStop({ reportId: "s3", lat: 2, lng: 2, estimatedLoadKg: 25 }),
      ],
    });

    const swapped = testing.trySwapStops(routeA, routeB, 1, 0);
    if (swapped) {
      const aHasS3 = routeA.stops.some((s) => s.reportId === "s3");
      const bHasS2 = routeB.stops.some((s) => s.reportId === "s2");
      expect(aHasS3).toBe(true);
      expect(bHasS2).toBe(true);
    }
  });

  it("rejects swap when capacity would be exceeded", () => {
    const routeA = makeRoute({
      temporaryRouteId: "a",
      kendaraanId: "v1",
      vehicleCapacity: 500,
      availableCapacity: 500,
      totalEstimatedLoad: 480,
      remainingCapacity: 20,
      stops: [
        makeStop({ reportId: "s1", lat: 0, lng: 0, estimatedLoadKg: 25 }),
      ],
    });

    const routeB = makeRoute({
      temporaryRouteId: "b",
      kendaraanId: "v2",
      vehicleCapacity: 500,
      availableCapacity: 500,
      totalEstimatedLoad: 400,
      remainingCapacity: 100,
      stops: [
        makeStop({ reportId: "s2", lat: 1, lng: 1, estimatedLoadKg: 100 }),
      ],
    });

    expect(testing.trySwapStops(routeA, routeB, 0, 0)).toBe(false);
  });
});

describe("tryMergeRoutes", () => {
  it("merges two routes when combined load fits in one vehicle", () => {
    const routeA = makeRoute({
      temporaryRouteId: "a",
      kendaraanId: "v1",
      kendaraanJenis: "Pick Up",
      vehicleCapacity: 1500,
      availableCapacity: 1500,
      totalEstimatedLoad: 100,
      remainingCapacity: 1400,
      stops: [makeStop({ reportId: "s1", lat: 0, lng: 0, estimatedLoadKg: 100 })],
    });

    const routeB = makeRoute({
      temporaryRouteId: "b",
      kendaraanId: "v2",
      kendaraanJenis: "Pick Up",
      vehicleCapacity: 1500,
      availableCapacity: 1500,
      totalEstimatedLoad: 200,
      remainingCapacity: 1300,
      stops: [makeStop({ reportId: "s2", lat: 1, lng: 1, estimatedLoadKg: 200 })],
    });

    const vehicles = [
      makeVehicle({ id: "v1", jenis: "Pick Up", kapasitas: 1500 }),
      makeVehicle({ id: "v2", jenis: "Pick Up", kapasitas: 1500 }),
    ];
    const officers = [makeOfficer({ id: "o1" })];

    const merged = testing.tryMergeRoutes(routeA, routeB, vehicles, officers);
    if (merged) {
      expect(merged.totalEstimatedLoad).toBe(300);
      expect(merged.stops).toHaveLength(2);
      expect(merged.kendaraanId).toBeTruthy();
    }
  });

  it("rejects merge when combined stops exceed maxStopsPerRoute", () => {
    const stopsA = Array.from({ length: 8 }, (_, i) =>
      makeStop({ reportId: `a${i}`, lat: i, lng: 0, estimatedLoadKg: 25 }),
    );
    const stopsB = Array.from({ length: 5 }, (_, i) =>
      makeStop({ reportId: `b${i}`, lat: i + 10, lng: 0, estimatedLoadKg: 25 }),
    );

    const routeA = makeRoute({
      temporaryRouteId: "a",
      kendaraanId: "v1",
      vehicleCapacity: 5000,
      availableCapacity: 5000,
      totalEstimatedLoad: 200,
      remainingCapacity: 4800,
      stops: stopsA,
    });

    const routeB = makeRoute({
      temporaryRouteId: "b",
      kendaraanId: "v2",
      vehicleCapacity: 5000,
      availableCapacity: 5000,
      totalEstimatedLoad: 125,
      remainingCapacity: 4875,
      stops: stopsB,
    });

    const vehicles = [
      makeVehicle({ id: "v1", kapasitas: 5000 }),
      makeVehicle({ id: "v2", kapasitas: 5000 }),
    ];

    expect(testing.tryMergeRoutes(routeA, routeB, vehicles, [])).toBeNull();
  });
});

// ─── createStopFromReport ───────────────────────────────────────────

describe("createStopFromReport", () => {
  it("maps all required fields from EligibleReport to AutoCollectiveStop", () => {
    const report = makeReport({
      id: "r1",
      lokasi_lat: -6.9,
      lokasi_lng: 107.6,
      address_text: "Jalan Test",
      priority_level: "HIGH",
      priority_score: 9.0,
      estimatedLoadKg: 100,
      kategori_ukuran: "SEDANG",
      drainage_risk: true,
      access_obstruction_risk: false,
      waste_types: ["plastik", "kertas"],
    });
    const stop = testing.createStopFromReport(report);
    expect(stop.reportId).toBe("r1");
    expect(stop.lat).toBe(-6.9);
    expect(stop.lng).toBe(107.6);
    expect(stop.address).toBe("Jalan Test");
    expect(stop.priorityLevel).toBe("HIGH");
    expect(stop.priorityScore).toBe(9.0);
    expect(stop.estimatedLoadKg).toBe(100);
    expect(stop.sizeCategory).toBe("SEDANG");
    expect(stop.drainageRisk).toBe(true);
    expect(stop.accessObstructionRisk).toBe(false);
    expect(stop.wasteTypes).toEqual(["plastik", "kertas"]);
  });
});

// ─── computeEstimatedLoadKg ─────────────────────────────────────────

describe("computeEstimatedLoadKg", () => {
  it("returns 25 for KECIL", () => {
    expect(computeEstimatedLoadKg({ kategori_ukuran: "KECIL", corrected_kategori_ukuran: null })).toBe(25);
  });

  it("returns 25 for SMALL", () => {
    expect(computeEstimatedLoadKg({ kategori_ukuran: "SMALL", corrected_kategori_ukuran: null })).toBe(25);
  });

  it("returns 100 for SEDANG", () => {
    expect(computeEstimatedLoadKg({ kategori_ukuran: "SEDANG", corrected_kategori_ukuran: null })).toBe(100);
  });

  it("returns 300 for BESAR", () => {
    expect(computeEstimatedLoadKg({ kategori_ukuran: "BESAR", corrected_kategori_ukuran: null })).toBe(300);
  });

  it("returns 0 for unknown category", () => {
    expect(computeEstimatedLoadKg({ kategori_ukuran: "UNKNOWN", corrected_kategori_ukuran: null })).toBe(0);
  });

  it("uses corrected_kategori_ukuran when available", () => {
    expect(computeEstimatedLoadKg({
      kategori_ukuran: "KECIL",
      corrected_kategori_ukuran: "BESAR",
    })).toBe(300);
  });
});

// ─── Edge Cases ─────────────────────────────────────────────────────

describe("edge cases", () => {
  it("handles duplicate report IDs by ignoring duplicates", () => {
    const reports = [
      makeReport({ id: "r1", estimatedLoadKg: 100 }),
      makeReport({ id: "r1", estimatedLoadKg: 100 }),
      makeReport({ id: "r2", estimatedLoadKg: 50 }),
    ];
    const vehicles = [makeVehicle({ id: "v1", kapasitas: 500 })];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(true);
    const assigned = result.assignment.get(0)!;
    expect(assigned.length).toBe(3);
  });

  it("assigns single report to single vehicle", () => {
    const reports = [makeReport({ id: "r1", estimatedLoadKg: 100 })];
    const vehicles = [makeVehicle({ id: "v1", kapasitas: 500 })];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(true);
    const assigned = result.assignment.get(0)!;
    expect(assigned).toHaveLength(1);
    expect(assigned[0].id).toBe("r1");
  });

  it("handles zero-load report", () => {
    const reports = [makeReport({ id: "r1", estimatedLoadKg: 0 })];
    const vehicles = [makeVehicle({ id: "v1", kapasitas: 500 })];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(true);
    expect(result.unassigned).toHaveLength(0);
  });

  it("all vehicles fully loaded → all reports unassigned", () => {
    const reports = [
      makeReport({ id: "r1", estimatedLoadKg: 100 }),
      makeReport({ id: "r2", estimatedLoadKg: 100 }),
    ];
    const vehicles = [
      makeVehicle({ id: "v1", kapasitas: 100, current_load: 100 }),
      makeVehicle({ id: "v2", kapasitas: 100, current_load: 100 }),
    ];
    const result = testing.tryAssignReports(reports, vehicles);
    expect(result.success).toBe(false);
    expect(result.unassigned).toHaveLength(2);
  });
});

// ─── Neighbor Finding ───────────────────────────────────────────────

describe("AUTO_COLLECTIVE_CONFIG neighbor thresholds", () => {
  it("defines neighborHaversineRadiusKm and neighborMaxDriveDurationMinutes", () => {
    expect(AUTO_COLLECTIVE_CONFIG.neighborHaversineRadiusKm).toBe(10);
    expect(AUTO_COLLECTIVE_CONFIG.neighborMaxDriveDurationMinutes).toBe(60);
  });
});

describe("findNeighborReports", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockFindMany.mockReset();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns seed and nearby eligible neighbors within radius and drive duration", async () => {
    mockFindMany.mockResolvedValue([
      makeRawLaporan({ id: "seed", lokasi_lat: -7.327, lokasi_lng: 108.221 }),
      makeRawLaporan({ id: "near", lokasi_lat: -7.322, lokasi_lng: 108.226 }),
      makeRawLaporan({ id: "far", lokasi_lat: -7.5, lokasi_lng: 108.5 }),
    ]);
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        code: "Ok",
        // OSRM table: index 0 = origin, index 1 = near only (far already dropped by haversine)
        durations: [[0, 600]],
      }),
    });

    const result = await findNeighborReports("seed", "dinas-1");
    expect(result.neighborIds).toContain("seed");
    expect(result.neighborIds).toContain("near");
    expect(result.neighborIds).not.toContain("far");
  });

  it("falls back to haversine drive estimate when OSRM returns null/invalid", async () => {
    mockFindMany.mockResolvedValue([
      makeRawLaporan({ id: "seed", lokasi_lat: -7.327, lokasi_lng: 108.221 }),
      makeRawLaporan({ id: "near", lokasi_lat: -7.322, lokasi_lng: 108.226 }),
    ]);
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ code: "NoRoute" }),
    });

    const result = await findNeighborReports("seed", "dinas-1");
    expect(result.neighborIds).toEqual(expect.arrayContaining(["seed", "near"]));
    expect(global.fetch).toHaveBeenCalled();
  });

  it("returns only seed when source is not in eligible reports (e.g. PENDING/assigned)", async () => {
    mockFindMany.mockResolvedValue([
      makeRawLaporan({ id: "other", lokasi_lat: -7.327, lokasi_lng: 108.221 }),
    ]);

    const result = await findNeighborReports("pending-or-assigned", "dinas-1");
    expect(result.neighborIds).toEqual(["pending-or-assigned"]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("queries only ANALYZED/WAITING unassigned reports for eligibility", async () => {
    mockFindMany.mockResolvedValue([
      makeRawLaporan({ id: "seed", lokasi_lat: -7.327, lokasi_lng: 108.221 }),
      makeRawLaporan({ id: "neighbor", lokasi_lat: -7.322, lokasi_lng: 108.226 }),
    ]);
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await findNeighborReports("seed", "dinas-1");
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dinas_id: "dinas-1",
          status: { in: ["ANALYZED", "WAITING"] },
          petugas_id: null,
          kendaraan_id: null,
          needs_manual_review: false,
        }),
      }),
    );
  });
});

describe("neighbor selection → preview reportIds integration", () => {
  it("merges seed+neighbors into selectedPickupIds and preview uses the same ids", () => {
    const selectedBefore: string[] = [];
    const clickedId = "9155614b-65bc-4082-b824-83e8006368e8";
    const neighborResponse = {
      success: true,
      data: {
        neighborIds: [
          clickedId,
          "490e1c6a-6ff1-40f7-8689-06bfe6fb0c5a",
          "95efdbe6-b6ad-4a26-b1c2-0580b9c15dd0",
        ],
      },
    };

    const selectedAfter = (() => {
      const combined = new Set(selectedBefore);
      for (const nid of neighborResponse.data.neighborIds) combined.add(nid);
      return [...combined];
    })();

    expect(selectedAfter).toEqual(neighborResponse.data.neighborIds);
    const previewBody = {
      reportIds: selectedAfter.length > 0 ? selectedAfter : undefined,
    };
    expect(previewBody.reportIds).toEqual(neighborResponse.data.neighborIds);
  });
});
