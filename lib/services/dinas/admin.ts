import { apiFetch } from "@/lib/api-client";
import type { DinasAdmin } from "./types";

export function getAdmin() {
  return apiFetch<DinasAdmin>("/api/dinas/admin");
}

export function updateAdmin(data: { name?: string; phoneNumber?: string }) {
  return apiFetch<DinasAdmin>("/api/dinas/admin", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function changePassword(data: { currentPassword: string; newPassword: string }) {
  return apiFetch<void>("/api/dinas/admin/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
