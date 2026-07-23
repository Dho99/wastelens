import { apiFetch } from "@/lib/api-client";
import type { DinasOfficer } from "./types";

export function getOfficers() {
  return apiFetch<DinasOfficer[]>("/api/dinas/officers");
}

export function getOfficer(id: string) {
  return apiFetch<DinasOfficer>(`/api/dinas/officers/${id}`);
}

export function createOfficer(data: { nama: string; no_hp?: string; user_id?: string }) {
  return apiFetch<DinasOfficer>("/api/dinas/officers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateOfficer(id: string, data: Partial<{ nama: string; no_hp: string }>) {
  return apiFetch<DinasOfficer>(`/api/dinas/officers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteOfficer(id: string) {
  return apiFetch<void>(`/api/dinas/officers/${id}`, { method: "DELETE" });
}
