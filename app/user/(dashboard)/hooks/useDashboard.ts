import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { DashboardData } from "../types/dashboard";

export function useDashboard() {
    return useQuery({
        queryKey: ["user-dashboard"],
        queryFn: () => apiFetch<DashboardData>("/api/user/dashboard"),
    });
}
