"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileWarning,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { DlhShell } from "./dlh-shell";
import { type DlhReport as Report, updateDlhStore, useDlhStore } from "@/lib/dlh-store";

type ReportStatus = "Menunggu" | "Diproses" | "Selesai";

const statusStyles: Record<ReportStatus, string> = {
  Menunggu: "bg-[#e6f2f8] text-[#4c5d54]",
  Diproses: "bg-[#d8f3e5] text-[#47705b]",
  Selesai: "bg-[#bfe4ca] text-[#087529]",
};

export function ReportsManagement() {
  const router = useRouter();
  const store = useDlhStore();
  const reports = store.reports;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"Semua" | ReportStatus>("Semua");
  const [date, setDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletedReportId, setDeletedReportId] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const setReports = (update: (current: Report[]) => Report[]) => updateDlhStore((draft) => { draft.reports = update(draft.reports); });

  const filtered = useMemo(() => reports.filter((report) => {
    const term = query.toLowerCase();
    const searchMatch = `${report.id} ${report.location} ${report.district}`.toLowerCase().includes(term);
    const statusMatch = status === "Semua" || report.status === status;
    const dateMatch = !date || report.isoDate === date;
    return searchMatch && statusMatch && dateMatch;
  }), [date, query, reports, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visibleReports = filtered.slice((page - 1) * perPage, page * perPage);
  const visibleSelected = visibleReports.length > 0 && visibleReports.every((report) => selectedIds.includes(report.id));

  const setFilter = (next: "Semua" | ReportStatus) => {
    setStatus(next);
    setPage(1);
  };

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") input.showPicker();
    else {
      input.focus();
      input.click();
    }
  };

  const formattedDate = date
    ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
    : "Pilih Tanggal";

  const toggleAll = () => {
    const visibleIds = visibleReports.map((report) => report.id);
    setSelectedIds((current) => visibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])]);
  };

  const toggleSelected = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const removeReport = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    const deletedId = pendingDeleteId;
    setReports((current) => current.filter((report) => report.id !== deletedId));
    setSelectedIds((current) => current.filter((item) => item !== deletedId));
    setPendingDeleteId(null);
    setDeletedReportId(deletedId);
  };

  const exportCsv = () => {
    const source = selectedIds.length ? filtered.filter((report) => selectedIds.includes(report.id)) : filtered;
    const rows = ["ID,Tanggal,Waktu,Lokasi,Kategori,Status", ...source.map((report) => `${report.id},${report.date} ${report.year},${report.time},${report.location},${report.category},${report.status}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "laporan-sampah-dlh.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#53635a]"><span>Dashboard</span><ChevronRight className="size-3" /><span>Kelola Laporan</span></div>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-[30px]">Manajemen Laporan Sampah</h2>
            </div>
            <button type="button" onClick={exportCsv} aria-label="Unduh laporan" className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#b8cbbd] bg-[#e8f5fc] text-[#3f5248] transition hover:bg-white"><Download className="size-5" /></button>
          </div>

          <section className="mt-6 flex flex-col gap-4 rounded-[24px] border border-[#b7cbbd] bg-white/55 p-4 lg:flex-row lg:items-center">
            <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-[#e8f6fd] px-5"><Search className="size-5 shrink-0 text-[#46594f]" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="w-full bg-transparent text-sm outline-none placeholder:text-[#7c8792]" placeholder="Cari ID Laporan, Lokasi, atau Petugas..." /></label>
            <div className="flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-bold text-[#46594f]">Filter Status:</span>{(["Semua", "Menunggu", "Diproses", "Selesai"] as const).map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${status === item ? "border-[#b4e4cb] bg-[#bcebd1] text-[#47705b]" : "border-[#b7c7bb] bg-white/40 text-[#536159] hover:bg-white"}`}>{item}</button>)}</div>
            <div className="hidden h-12 w-px bg-[#c5d1c8] lg:block" />
            <div className="relative flex items-center">
              <button type="button" onClick={openDatePicker} aria-label="Pilih tanggal laporan" className="flex h-11 items-center gap-2 rounded-full bg-[#e8f6fd] px-4 text-xs font-bold text-[#536159] transition hover:bg-[#dceff8]"><CalendarDays className="size-5" /><span>{formattedDate}</span><ChevronDown className="size-4" /></button>
              <input ref={dateInputRef} type="date" value={date} onChange={(event) => { setDate(event.target.value); setPage(1); }} className="pointer-events-none absolute bottom-0 left-1/2 size-px opacity-0" tabIndex={-1} aria-hidden="true" />
              {date && <button type="button" onClick={() => { setDate(""); setPage(1); }} aria-label="Hapus filter tanggal" className="ml-1 grid size-8 place-items-center rounded-full text-[#667169] hover:bg-white"><X className="size-4" /></button>}
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-[24px] border border-[#b7cbbd] bg-white/35">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead className="bg-[#deeff8] text-xs font-extrabold uppercase tracking-wide text-[#4c5d54]"><tr><th className="w-16 px-6 py-5"><input type="checkbox" checked={visibleSelected} onChange={toggleAll} className="size-5 accent-[#087529]" aria-label="Pilih semua laporan" /></th><th className="px-4 py-5">ID Laporan</th><th className="px-4 py-5">Tanggal</th><th className="px-4 py-5">Lokasi</th><th className="px-4 py-5">Kategori Sampah</th><th className="px-4 py-5">Status</th><th className="px-4 py-5 text-center">Aksi</th></tr></thead>
                <tbody>{visibleReports.map((report) => <tr key={report.id} className="border-t border-[#becdbf] text-sm"><td className="px-6 py-6"><input type="checkbox" checked={selectedIds.includes(report.id)} onChange={() => toggleSelected(report.id)} className="size-5 accent-[#087529]" aria-label={`Pilih ${report.id}`} /></td><td className="px-4 py-6 font-extrabold text-[#087529]">#{report.id}</td><td className="px-4 py-6"><p className="font-semibold">{report.date}<br />{report.year}</p><p className="text-xs text-[#68756e]">{report.time}</p></td><td className="px-4 py-6"><div className="flex items-start gap-3"><MapPin className="mt-1 size-5 shrink-0 text-[#087529]" /><div><p className="font-semibold">{report.location}</p><p className="text-xs text-[#68756e]">{report.district}</p></div></div></td><td className="px-4 py-6"><span className={`inline-block min-w-20 rounded-full px-3 py-1 text-center text-[10px] font-extrabold ${report.category === "BAHAYA" ? "bg-red-600 text-white" : "bg-[#bcebd1] text-[#47705b]"}`}>{report.category}</span></td><td className="px-4 py-6"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[report.status]}`}><span className={`size-2 rounded-full ${report.status === "Selesai" ? "bg-[#087529]" : "bg-[#698174]"}`} />{report.status}</span></td><td className="px-4 py-6"><div className="flex justify-center gap-4"><button type="button" onClick={() => router.push(`/dinas/reports/${report.id}`)} aria-label={`Lihat ${report.id}`} className="rounded-full p-2 text-[#46594f] hover:bg-[#deeff8]"><Eye className="size-5" /></button><button type="button" onClick={() => removeReport(report.id)} aria-label={`Hapus ${report.id}`} className="rounded-full p-2 text-red-600 hover:bg-red-50"><Trash2 className="size-5" /></button></div></td></tr>)}</tbody>
              </table>
              {!visibleReports.length && <div className="py-14 text-center text-sm text-[#68756e]">Tidak ada laporan yang cocok.</div>}
            </div>

            <footer className="flex flex-col gap-4 border-t border-[#becdbf] px-6 py-4 text-xs text-[#536159] sm:flex-row sm:items-center"><p>Menampilkan {filtered.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} dari {filtered.length || 0} laporan</p><div className="ml-auto flex items-center gap-3"><label className="flex items-center gap-2">Baris per halaman:<select value={perPage} onChange={(event) => { setPerPage(Number(event.target.value)); setPage(1); }} className="rounded-full border border-[#b7c7bb] bg-[#edf7fb] px-3 py-1.5 outline-none"><option value="5">5</option><option value="10">10</option></select></label><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-full p-2 disabled:opacity-30"><ChevronLeft className="size-4" /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button type="button" key={item} onClick={() => setPage(item)} className={`grid size-8 place-items-center rounded-full font-bold ${page === item ? "bg-[#087529] text-white" : "hover:bg-[#e2f2ea]"}`}>{item}</button>)}<button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-full p-2 disabled:opacity-30"><ChevronRight className="size-4" /></button></div></footer>
          </section>

          <div className="mt-6 grid gap-4 md:grid-cols-3"><div className="flex items-center gap-4 rounded-[22px] border border-[#b7cbbd] bg-[#e7f5fc] p-5"><span className="grid size-12 place-items-center rounded-2xl bg-[#d4ecec] text-[#087529]"><FileWarning className="size-5" /></span><div><p className="text-xs text-[#68756e]">Laporan Masuk</p><p className="text-2xl font-extrabold">{reports.length}</p></div></div><div className="flex items-center gap-4 rounded-[22px] border border-[#b7cbbd] bg-[#e7f5fc] p-5"><span className="grid size-12 place-items-center rounded-2xl bg-[#bcebd1] text-[#47705b]"><RefreshCw className="size-5" /></span><div><p className="text-xs text-[#68756e]">Sedang Diproses</p><p className="text-2xl font-extrabold">{reports.filter((report) => report.status === "Diproses").length}</p></div></div><div className="flex items-center gap-4 rounded-[22px] border border-[#b7cbbd] bg-[#e7f5fc] p-5"><span className="grid size-12 place-items-center rounded-2xl bg-[#258237] text-white"><CheckCircle2 className="size-5" /></span><div><p className="text-xs text-[#68756e]">Terselesaikan</p><p className="text-2xl font-extrabold">{reports.filter((report) => report.status === "Selesai").length}</p></div></div></div>
        </div>
      </main>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-[#26363d]/45 p-4 backdrop-blur-[3px]" role="presentation">
          <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-delete-title" className="w-full max-w-[380px] rounded-[24px] bg-white px-6 py-7 text-center shadow-2xl">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffd8d5] text-[#b60e18]">
              <Trash2 className="size-8" strokeWidth={2.5} />
            </div>
            <h2 id="confirm-delete-title" className="mt-5 text-lg font-extrabold text-[#26312a]">Hapus laporan?</h2>
            <p className="mx-auto mt-2 max-w-[310px] text-sm leading-relaxed text-[#667169]">
              Laporan <span className="font-bold text-[#c51c21]">#{pendingDeleteId}</span> akan dihapus permanen dan tidak dapat dikembalikan.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" autoFocus onClick={() => setPendingDeleteId(null)} className="h-11 rounded-xl border border-[#b9c7be] bg-white text-sm font-bold text-[#465148] transition hover:bg-slate-50">Batal</button>
              <button type="button" onClick={confirmDelete} className="h-11 rounded-xl bg-[#c7191d] text-sm font-bold text-white transition hover:bg-[#aa1116]">Hapus</button>
            </div>
          </section>
        </div>
      )}

      {deletedReportId && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-[#26363d]/45 p-4 backdrop-blur-[3px]" role="presentation">
          <section role="alertdialog" aria-modal="true" aria-labelledby="deleted-report-title" className="w-full max-w-[380px] rounded-[24px] bg-white px-6 py-7 text-center shadow-2xl">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffd8d5] text-[#a6000d]">
              <span className="relative">
                <Trash2 className="size-8 fill-current" strokeWidth={2.5} />
                <X className="absolute left-1/2 top-[46%] size-4 -translate-x-1/2 -translate-y-1/2 text-white" strokeWidth={4} />
              </span>
            </div>
            <p id="deleted-report-title" className="mx-auto mt-6 max-w-[320px] text-sm font-medium leading-relaxed text-[#465148]">
              Data laporan <span className="text-[#c51c21]">#{deletedReportId}</span> telah dihapus<br className="hidden sm:block" /> permanen dari sistem operasional.
            </p>
            <button type="button" autoFocus onClick={() => setDeletedReportId(null)} className="mt-6 h-11 w-full rounded-xl bg-[#c7191d] text-sm font-semibold text-white transition hover:bg-[#aa1116] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-red-200">
              Tutup
            </button>
          </section>
        </div>
      )}
    </DlhShell>
  );
}
