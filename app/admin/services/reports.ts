import { apiFetch } from "@/lib/api-client";
import type { ReportList, ReportDetail } from "../types/reports";

export function getReports(params: URLSearchParams) {
  return apiFetch<ReportList>(`/api/admin/reports?${params}`);
}

export async function getReportDetail(reportId: string): Promise<ReportDetail> {
  const res = await apiFetch<{ success: boolean; data: ReportDetail }>(
    `/api/admin/reports/${reportId}`
  );
  return res.data;
}
