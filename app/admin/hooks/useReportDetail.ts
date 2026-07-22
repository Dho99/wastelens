import { useQuery } from "@tanstack/react-query";
import { getReportDetail } from "../services/reports";

export function useReportDetail(reportId: string) {
  return useQuery({
    queryKey: ["admin-report-detail", reportId],
    queryFn: () => getReportDetail(reportId),
    enabled: Boolean(reportId),
  });
}
