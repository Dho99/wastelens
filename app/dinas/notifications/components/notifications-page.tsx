"use client";

import { Bell, CheckCheck, ClipboardList, Trash2 } from "lucide-react";
import { DlhShell } from "../../components/dlh-shell";
import { useNotifications, useMarkRead, useDeleteNotification } from "../../hooks/useNotifications";

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
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

function notifIcon() {
  return <ClipboardList className="size-5" />;
}

export function NotificationsPage() {
  const { data: items = [] } = useNotifications();
  const markRead = useMarkRead();
  const deleteNotif = useDeleteNotification();

  const hasUnread = items.some((item) => !item.status_baca);

  return <DlhShell><main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-4xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#39815a]">Activity Center</p><h2 className="mt-1 text-2xl font-extrabold">Notifikasi</h2><p className="mt-1 text-sm text-slate-500">Pembaruan laporan dan operasional terkini.</p></div><button type="button" disabled={!hasUnread} onClick={() => { items.filter((n) => !n.status_baca).forEach((n) => markRead.mutate(n.id)); }} className="flex items-center justify-center gap-2 rounded-full border border-[#bdd0c4] bg-white px-5 py-3 text-sm font-bold disabled:cursor-default disabled:opacity-50"><CheckCheck className="size-4" /> {hasUnread ? "Tandai semua dibaca" : "Semua sudah dibaca"}</button></div><div className="mt-6 overflow-hidden rounded-3xl border border-[#d8e7df] bg-white shadow-sm">{items.map((item) => <article key={item.id} onClick={() => markRead.mutate(item.id)} className={`flex cursor-pointer gap-4 border-b border-slate-100 p-5 last:border-0 ${item.status_baca ? "bg-white" : "bg-[#f0fbf5]"}`}><span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${item.status_baca ? "bg-slate-100 text-slate-500" : "bg-[#d5f1e1] text-[#087529]"}`}>{notifIcon()}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="font-extrabold">Notifikasi Laporan</h3>{!item.status_baca && <span className="size-2 rounded-full bg-[#087529]" />}</div><p className="mt-1 text-sm text-slate-600">{item.pesan}</p><p className="mt-2 text-xs text-slate-400">{formatTime(item.createdAt)}</p></div><button type="button" onClick={(event) => { event.stopPropagation(); deleteNotif.mutate(item.id); }} aria-label="Hapus notifikasi" className="self-center rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button></article>)}{!items.length && <div className="py-16 text-center"><Bell className="mx-auto size-8 text-slate-300" /><p className="mt-3 text-sm text-slate-500">Tidak ada notifikasi.</p></div>}</div></div></main></DlhShell>;
}
