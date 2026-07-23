"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, Loader2, Save, Settings } from "lucide-react";
import { DlhShell } from "../../components/dlh-shell";
import { useSettings, useUpdateSettings } from "../../hooks/useSettings";

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
