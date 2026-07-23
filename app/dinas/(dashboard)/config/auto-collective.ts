import { LOAD_ESTIMATES_KG } from "@/lib/services/assignment";

export { LOAD_ESTIMATES_KG };

export const AUTO_COLLECTIVE_CONFIG = {
  maxStopsPerRoute: 5,
  maxRouteDistanceKm: 25,
  minRemainingCapacity: 50,
  maxDistanceBetweenStopsKm: 8,
  maxTotalLoadKg: 800,
  maxDistanceFromDepotKm: 30,
  maxDetourRatio: 1.5,
  maxAlternatives: 3,
  includePriorityLevels: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
  defaultVehicleCapacity: 500,
};
