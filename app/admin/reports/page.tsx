"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Filter, ArrowUpDown, MapPin, Eye, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import type { Report, Pagination } from "../types/reports";
import { useReports } from "../hooks/useReports";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  DIJEMPUT: "Diproses",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-50 border-amber-100",
  DIJEMPUT: "text-blue-600 bg-blue-50 border-blue-100",
  SELESAI: "text-emerald-600 bg-emerald-50 border-emerald-100",
  DIBATALKAN: "text-red-600 bg-red-50 border-red-100",
};

export default function AdminReportsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useReports(page, statusFilter);

  const reports = data?.items ?? [];
  const pagination = data?.pagination as Pagination | undefined;

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = reports.filter((r) => {
    const term = searchQuery.toLowerCase();
    return (
      r.id.includes(term) ||
      r.user?.nama.toLowerCase().includes(term) ||
      r.kategori_ukuran.toLowerCase().includes(term)
    );
  });

  const exportCSV = () => {
    const headers = ["ID Laporan", "Pelapor", "Kategori Ukuran", "Status", "Lokasi", "Waktu"];
    const rows = filteredReports.map((r) => [
      `#WL-${r.id.slice(0, 5).toUpperCase()}`,
      r.user?.nama || "Unknown",
      r.kategori_ukuran,
      STATUS_LABELS[r.status] || r.status,
      `${r.lokasi_lat.toFixed(4)}, ${r.lokasi_lng.toFixed(4)}`,
      new Date(r.createdAt).toLocaleString("id-ID"),
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Audit_Logs_Laporan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit log laporan diekspor!");
  };

  return (
    <div className="bg-[#FAF9F5] p-8 text-neutral-800 select-none pb-24">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1E7D38] tracking-tight">Riwayat Laporan</h1>
          <p className="text-xs text-gray-500 font-bold mt-1">Audit log global pembuangan sampah WasteLens.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari ID atau Pelapor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] shadow-sm w-44 md:w-56"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            onClick={exportCSV}
            className="bg-[#1E7D38] hover:bg-[#18652d] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all duration-200"
          >
            <Download className="w-3.5 h-3.5" />
            Download Report
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200/80 mb-6">
        <button
          onClick={() => router.push("/admin/reports")}
          className="px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 border-[#1E7D38] text-[#1E7D38]"
        >
          Riwayat Laporan
        </button>
        <button
          onClick={() => router.push("/admin/transactions/coins")}
          className="px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 border-transparent text-gray-400 hover:text-gray-600"
        >
          Riwayat Transaksi
        </button>
        <button
          onClick={() => router.push("/admin/transactions/products")}
          className="px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 border-transparent text-gray-400 hover:text-gray-600"
        >
          Riwayat Penukaran
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Laporan Hari Ini</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-805">1,284</span>
            <span className="text-[10px] text-[#287A38] font-bold">▲ +12%</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Laporan Diproses</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-850">432</span>
            <span className="text-[10px] text-blue-500 font-bold">Stable</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Waktu Resolusi Rata-rata</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-850">1.4h</span>
            <span className="text-[10px] text-[#C55D2D] font-bold">▼ -8%</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Skor Kepuasan Audit</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-850">98.2%</span>
            <span className="bg-emerald-50 text-[#287A38] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Perfect</span>
          </div>
        </div>

      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-6 min-h-[300px]">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-gray-800">Log Aktivitas Terkini</h3>
            <span className="bg-emerald-50 text-[#1E7D38] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              LIVE FEED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-[#FAF9F5] border border-gray-150 rounded-xl py-2 px-3 pl-8 text-xs font-bold text-gray-600 focus:outline-none appearance-none cursor-pointer pr-6"
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="DIJEMPUT">Diproses</option>
                <option value="SELESAI">Selesai</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={exportCSV}
              className="bg-[#FAF9F5] border border-gray-150 text-gray-600 hover:bg-gray-100 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort
            </button>
            <button
              onClick={exportCSV}
              className="bg-[#1E7D38] hover:bg-[#18652d] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              Ekspor CSV
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#1E7D38] animate-spin" />
            <p className="text-xs text-gray-400 font-bold">Memuat log aktivitas...</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
                    <th className="pb-3 pt-1">ID Laporan</th>
                    <th className="pb-3 pt-1">Waktu</th>
                    <th className="pb-3 pt-1">Pelapor</th>
                    <th className="pb-3 pt-1">Titik Lokasi</th>
                    <th className="pb-3 pt-1">Jenis Sampah</th>
                    <th className="pb-3 pt-1">Status</th>
                    <th className="pb-3 pt-1 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-400 font-bold">
                        Tidak ada log laporan tersedia
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((r) => {
                      const formattedTime = new Date(r.createdAt).toLocaleString("id-ID", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      });
                      return (
                        <tr key={r.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                          <td className="py-3.5 font-mono text-[#1E7D38] font-black">
                            #WL-{r.id.slice(0, 5).toUpperCase()}
                          </td>
                          <td className="py-3.5 text-gray-500 font-bold">
                            {formattedTime}
                          </td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#1E7D38] flex items-center justify-center font-bold text-[10px]">
                                {(r.user?.nama ?? "A").slice(0,2).toUpperCase()}
                              </div>
                              <div className="font-bold text-gray-800">{r.user?.nama || "Warga"}</div>
                            </div>
                          </td>
                          <td className="py-3.5 text-gray-600 font-bold max-w-[180px] truncate">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                              {r.lokasi_lat.toFixed(4)}, {r.lokasi_lng.toFixed(4)}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className="bg-[#EBEFFB] text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px] capitalize">
                              {r.kategori_ukuran}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${STATUS_COLORS[r.status] ?? ""}`}>
                              {STATUS_LABELS[r.status] ?? r.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => router.push(`/admin/reports/detail/${r.id}`)}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 mx-auto cursor-pointer"
                              title="Lihat Detail Audit"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400">
                  Menampilkan 5 dari {pagination.total} laporan
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="w-8 h-8 rounded-lg border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    ‹
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg font-black text-xs transition border ${
                        p === page
                          ? "bg-[#1E7D38] border-[#1E7D38] text-white shadow-sm"
                          : "bg-white border-gray-150 text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="w-8 h-8 rounded-lg border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider">Peta Sebaran Laporan</h4>
            <span className="text-xs font-bold text-[#1E7D38] hover:underline cursor-pointer">Buka Map</span>
          </div>
          <div className="w-full h-52 bg-slate-100 rounded-2xl overflow-hidden border border-gray-100 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
              alt="Jakarta Map Sebaran"
              className="w-full h-full object-cover filter brightness-95 opacity-80"
            />
            <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-[#1E7D38] border-2 border-white animate-ping" />
            <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-[#1E7D38] border-2 border-white shadow-lg" />
            <div className="absolute top-1/2 left-2/3 w-3 h-3 rounded-full bg-[#1E7D38] border-2 border-white shadow-lg" />
            <div className="absolute top-2/3 left-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-lg" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider">Distribusi Jenis Sampah</h4>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1E7D38" strokeWidth="12" strokeDasharray="251" strokeDashoffset="70" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0D631B" strokeWidth="12" strokeDasharray="251" strokeDashoffset="210" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#C55D2D" strokeWidth="12" strokeDasharray="251" strokeDashoffset="238" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E5E7EB" strokeWidth="12" strokeDasharray="251" strokeDashoffset="248" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-gray-805">72%</span>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Organik</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E7D38]" />
                  <span className="text-xs font-bold text-gray-800">Organik (72%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D631B]" />
                  <span className="text-xs font-bold text-gray-800">Anorganik (18%)</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C55D2D]" />
                  <span className="text-xs font-bold text-gray-800">B3 (6%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  <span className="text-xs font-bold text-gray-800">Residu (4%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <button
        onClick={() => alert("Asisten AI Audit sedang menganalisis log. Hubungi petugas jika ada anomali.")}
        className="fixed bottom-6 right-6 bg-[#007F5F] hover:bg-[#006442] active:scale-95 text-white font-black text-xs py-3.5 px-5 rounded-full shadow-xl hover:shadow-2xl flex items-center gap-1.5 transition-all duration-200 z-40"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        Tanya AI Audit
      </button>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl border border-gray-100 relative space-y-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${STATUS_COLORS[selectedReport.status]}`}>
                {STATUS_LABELS[selectedReport.status] ?? selectedReport.status}
              </span>
              <h3 className="text-lg font-black text-gray-850 mt-1.5">Laporan #WL-{selectedReport.id.slice(0, 5).toUpperCase()}</h3>
              <p className="text-[10px] text-gray-400 font-bold">Dilaporkan pada {new Date(selectedReport.createdAt).toLocaleString("id-ID")}</p>
            </div>

            {selectedReport.foto && selectedReport.foto.length > 0 && (
              <div className="w-full h-40 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedReport.foto[0].url}
                  alt="Sampah Warga"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Pelapor</span>
                <p className="text-gray-800">{selectedReport.user?.nama || "Warga"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Ukuran</span>
                <p className="text-gray-800 capitalize">{selectedReport.kategori_ukuran}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Titik Koordinat</span>
                <p className="text-gray-800 font-mono">{selectedReport.lokasi_lat.toFixed(6)}, {selectedReport.lokasi_lng.toFixed(6)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Dinas Pelaksana</span>
                <p className="text-gray-800">{selectedReport.dinas?.nama_dinas ?? "Menunggu Penugasan"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Armada</span>
                <p className="text-gray-800 capitalize">{selectedReport.kendaraan?.jenis ?? "Belum ditentukan"}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => router.push(`/user/history/report/${selectedReport.id}`)}
                className="w-full bg-[#1E7D38] hover:bg-[#18652d] text-white font-bold py-2.5 rounded-xl transition text-center text-xs"
              >
                Lihat di Halaman Detail Warga
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
