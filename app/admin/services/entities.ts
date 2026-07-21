import { apiFetch } from "@/lib/api-client";
import type { EntityDinas, EntityKopdes, DinasForm, KopdesForm } from "../types/entities";
import type { ListResult } from "../types/users";

// Users
export function getEntityUsers() {
  return apiFetch<ListResult<{ id: string; nama: string; email: string; role: string; status: string }>>("/api/admin/users?limit=100");
}

// Dinas
export function getDinas() {
  return apiFetch<EntityDinas[]>("/api/admin/dinas");
}

export function createDinas(body: DinasForm) {
  return apiFetch<EntityDinas>("/api/admin/dinas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function updateDinas(id: string, nama_dinas: string, kontak: string) {
  return apiFetch<EntityDinas>("/api/admin/dinas", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nama_dinas, kontak }),
  });
}

export function deleteDinas(id: string) {
  return apiFetch<{ message: string }>(`/api/admin/dinas?id=${id}`, {
    method: "DELETE",
  });
}

// Kopdes
export function getKopdes() {
  return apiFetch<EntityKopdes[]>("/api/admin/kopdes");
}

export function createKopdes(body: KopdesForm) {
  return apiFetch<EntityKopdes>("/api/admin/kopdes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function updateKopdes(id: string, nama: string, alamat: string) {
  return apiFetch<EntityKopdes>("/api/admin/kopdes", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nama, alamat }),
  });
}

export function deleteKopdes(id: string) {
  return apiFetch<{ message: string }>(`/api/admin/kopdes?id=${id}`, {
    method: "DELETE",
  });
}
