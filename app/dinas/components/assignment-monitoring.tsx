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

const vehicleNames: Record<string, { name: string; capacity: string }> = {
  "truck-01": { name: "Truk Sampah 01", capacity: "10 Ton" },
  "truck-05": { name: "Truk Sampah 05", capacity: "5 Ton" },
};

const officerNames: Record<string, { name: string; role: string; initials: string }> = {
  budi: { name: "Budi Santoso", role: "Senior Operasional", initials: "BS" },
  siti: { name: "Siti Aminah", role: "Petugas Lapangan", initials: "SA" },
};

export function AssignmentMonitoring({ reportId }: { reportId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicle = vehicleNames[searchParams.get("vehicle") ?? ""] ?? vehicleNames["truck-01"];
  const officer = officerNames[searchParams.get("officer") ?? ""] ?? officerNames.budi;

  return (
    <main className="min-h-dvh bg-[#f2f9fe] text-[#17231d]">
      <header className="flex h-[72px] items-center border-b border-[#bccdbf] px-5 sm:px-8">
        <button type="button" onClick={() => router.back()} aria-label="Kembali" className="rounded-full p-2 transition hover:bg-white">
          <ArrowLeft className="size-6" />
        </button>
        <span className="ml-auto hidden text-xs font-bold text-[#68776f] sm:block">Penugasan #{reportId}</span>
      </header>

      <div className="mx-auto max-w-[900px] px-4 pb-16 pt-4 sm:px-6 sm:pt-5">
        <section className="text-center">
          <div className="mx-auto grid size-[74px] place-items-center rounded-full bg-[#258237] text-[#d8ffdd] shadow-sm">
            <span className="grid size-9 place-items-center rounded-full bg-[#c8f6cf]"><Check className="size-6 text-[#258237]" strokeWidth={3} /></span>
          </div>
          <h1 className="mt-5 text-xl font-extrabold tracking-[-0.025em] sm:text-[26px]">Penugasan Armada &amp; Petugas Berhasil</h1>
          <p className="mt-2 text-sm text-[#66736c] sm:text-base">Instruksi kerja telah dikirimkan ke perangkat petugas lapangan.</p>
        </section>

        <section className="mt-10 rounded-[26px] border border-[#aebfae] bg-white px-6 py-6 shadow-sm sm:px-8">
          <h2 className="text-lg font-extrabold">Status Monitoring Tugas</h2>
          <div className="relative mt-7 space-y-0">
            <div className="absolute bottom-8 left-7 top-7 w-px bg-[#9fc8a5]" />

            <div className="relative flex gap-5 pb-6">
              <span className="z-10 grid size-14 shrink-0 place-items-center rounded-full bg-[#087529] text-white"><Route className="size-6" /></span>
              <div className="pt-2"><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-extrabold text-[#087529]">Menuju Lokasi</h3><span className="rounded-full bg-[#087529] px-2.5 py-1 text-[10px] font-bold text-white">Selesai</span></div><p className="text-sm text-[#58635d]">Tiba pukul 08:30 WIB</p></div>
            </div>

            <div className="relative flex gap-5 pb-6">
              <span className="z-10 grid size-14 shrink-0 place-items-center rounded-full border-2 border-[#087529] bg-[#bef2cf] text-[#087529]"><SprayCan className="size-6" /></span>
              <div className="pt-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-extrabold text-[#087529]">Pembersihan</h3><span className="rounded-full bg-[#baf0cb] px-2.5 py-1 text-[10px] font-bold text-[#087529]">Berjalan</span></div><p className="max-w-xs text-sm leading-5 text-[#58635d]">Sedang dalam proses pembersihan unit.</p></div>
            </div>

            <div className="relative flex gap-5">
              <span className="z-10 grid size-14 shrink-0 place-items-center rounded-full bg-[#dcecf6] text-[#087529]"><CheckCircle2 className="size-6" /></span>
              <div className="pt-2"><h3 className="text-lg font-extrabold text-[#087529]">Verifikasi &amp; Selesai</h3><p className="text-sm text-[#087529]">Belum Mulai</p></div>
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="rounded-[26px] border border-[#aebfae] bg-white p-6 shadow-sm">
            <span className="rounded-full bg-[#bfeecf] px-3 py-1 text-xs font-semibold text-[#55816a]">Sedang Diproses</span>
            <div className="mt-5 flex gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e5f1e9] text-[#087529]"><MapPin className="size-6" /></span><div><h3 className="text-base text-[#5e6963]">Daftar Lokasi Penjemputan</h3><ul className="mt-2 space-y-2 text-sm"><li><b className="text-[#087529]">●</b> &nbsp;Jl. KHZ Mustofa <span className="text-xs text-slate-500">(08:00 WIB)</span></li><li><b className="text-[#087529]">●</b> &nbsp;Pasar Pancasila <span className="text-xs text-slate-500">(13:00 WIB)</span></li><li><b className="text-[#087529]">●</b> &nbsp;Jl. BKR <span className="text-xs text-slate-500">(16:30 WIB)</span></li></ul></div></div>
            <p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#087529]"><Clock3 className="size-4" /> Estimasi Tiba: 14 Menit</p>
          </section>

          <section className="rounded-[26px] border border-[#aebfae] bg-[#e8f6ff] p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-[#966000]"><Bot className="size-5" /> AI ANALYSIS RECAP</h3>
            <dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><dt className="text-[#68736d]">Type</dt><dd className="rounded-full bg-[#ffdda9] px-3 py-1 font-bold">Large Trash Pile</dd></div><div className="flex justify-between"><dt className="text-[#68736d]">Volume</dt><dd className="font-extrabold">~6.5 Ton</dd></div><div className="flex justify-between"><dt className="text-[#68736d]">Priority</dt><dd className="font-extrabold text-red-600">! Tinggi</dd></div></dl>
            <Sparkles className="ml-auto mt-8 size-6 text-[#bc8a2f] opacity-50" />
          </section>
        </div>

        <section className="mt-8 overflow-hidden rounded-[26px] border border-[#aebfae] bg-white shadow-sm">
          <h2 className="bg-[#dcebf3] px-6 py-4 text-sm font-bold text-[#536159]">Detail Penugasan</h2>
          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div className="flex items-center gap-4 sm:border-r sm:border-[#b8c8bb]">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#d9efe2] text-sm font-extrabold text-[#087529]">{officer.initials}</span>
              <div><p className="text-[10px] font-bold text-[#7b847f]">PETUGAS TERPILIH</p><h3 className="text-lg font-extrabold">{officer.name}</h3><p className="text-sm text-[#188036]">{officer.role}</p></div>
            </div>
            <div className="flex items-center gap-4"><span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e4f3e8] text-[#087529]"><Truck className="size-7" /></span><div><p className="text-[10px] font-bold text-[#7b847f]">ARMADA</p><h3 className="text-lg font-extrabold">{vehicle.name}</h3><p className="text-sm text-[#6f7873]">Kapasitas: {vehicle.capacity}</p></div></div>
          </div>
        </section>

        <Link href="/dinas" className="mx-auto mt-14 flex max-w-[710px] items-center justify-center gap-3 rounded-full border-2 border-[#087529] py-3 text-base font-extrabold text-[#087529] transition hover:bg-[#087529] hover:text-white"><Grid2X2 className="size-5" /> Kembali ke Dashboard</Link>
      </div>
    </main>
  );
}
