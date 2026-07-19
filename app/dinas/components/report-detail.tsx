"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  Clock3,
  MapPin,
  Save,
  X,
} from "lucide-react";
import { DlhShell } from "./dlh-shell";
import { updateDlhStore, useDlhStore } from "@/lib/dlh-store";

const timeline = [
  ["Dilaporkan", "09:15 WIB"],
  ["Verifikasi AI", "09:16 WIB"],
  ["Penugasan", "09:40 WIB"],
  ["Menuju Lokasi", "09:50 WIB"],
  ["Proses Pembersihan", "10:30 WIB"],
  ["Selesai", "11:15 WIB"],
];

function LocationMap() {
  return (
    <div className="relative h-[230px] overflow-hidden bg-[#d9f1f7] sm:h-[270px]">
      <div className="absolute -left-10 top-7 h-7 w-[115%] -rotate-6 bg-white shadow-[0_0_0_3px_#bed6df]" />
      <div className="absolute -left-14 bottom-12 h-8 w-[120%] rotate-3 bg-white shadow-[0_0_0_3px_#c4d8df]" />
      <div className="absolute left-[16%] -top-10 h-[150%] w-8 rotate-[27deg] bg-white shadow-[0_0_0_3px_#c4d8df]" />
      <div className="absolute right-[18%] -top-10 h-[150%] w-7 -rotate-[18deg] bg-white shadow-[0_0_0_3px_#c4d8df]" />
      <div className="absolute left-[36%] top-[10%] h-28 w-44 rounded-[45%] bg-[#cde9c8] opacity-80" />
      <div className="absolute right-[8%] top-[18%] h-24 w-32 rounded-[45%] bg-[#cde9c8] opacity-80" />
      <span className="absolute left-[9%] top-[18%] rotate-[-6deg] text-xs font-bold text-[#6c8790]">Jl. Kebon Sirih</span>
      <span className="absolute bottom-[18%] right-[12%] rotate-[3deg] text-xs font-bold text-[#6c8790]">Jl. M.H. Thamrin</span>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-extrabold text-[#48715f]">MENTENG</span>
      <span className="absolute left-[56%] top-[47%] grid size-10 place-items-center rounded-full border-4 border-white bg-[#087529] text-white shadow-lg"><MapPin className="size-5" fill="currentColor" /></span>
      <div className="absolute inset-x-0 bottom-0 h-10 bg-[#72d1e9]/45" />
    </div>
  );
}

export function ReportDetail({ reportId }: { reportId: string }) {
  const router = useRouter();
  const store = useDlhStore();
  const report = store.reports.find((item) => item.id === reportId) ?? store.reports[0];
  const detail = { reporter: report.reporter, time: report.time, address: report.location, district: report.district };
  const [updateOpen, setUpdateOpen] = useState(false);
  const [status, setStatus] = useState(report.status);
  const [notes, setNotes] = useState(report.notes ?? "");
  const [notice, setNotice] = useState("");

  const saveUpdate = () => {
    updateDlhStore((draft) => {
      const target = draft.reports.find((item) => item.id === reportId);
      if (!target) return;
      target.status = status;
      target.notes = notes;
    });
    setUpdateOpen(false);
    setNotice(`Laporan berhasil diperbarui menjadi ${status}.`);
  };

  return (
    <DlhShell hideHeader>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f4fbff] px-4 pb-10 pt-8 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex items-start gap-4">
            <button type="button" onClick={() => router.push("/dinas/reports")} aria-label="Kembali ke kelola laporan" className="mt-1 grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-white"><ArrowLeft className="size-6" /></button>
            <div>
              <h1 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-[30px]">Laporan #{reportId}</h1>
              <p className="mt-1 text-sm text-[#77837b] sm:text-base">Detail operasional penanganan sampah</p>
            </div>
          </div>

          {notice && <div role="status" className="mt-5 flex items-center rounded-2xl bg-[#d9f3e4] px-4 py-3 text-sm font-bold text-[#176a35]"><Check className="mr-2 size-4" />{notice}<button type="button" onClick={() => setNotice("")} className="ml-auto rounded-full p-1 hover:bg-white/60"><X className="size-4" /></button></div>}

          <section className="mt-8 grid gap-5 rounded-[20px] border border-[#bdcdbf] bg-white px-6 py-5 shadow-sm sm:grid-cols-3">
            <div><p className="text-xs font-semibold text-[#7a877f]">Pelapor</p><p className="mt-1 text-lg font-extrabold">{detail.reporter}</p></div>
            <div><p className="text-xs font-semibold text-[#7a877f]">Jam Laporan</p><p className="mt-1 text-lg font-extrabold">{detail.time}</p></div>
            <div><p className="text-xs font-semibold text-[#7a877f]">Alamat</p><p className="mt-1 text-base font-extrabold leading-6">{detail.address}</p></div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(280px,0.95fr)]">
            <section className="overflow-hidden rounded-[22px] border border-[#bdcdbf] bg-white shadow-sm">
              <div className="flex h-14 items-center gap-2 bg-[#e7f6fd] px-5"><Camera className="size-5" /><h2 className="text-lg font-extrabold">Foto Laporan Warga</h2></div>
              <div className="relative aspect-[1.55/1] min-h-[330px] overflow-hidden bg-slate-200 sm:aspect-[1.65/1]">
                <Image src="/images/dlh-dashboard-reference.png" alt="Tumpukan sampah dari laporan warga" width={1444} height={1028} priority className="absolute left-[-173%] top-[-58.3%] h-auto w-[278.2%] max-w-none" />
                <div className="absolute bottom-6 left-6 rounded-2xl bg-white/80 px-5 py-3 shadow-lg backdrop-blur-sm">
                  <p className="text-[11px] font-extrabold tracking-wide text-[#647169]">TIMESTAMP</p>
                  <p className="mt-1 text-sm font-semibold sm:text-base">24 Mei 2024, 09:12:44 GMT+7</p>
                </div>
              </div>
            </section>

            <section className="rounded-[22px] border border-[#bdcdbf] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3"><Clock3 className="mt-1 size-6 shrink-0 text-[#087529]" /><h2 className="text-xl font-extrabold leading-tight">Estimasi<br />Penanganan</h2><p className="ml-auto text-right text-lg font-extrabold text-[#087529]">~120<br />Menit</p></div>
              <ol className="mt-7 pl-1">
                {timeline.map(([label, time], index) => (
                  <li key={label} className="relative flex min-h-[68px] gap-4 last:min-h-0">
                    {index < timeline.length - 1 && <span className="absolute left-[15px] top-8 h-[37px] w-px bg-[#bdcdbf]" />}
                    <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 border-white bg-[#087529] text-white shadow-sm"><Check className="size-4" strokeWidth={3} /></span>
                    <div><p className="font-extrabold">{label}</p><p className="text-xs text-[#7a877f]">{time}</p></div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="mt-7 overflow-hidden rounded-[22px] border border-[#bdcdbf] bg-white shadow-sm">
            <div className="flex h-14 items-center gap-2 bg-[#e7f6fd] px-5"><MapPin className="size-5" /><h2 className="text-lg font-extrabold">Koordinat Lokasi</h2></div>
            <LocationMap />
            <div className="px-5 py-4"><p className="font-extrabold">{detail.address}</p><p className="mt-1 text-xs text-[#66746c]">{detail.district}</p></div>
          </section>

          <div className="mt-8 flex justify-end">
            <button type="button" onClick={() => setUpdateOpen(true)} className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#087529] px-8 font-extrabold text-white shadow-[0_8px_16px_rgba(8,117,41,0.18)] transition hover:bg-[#066321] sm:w-[310px]"><Save className="size-5" />Perbarui Laporan</button>
          </div>
        </div>
      </main>

      {updateOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-4">
          <form onSubmit={(event) => { event.preventDefault(); saveUpdate(); }} className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center"><div><p className="text-xs font-extrabold text-[#087529]">PERBARUI LAPORAN</p><h2 className="mt-1 text-xl font-extrabold">#{reportId}</h2></div><button type="button" onClick={() => setUpdateOpen(false)} className="ml-auto rounded-full p-2 hover:bg-slate-100" aria-label="Tutup"><X className="size-5" /></button></div>
            <label className="mt-6 block text-sm font-bold">Status Penanganan<select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="mt-2 h-12 w-full rounded-2xl border border-[#bdcdbf] bg-[#f5fbfe] px-4 outline-none focus:border-[#087529]"><option>Menunggu</option><option>Diproses</option><option>Selesai</option></select></label>
            <label className="mt-4 block text-sm font-bold">Catatan<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Tambahkan catatan operasional..." className="mt-2 w-full resize-none rounded-2xl border border-[#bdcdbf] bg-[#f5fbfe] p-4 outline-none placeholder:text-[#89958e] focus:border-[#087529]" /></label>
            <button type="submit" className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#087529] font-extrabold text-white hover:bg-[#066321]"><Save className="size-4" />Simpan Perubahan</button>
          </form>
        </div>
      )}
    </DlhShell>
  );
}
