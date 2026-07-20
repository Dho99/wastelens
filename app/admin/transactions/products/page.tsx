"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Redemption = {
  id: string;
  user: { id: string; nama: string; email?: string };
  produk: { id: string; nama_barang: string; kopdes: { nama: string } };
  jumlah_koin: number;
  status: string;
  redeemed_at: string | null;
  createdAt: string;
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  DIJEMPUT: "Proses",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-50 border-amber-100",
  DIJEMPUT: "text-blue-600 bg-blue-50 border-blue-100",
  SELESAI: "text-emerald-600 bg-emerald-50 border-emerald-100",
  DIBATALKAN: "text-red-600 bg-red-50 border-red-100",
};

export default function AdminProductRedemptionsPage() {
  const router = useRouter();
  const [data, setData] = useState<Redemption[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRedemptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/transactions/products?page=${page}&limit=10`);
      const json = await res.json();
      setData(json.data ?? []);
      setPagination(json.pagination ?? null);
    } catch {
      toast.error("Gagal memuat riwayat penukaran");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchRedemptions();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchRedemptions]);

  // Client-side search filters
  const filteredData = data.filter((r) => {
    const term = searchQuery.toLowerCase();
    return (
      r.user?.nama.toLowerCase().includes(term) ||
      r.produk?.nama_barang.toLowerCase().includes(term) ||
      r.id.includes(term)
    );
  });

  const exportCSV = () => {
    const headers = ["ID Penukaran", "Pengguna", "Nama Barang", "Koperasi Partner", "Jumlah Koin", "Status", "Waktu"];
    const rows = filteredData.map((r) => [
      r.id,
      r.user?.nama || "Unknown",
      r.produk?.nama_barang || "-",
      r.produk?.kopdes?.nama || "-",
      r.jumlah_koin,
      STATUS_LABELS[r.status] || r.status,
      new Date(r.createdAt).toLocaleString("id-ID"),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Audit_Logs_Penukaran.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit log penukaran diekspor!");
  };

  const totalPenukaranSelesai = data.filter(r => r.status === "SELESAI").length;
  const totalKoinDibelanjakan = data.reduce((acc, r) => acc + r.jumlah_koin, 0);

  return (
    <div className="bg-[#FAF9F5] min-h-screen p-8 text-neutral-800 select-none pb-24">
      
      {/* 1. Header & Top bar dashboard console style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1E7D38] tracking-tight">Riwayat Penukaran Produk</h1>
          <p className="text-xs text-gray-500 font-bold mt-1">Audit log aktivitas klaim hadiah voucher & barang warga.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari klaim..."
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

      {/* 2. Unified Navigation Tab Header */}
      <div className="flex border-b border-gray-200/80 mb-6">
        <button
          onClick={() => router.push("/admin/reports")}
          className="px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 border-transparent text-gray-400 hover:text-gray-600"
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
          className="px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 border-[#1E7D38] text-[#1E7D38]"
        >
          Riwayat Penukaran
        </button>
      </div>

      {/* 3. Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Penukaran Sukses</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">{totalPenukaranSelesai} Transaksi</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Volume Koin Ditukar</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-805">{totalKoinDibelanjakan.toLocaleString("id-ID")} Koin</span>
          </div>
        </div>

      </div>

      {/* 4. Ledger Table Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm min-h-[300px]">
        
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-black text-gray-850">Log Penukaran Mitra Koperasi</h3>
          <span className="bg-emerald-50 text-[#1E7D38] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
            PRODUCT EXCHANGE LOG
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#1E7D38] animate-spin" />
            <p className="text-xs text-gray-400 font-bold">Memuat log penukaran...</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
                    <th className="pb-3 pt-1">Pengguna</th>
                    <th className="pb-3 pt-1">Nama Barang / Voucher</th>
                    <th className="pb-3 pt-1">Koperasi Partner</th>
                    <th className="pb-3 pt-1">Harga Koin</th>
                    <th className="pb-3 pt-1">Status</th>
                    <th className="pb-3 pt-1">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-gray-400 font-bold">
                        Tidak ada catatan penukaran tersedia
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((r) => {
                      const formattedTime = new Date(r.createdAt).toLocaleString("id-ID", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      });
                      return (
                        <tr key={r.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                          <td className="py-3.5">
                            <div className="font-bold text-gray-800">{r.user?.nama || "Warga"}</div>
                            <div className="text-[10px] text-gray-400 font-semibold">{r.user?.email}</div>
                          </td>
                          <td className="py-3.5 font-bold text-gray-700">
                            {r.produk?.nama_barang}
                          </td>
                          <td className="py-3.5 text-gray-500 font-semibold">
                            {r.produk?.kopdes?.nama || "Koperasi Partner"}
                          </td>
                          <td className="py-3.5 font-black text-gray-805 font-mono text-xs">
                            {r.jumlah_koin} koin
                          </td>
                          <td className="py-3.5">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${STATUS_COLORS[r.status] ?? ""}`}>
                              {STATUS_LABELS[r.status] ?? r.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-gray-500 font-bold">
                            {formattedTime}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400">
                  Menampilkan 10 dari {pagination.total} penukaran
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

    </div>
  );
}
