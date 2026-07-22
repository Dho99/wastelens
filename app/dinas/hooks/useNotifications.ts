import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markRead, deleteNotification } from "@/lib/services/dinas/notifications";

export function useNotifications() {
  return useQuery({
    queryKey: ["dinas-notifications"],
    queryFn: getNotifications,
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markRead,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-notifications"] }); },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-notifications"] }); },
  });
}
