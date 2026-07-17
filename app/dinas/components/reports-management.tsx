"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, Clock3, Download, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { DlhShell } from "./dlh-shell";

type ReportStatus = "Baru" | "Ditugaskan" | "Selesai";
type Report = { id: string; location: string; district: string; category: string; time: string; priority: "Tinggi" | "Sedang" | "Rendah"; status: ReportStatus };

const initialReports: Report[] = [
  { id: "WL-099", location: "Jl. H. Agus Salim No. 28", district: "Menteng", category: "Tumpukan besar", time: "8 menit lalu", priority: "Tinggi", status: "Baru" },
  { id: "WL-098", location: "Jl. Kramat Raya No. 19", district: "Senen", category: "Sampah campuran", time: "21 menit lalu", priority: "Tinggi", status: "Ditugaskan" },
  { id: "WL-097", location: "Jl. Tanah Abang II", district: "Gambir", category: "Limbah rumah tangga", time: "43 menit lalu", priority: "Sedang", status: "Baru" },
  { id: "WL-096", location: "Jl. Percetakan Negara", district: "Cempaka Putih", category: "Sampah organik", time: "1 jam lalu", priority: "Rendah", status: "Selesai" },
  { id: "WL-095", location: "Jl. Bendungan Hilir", district: "Tanah Abang", category: "Tumpukan sedang", time: "2 jam lalu", priority: "Sedang", status: "Ditugaskan" },
];

const statusStyle: Record<ReportStatus, string> = {
  Baru: "bg-amber-100 text-amber-700",
  Ditugaskan: "bg-blue-100 text-blue-700",
  Selesai: "bg-emerald-100 text-emerald-700",
};

function nextStatus(status: ReportStatus): ReportStatus {
  if (status === "Baru") return "Ditugaskan";
  return "Selesai";
}

export function ReportsManagement() {
  const [reports, setReports] = useState(initialReports);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Semua" | ReportStatus>("Semua");
  const [selected, setSelected] = useState<Report | null>(null);

  const filtered = useMemo(() => reports.filter((report) => {
    const matchesFilter = filter === "Semua" || report.status === filter;
    const term = query.toLowerCase();
    return matchesFilter && `${report.id} ${report.location} ${report.district}`.toLowerCase().includes(term);
  }), [filter, query, reports]);

  const updateStatus = (id: string) => {
    setReports((items) => items.map((item) => item.id === id ? { ...item, status: nextStatus(item.status) } : item));
    setSelected((item) => item?.id === id ? { ...item, status: nextStatus(item.status) } : item);
  };

  const exportCsv = () => {
    const rows = ["ID,Lokasi,Kecamatan,Kategori,Prioritas,Status", ...filtered.map((item) => `${item.id},${item.location},${item.district},${item.category},${item.priority},${item.status}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "laporan-dlh.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#39815a]">Operations Center</p><h2 className="mt-1 text-2xl font-extrabold">Kelola Laporan</h2><p className="mt-1 text-sm text-slate-500">Pantau dan tindak lanjuti laporan warga.</p></div>
            <button type="button" onClick={exportCsv} className="flex items-center justify-center gap-2 rounded-full border border-[#bdd0c4] bg-white px-5 py-3 text-sm font-bold hover:bg-[#edf8f2]"><Download className="size-4" /> Ekspor CSV</button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {(["Baru", "Ditugaskan", "Selesai"] as ReportStatus[]).map((status) => <div key={status} className="rounded-2xl border border-[#d8e7df] bg-white p-5"><p className="text-sm text-slate-500">{status}</p><p className="mt-2 text-3xl font-extrabold text-[#096a28]">{reports.filter((item) => item.status === status).length}</p></div>)}
          </div>

          <div className="mt-6 rounded-3xl border border-[#d8e7df] bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 md:flex-row">
              <label className="flex flex-1 items-center gap-3 rounded-full border border-[#c5d2cb] px-4"><Search className="size-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full bg-transparent text-sm outline-none" placeholder="Cari ID, lokasi, atau kecamatan" /></label>
              <div className="flex items-center gap-2 overflow-x-auto"><SlidersHorizontal className="size-4 shrink-0 text-slate-400" />{(["Semua", "Baru", "Ditugaskan", "Selesai"] as const).map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${filter === item ? "bg-[#087529] text-white" : "bg-[#edf4f0] text-[#52645a]"}`}>{item}</button>)}</div>
            </div>

            <div className="mt-5 space-y-3">
              {filtered.map((report) => (
                <button type="button" key={report.id} onClick={() => setSelected(report)} className="grid w-full gap-3 rounded-2xl border border-[#e0ebe5] p-4 text-left transition hover:border-[#8fc9a7] hover:bg-[#f7fcf9] md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div className="flex min-w-0 gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e4f6ec] text-[#087529]"><MapPin className="size-5" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-extrabold">#{report.id}</p><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${report.priority === "Tinggi" ? "bg-red-100 text-red-700" : report.priority === "Sedang" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{report.priority}</span></div><p className="truncate text-sm font-semibold text-slate-700">{report.location}</p><p className="mt-1 text-xs text-slate-400">{report.district} • {report.category} • {report.time}</p></div></div>
                  <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle[report.status]}`}>{report.status}</span><ChevronRight className="hidden size-5 text-slate-400 md:block" />
                </button>
              ))}
              {!filtered.length && <div className="py-12 text-center text-sm text-slate-500">Tidak ada laporan yang cocok.</div>}
            </div>
          </div>
        </div>
      </main>

      {selected && <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/45 p-4"><div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start"><div><p className="text-xs font-bold text-[#087529]">DETAIL LAPORAN</p><h3 className="mt-1 text-xl font-extrabold">#{selected.id}</h3></div><button type="button" onClick={() => setSelected(null)} className="ml-auto rounded-full p-2 hover:bg-slate-100"><X className="size-5" /></button></div><div className="mt-5 rounded-2xl bg-[#eef9f3] p-5"><p className="font-bold">{selected.location}</p><p className="mt-1 text-sm text-slate-500">{selected.district} • {selected.category}</p></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl border p-4"><p className="text-slate-400">Prioritas</p><p className="mt-1 font-extrabold">{selected.priority}</p></div><div className="rounded-2xl border p-4"><p className="text-slate-400">Status</p><p className="mt-1 font-extrabold">{selected.status}</p></div></div><button type="button" disabled={selected.status === "Selesai"} onClick={() => updateStatus(selected.id)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#087529] py-3.5 text-sm font-extrabold text-white disabled:bg-slate-300">{selected.status === "Baru" ? <Clock3 className="size-5" /> : <CheckCircle2 className="size-5" />}{selected.status === "Baru" ? "Tandai Sudah Ditugaskan" : selected.status === "Ditugaskan" ? "Selesaikan Laporan" : "Laporan Selesai"}</button></div></div>}
    </DlhShell>
  );
}
