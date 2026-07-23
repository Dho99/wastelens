import { apiFetch } from "@/lib/api-client";
import type { DinasVehicle } from "./types";

export function getVehicles() {
  return apiFetch<DinasVehicle[]>("/api/dinas/vehicles");
}

export function getVehicle(id: string) {
  return apiFetch<DinasVehicle>(`/api/dinas/vehicles/${id}`);
}

export function createVehicle(data: { jenis: string; kapasitas: number }) {
  return apiFetch<DinasVehicle>("/api/dinas/vehicles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateVehicle(id: string, data: Partial<{ jenis: string; kapasitas: number; current_load: number }>) {
  return apiFetch<DinasVehicle>(`/api/dinas/vehicles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteVehicle(id: string) {
  return apiFetch<void>(`/api/dinas/vehicles/${id}`, { method: "DELETE" });
}
