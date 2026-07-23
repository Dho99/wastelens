"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { usePusher } from "@/app/hooks/usePusher";
import { USER_NOTIFICATIONS_KEY } from "@/app/hooks/useUserNotifications";
import { WS_EVENTS, type PusherEvent } from "@/server/websocket/websocket.types";

function messageForEvent(event: PusherEvent, role?: string): string {
  switch (event.type) {
    case WS_EVENTS.REPORT_CREATED:
      return role === "dinas"
        ? "Laporan sampah baru masuk dan menunggu penanganan."
        : "Laporan berhasil dibuat.";
    case WS_EVENTS.REPORT_ASSIGNED:
      return role === "petugas"
        ? "Tugas pickup baru ditugaskan. Periksa daftar tugas."
        : "Laporan Anda telah dijadwalkan untuk dijemput.";
    case WS_EVENTS.REPORT_STATUS_UPDATED: {
      const status = (event.payload as { status?: string }).status ?? "";
      if (status === "DITOLAK") return "Laporan Anda ditolak.";
      return status
        ? `Status laporan diperbarui menjadi ${status}.`
        : "Status laporan diperbarui.";
    }
    case WS_EVENTS.REPORT_VERIFIED:
      return "Laporan selesai ditangani.";
    case WS_EVENTS.COIN_REWARDED: {
      const jumlah = (event.payload as { jumlah?: number }).jumlah ?? 0;
      return `Koin +${jumlah} telah ditambahkan.`;
    }
    default:
      return "Ada pembaruan notifikasi baru.";
  }
}

export function useRealtimeNotifications() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;
  const role = (session?.user as { role?: string } | undefined)?.role;
  const { subscribe } = usePusher(userId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const unsubscribers = Object.values(WS_EVENTS).map((eventType) =>
      subscribe(eventType, (event) => {
        toast(messageForEvent(event, role), { duration: 4000 });
        void queryClient.invalidateQueries({ queryKey: ["dinas-notifications"] });
        void queryClient.invalidateQueries({ queryKey: USER_NOTIFICATIONS_KEY });
      }),
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [userId, role, subscribe, queryClient]);
}
