import { apiFetch } from "@/lib/api-client";
import type { DinasNotification } from "./types";

export function getNotifications() {
  return apiFetch<DinasNotification[]>("/api/dinas/notifications");
}

export function markRead(id: string) {
  return apiFetch<DinasNotification>(`/api/dinas/notifications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status_baca: true }),
  });
}

export function deleteNotification(id: string) {
  return apiFetch<void>(`/api/dinas/notifications/${id}`, { method: "DELETE" });
}
