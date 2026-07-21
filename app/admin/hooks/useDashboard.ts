import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../services/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboardSummary,
  });
}
