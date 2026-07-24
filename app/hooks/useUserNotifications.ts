import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import {
  getUserNotifications,
  markUserNotificationRead,
  markAllUserNotificationsRead,
} from "@/lib/services/user-notifications";

export const USER_NOTIFICATIONS_KEY = ["user-notifications"] as const;

export function useUserNotifications() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: USER_NOTIFICATIONS_KEY,
    queryFn: () => getUserNotifications({ limit: 50 }),
    enabled: !!session?.user?.id,
  });
}

export function useMarkUserNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markUserNotificationRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_NOTIFICATIONS_KEY });
    },
  });
}

export function useMarkAllUserNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllUserNotificationsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_NOTIFICATIONS_KEY });
    },
  });
}
