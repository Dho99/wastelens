import { LOAD_ESTIMATES_KG } from "@/lib/services/assignment";

export { LOAD_ESTIMATES_KG };

export const AUTO_COLLECTIVE_CONFIG = {
  maxStopsPerRoute: 10,
  maxRouteDistanceKm: 30,
  maxEstimatedDurationMinutes: 240,
  distanceWeight: 0.65,
  priorityWeight: 0.35,
  osrmTimeoutMs: 5000,
  neighborHaversineRadiusKm: 10,
  neighborMaxDriveDurationMinutes: 60,
  maxOptimizationIterations: 10,
  enableTwoOpt: true,
  enableCrossRouteOptimization: true,
  enableRouteMerging: true,
} as const;
