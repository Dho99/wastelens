import { useQuery } from "@tanstack/react-query";
import { getReports } from "../services/reports";

export function useReports(page: number, statusFilter: string) {
  return useQuery({
    queryKey: ["admin-reports", page, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "5" });
      if (statusFilter) params.set("status", statusFilter);
      return getReports(params);
    },
    placeholderData: (previousData) => previousData,
  });
}
