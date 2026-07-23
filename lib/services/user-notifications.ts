import { apiFetch } from "@/lib/api-client";

export type UserNotification = {
  id: string;
  pesan: string;
  status_baca: boolean;
  laporan_id: string;
  createdAt: string;
};

export type UserNotificationsPayload = {
  notifications: UserNotification[];
  unreadCount: number;
};

export function getUserNotifications(opts?: { unreadOnly?: boolean; limit?: number }) {
  const params = new URLSearchParams();
  if (opts?.unreadOnly) params.set("unreadOnly", "true");
  if (opts?.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();
  return apiFetch<UserNotificationsPayload>(`/api/notifikasi${qs ? `?${qs}` : ""}`);
}

export function markUserNotificationRead(id: string) {
  return apiFetch<UserNotificationsPayload>(
    `/api/notifikasi?markRead=${encodeURIComponent(id)}`,
  );
}

export function markAllUserNotificationsRead() {
  return apiFetch<UserNotificationsPayload>("/api/notifikasi?markAll=true");
}
