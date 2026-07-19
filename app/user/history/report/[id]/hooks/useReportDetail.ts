import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { ReportDetail } from "../services/reportDetailService";

export function useReportDetail(id: string) {
    return useQuery({
        queryKey: ["report-detail", id],
        queryFn: () => apiFetch<ReportDetail>(`/api/laporan/history/${id}`),
        enabled: !!id,
    });
}
