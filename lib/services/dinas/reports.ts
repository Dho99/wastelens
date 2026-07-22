import { apiFetch } from "@/lib/api-client";
import type { DinasReport } from "./types";

export function getReports(params?: { status?: string; page?: number; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.status && params.status !== "Semua") search.set("status", params.status);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  return apiFetch<DinasReport[]>(`/api/dinas/reports?${search}`);
}

export function getReport(id: string) {
  return apiFetch<DinasReport>(`/api/dinas/reports/${id}`);
}

export function assignReport(id: string, data: { petugasId?: string; kendaraanId?: string; status?: string }) {
  return apiFetch<DinasReport>(`/api/dinas/reports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteReport(id: string) {
  return apiFetch<void>(`/api/dinas/reports/${id}`, { method: "DELETE" });
}
