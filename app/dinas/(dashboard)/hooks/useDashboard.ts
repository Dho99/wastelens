import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/services/dinas/dashboard";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dinas-dashboard"],
    queryFn: getDashboardData,
    refetchInterval: 30_000,
  });
}
