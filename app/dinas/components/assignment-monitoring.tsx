"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  Check,
  CheckCircle2,
  Clock3,
  Grid2X2,
  MapPin,
  Route,
  Sparkles,
  SprayCan,
  Truck,
} from "lucide-react";
import { useDlhStore } from "@/lib/dlh-store";

export function AssignmentMonitoring({ reportId }: { reportId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useDlhStore();
  const vehicle = store.vehicles.find((item) => item.id === searchParams.get("vehicle")) ?? store.vehicles[0];
  const officer = store.officers.find((item) => item.id === searchParams.get("officer")) ?? store.officers[0];
  const report = store.reports.find((item) => item.id === reportId);

  return (
    <main className="min-h-dvh bg-[#f2f9fe] text-[#17231d]">
      <header className="flex h-16 items-center border-b border-[#bccdbf] px-5 sm:px-7">
        <button type="button" onClick={() => router.back()} aria-label="Kembali" className="rounded-full p-2 transition hover:bg-white">
          <ArrowLeft className="size-6" />
        </button>
        <span className="ml-auto hidden text-xs font-bold text-[#68776f] sm:block">Penugasan #{reportId}</span>
      </header>

      <div className="mx-auto max-w-[800px] px-4 pb-12 pt-4 sm:px-5">
        <section className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#258237] text-[#d8ffdd] shadow-sm">
            <span className="grid size-8 place-items-center rounded-full bg-[#c8f6cf]"><Check className="size-5 text-[#258237]" strokeWidth={3} /></span>
          </div>
          <h1 className="mt-4 text-lg font-extrabold tracking-[-0.025em] sm:text-[22px]">Penugasan Armada &amp; Petugas Berhasil</h1>
          <p className="mt-1.5 text-sm text-[#66736c]">Instruksi kerja telah dikirimkan ke perangkat petugas lapangan.</p>
        </section>

        <section className="mt-8 rounded-[22px] border border-[#aebfae] bg-white px-5 py-5 shadow-sm sm:px-7">
          <h2 className="text-base font-extrabold">Status Monitoring Tugas</h2>
          <div className="relative mt-5 space-y-0">
            <div className="absolute bottom-7 left-6 top-6 w-px bg-[#9fc8a5]" />

            <div className="relative flex gap-4 pb-5">
              <span className="z-10 grid size-12 shrink-0 place-items-center rounded-full bg-[#087529] text-white"><Route className="size-5" /></span>
              <div className="pt-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-extrabold text-[#087529]">Menuju Lokasi</h3><span className="rounded-full bg-[#087529] px-2 py-0.5 text-[10px] font-bold text-white">Selesai</span></div><p className="text-xs text-[#58635d]">Tiba pukul 08:30 WIB</p></div>
            </div>

            <div className="relative flex gap-4 pb-5">
              <span className="z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 border-[#087529] bg-[#bef2cf] text-[#087529]"><SprayCan className="size-5" /></span>
              <div><div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-extrabold text-[#087529]">Pembersihan</h3><span className="rounded-full bg-[#baf0cb] px-2 py-0.5 text-[10px] font-bold text-[#087529]">Berjalan</span></div><p className="max-w-xs text-xs leading-5 text-[#58635d]">Sedang dalam proses pembersihan unit.</p></div>
            </div>

            <div className="relative flex gap-4">
              <span className="z-10 grid size-12 shrink-0 place-items-center rounded-full bg-[#dcecf6] text-[#087529]"><CheckCircle2 className="size-5" /></span>
              <div className="pt-1"><h3 className="text-base font-extrabold text-[#087529]">Verifikasi &amp; Selesai</h3><p className="text-xs text-[#087529]">Belum Mulai</p></div>
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="rounded-[22px] border border-[#aebfae] bg-white p-5 shadow-sm">
            <span className="rounded-full bg-[#bfeecf] px-3 py-1 text-xs font-semibold text-[#55816a]">{report?.status ?? "Sedang Diproses"}</span>
            <div className="mt-4 flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e5f1e9] text-[#087529]"><MapPin className="size-5" /></span><div><h3 className="text-sm text-[#5e6963]">Lokasi Penjemputan</h3><p className="mt-2 text-xs font-bold">{report?.location ?? "Lokasi laporan"}</p><p className="mt-1 text-[10px] text-slate-500">{report?.district}</p></div></div>
            <p className="mt-5 flex items-center gap-2 text-xs font-bold text-[#087529]"><Clock3 className="size-3.5" /> Estimasi Tiba: 14 Menit</p>
          </section>

          <section className="rounded-[22px] border border-[#aebfae] bg-[#e8f6ff] p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#966000]"><Bot className="size-4" /> AI ANALYSIS RECAP</h3>
            <dl className="mt-4 space-y-3 text-xs"><div className="flex justify-between"><dt className="text-[#68736d]">Type</dt><dd className="rounded-full bg-[#ffdda9] px-3 py-1 font-bold">Large Trash Pile</dd></div><div className="flex justify-between"><dt className="text-[#68736d]">Volume</dt><dd className="font-extrabold">~6.5 Ton</dd></div><div className="flex justify-between"><dt className="text-[#68736d]">Priority</dt><dd className="font-extrabold text-red-600">! Tinggi</dd></div></dl>
            <Sparkles className="ml-auto mt-5 size-5 text-[#bc8a2f] opacity-50" />
          </section>
        </div>

        <section className="mt-6 overflow-hidden rounded-[22px] border border-[#aebfae] bg-white shadow-sm">
          <h2 className="bg-[#dcebf3] px-5 py-3 text-xs font-bold text-[#536159]">Detail Penugasan</h2>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div className="flex items-center gap-4 sm:border-r sm:border-[#b8c8bb]">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d9efe2] text-xs font-extrabold text-[#087529]">{officer.initials}</span>
              <div><p className="text-[9px] font-bold text-[#7b847f]">PETUGAS TERPILIH</p><h3 className="text-base font-extrabold">{officer?.name ?? "Petugas tidak ditemukan"}</h3><p className="text-xs text-[#188036]">{officer?.role}</p></div>
            </div>
            <div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e4f3e8] text-[#087529]"><Truck className="size-6" /></span><div><p className="text-[9px] font-bold text-[#7b847f]">ARMADA</p><h3 className="text-base font-extrabold">{vehicle ? `${vehicle.type} • ${vehicle.plate}` : "Armada tidak ditemukan"}</h3><p className="text-xs text-[#6f7873]">Kapasitas: {vehicle?.capacity ?? "—"}</p></div></div>
          </div>
        </section>

        <Link href="/dinas" className="mx-auto mt-10 flex max-w-[620px] items-center justify-center gap-3 rounded-full border-2 border-[#087529] py-2.5 text-sm font-extrabold text-[#087529] transition hover:bg-[#087529] hover:text-white"><Grid2X2 className="size-4" /> Kembali ke Dashboard</Link>
      </div>
    </main>
  );
}
