"use client";

import { useRealtimeNotifications } from "@/app/hooks/useRealtimeNotifications";

/** Mount once under QueryProvider to subscribe Pusher + toast for all roles. */
export function RealtimeNotifications() {
  useRealtimeNotifications();
  return null;
}
