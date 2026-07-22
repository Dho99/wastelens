"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, Bell, CheckCheck, ClipboardList, Loader2, Save, Settings, Trash2 } from "lucide-react";
import { DlhShell } from "./dlh-shell";
import { useNotifications, useMarkRead, useDeleteNotification } from "../hooks/useNotifications";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";

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

export function SettingsPage() {
  const { data: settings, isLoading, isError, refetch } = useSettings();
  const updateSettings = useUpdateSettings();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    try {
      await updateSettings.mutateAsync({
        agency: String(data.get("agency")),
        region: String(data.get("region")),
        email: String(data.get("email")),
        phone: String(data.get("phone")),
        autoDispatch: settings?.autoDispatch ?? false,
        emailAlert: settings?.emailAlert ?? false,
        soundAlert: settings?.soundAlert ?? false,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Pengaturan gagal disimpan. Silakan coba kembali.");
    }
  };

  if (isLoading) return <DlhShell><div className="flex flex-1 items-center justify-center bg-[#f5fbfe] text-[#087529]"><div className="text-center"><Loader2 className="mx-auto size-8 animate-spin" /><p className="mt-3 text-sm font-semibold">Memuat pengaturan...</p></div></div></DlhShell>;

  if (isError || !settings) return <DlhShell><div className="flex flex-1 items-center justify-center bg-[#f5fbfe] p-6"><div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm"><AlertTriangle className="mx-auto size-10 text-red-500" /><h2 className="mt-4 text-lg font-extrabold">Pengaturan gagal dimuat</h2><button type="button" onClick={() => refetch()} className="mt-5 rounded-full bg-[#087529] px-6 py-2.5 text-sm font-bold text-white">Coba Lagi</button></div></div></DlhShell>;

  return <DlhShell><main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6 lg:p-8"><form onSubmit={save} className="w-full"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#39815a]">Portal Configuration</p><h2 className="mt-1 text-2xl font-extrabold">Pengaturan</h2><p className="mt-1 text-sm text-slate-500">Atur informasi profil instansi.</p></div>{saved && <div role="status" className="mt-5 rounded-2xl bg-[#def5e8] px-4 py-3 text-sm font-semibold text-[#166734]">Pengaturan berhasil disimpan.</div>}{error && <div role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}<section className="mt-6 rounded-3xl border border-[#d8e7df] bg-white p-6 shadow-sm lg:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e5f6ed] text-[#087529]"><Settings className="size-5" /></span><div><h3 className="font-extrabold">Profil Instansi</h3><p className="text-xs text-slate-400">Informasi yang tampil pada portal DLH.</p></div></div><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4"><label className="text-sm font-bold">Nama Instansi<input name="agency" defaultValue={settings.agency ?? ""} className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label><label className="text-sm font-bold">Wilayah<input name="region" defaultValue={settings.region ?? ""} className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label><label className="text-sm font-bold">Email Operasional<input name="email" type="email" defaultValue={settings.email ?? ""} className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label><label className="text-sm font-bold">Nomor Hotline<input name="phone" defaultValue={settings.phone ?? ""} className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label></div></section><div className="sticky bottom-0 mt-5 flex justify-end border-t border-[#d8e7df] bg-[#f5fbfe]/95 py-4 backdrop-blur"><button disabled={updateSettings.isPending} className="flex items-center gap-2 rounded-full bg-[#087529] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-60">{updateSettings.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} {updateSettings.isPending ? "Menyimpan..." : "Simpan Pengaturan"}</button></div></form></main></DlhShell>;
}
