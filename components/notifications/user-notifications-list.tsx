"use client";

import {
  useUserNotifications,
  useMarkUserNotificationRead,
  useMarkAllUserNotificationsRead,
} from "@/app/hooks/useUserNotifications";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function UserNotificationsList() {
  const { data, isLoading } = useUserNotifications();
  const markRead = useMarkUserNotificationRead();
  const markAll = useMarkAllUserNotificationsRead();

  const items = data?.notifications ?? [];
  const hasUnread = items.some((item) => !item.status_baca);

  return (
    <div className="mx-auto w-full max-w-screen-sm px-1 pb-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E7D38]">Notifikasi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pembaruan laporan dan reward Anda.
          </p>
        </div>
        <button
          type="button"
          disabled={!hasUnread || markAll.isPending}
          onClick={() => markAll.mutate()}
          className="rounded-full border border-[#bdd0c4] bg-white px-4 py-2 text-xs font-bold text-[#1E7D38] disabled:cursor-default disabled:opacity-50"
        >
          Tandai dibaca
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#d8e7df] bg-white shadow-sm">
        {isLoading && (
          <p className="px-5 py-10 text-center text-sm text-slate-400">Memuat…</p>
        )}

        {!isLoading &&
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!item.status_baca) markRead.mutate(item.id);
              }}
              className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left last:border-0 ${
                item.status_baca ? "bg-white" : "bg-[#f0fbf5]"
              }`}
            >
              <span
                className={`mt-1 size-2 shrink-0 rounded-full ${
                  item.status_baca ? "bg-transparent" : "bg-[#087529]"
                }`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">{item.pesan}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatTime(item.createdAt)}
                </p>
              </div>
            </button>
          ))}

        {!isLoading && items.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            Tidak ada notifikasi.
          </p>
        )}
      </div>
    </div>
  );
}
