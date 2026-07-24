import { apiFetch } from "@/lib/api-client";
import type { DinasReport, DinasVehicle, DinasOfficer, DinasDispatchRoute } from "./types";

export interface DashboardData {
  activeReports: DinasReport[];
  assignedReports: DinasReport[];
  vehicles: DinasVehicle[];
  officers: DinasOfficer[];
  dispatchRoutes?: DinasDispatchRoute[];
}

export function getDashboardData() {
  return apiFetch<DashboardData>("/api/dinas/dashboard");
}
