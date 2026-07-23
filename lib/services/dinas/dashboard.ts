import { apiFetch } from "@/lib/api-client";
import type { DinasReport, DinasVehicle, DinasOfficer } from "./types";

export interface DashboardData {
  activeReports: DinasReport[];
  assignedReports: DinasReport[];
  vehicles: DinasVehicle[];
  officers: DinasOfficer[];
}

export function getDashboardData() {
  return apiFetch<DashboardData>("/api/dinas/dashboard");
}
