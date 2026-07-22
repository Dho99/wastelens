import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { DashboardData } from "../types/dashboard";

export function usePetugasDashboard() {
  return useQuery({
    queryKey: ["petugas-dashboard"],
    queryFn: () => apiFetch<DashboardData>("/api/petugas/dashboard"),
  });
}
