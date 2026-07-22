import { apiFetch } from "@/lib/api-client";
import type { ReportList, Report } from "../types/reports";

export function getReports(params: URLSearchParams) {
  return apiFetch<ReportList>(`/api/admin/reports?${params}`);
}
