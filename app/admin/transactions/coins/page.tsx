"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CoinTx, Pagination } from "../../types/transactions";
import { useCoinTransactions } from "../../hooks/useTransactions";

export default function AdminCoinTransactionsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useCoinTransactions(page);
  const items = data?.items ?? [];
  const pagination = data?.pagination as Pagination | undefined;

  const filteredTxs = items.filter((tx) => {
    const term = searchQuery.toLowerCase();
    return (
      tx.user?.nama.toLowerCase().includes(term) ||
      tx.jenis.toLowerCase().includes(term) ||
      tx.id.includes(term)
    );
  });

  const exportCSV = () => {
    const headers = ["ID Transaksi", "Pengguna", "Jenis", "Jumlah Koin", "Laporan Ref"];
    const rows = filteredTxs.map((tx) => [
      tx.id,
      tx.user?.nama || "Unknown",
      tx.jenis.toUpperCase(),
      tx.jumlah,
      tx.laporan?.id || "-",
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Audit_Logs_Transaksi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit log transaksi diekspor!");
  };

  const totalKoinKredit = items.filter(t => t.jenis === "kredit").reduce((acc, t) => acc + t.jumlah, 0);
  const totalKoinDebit = items.filter(t => t.jenis === "debit").reduce((acc, t) => acc + t.jumlah, 0);

  return (
    <div className="bg-[#FAF9F5] min-h-screen p-8 text-neutral-800 select-none pb-24">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1E7D38] tracking-tight">Riwayat Transaksi Koin</h1>
          <p className="text-xs text-gray-500 font-bold mt-1">Audit log aliran koin digital dalam sistem WasteLens.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari transaksi..."
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
          className="px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 border-transparent text-gray-400 hover:text-gray-600"
        >
          Riwayat Laporan
        </button>
        <button
          onClick={() => router.push("/admin/transactions/coins")}
          className="px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 border-[#1E7D38] text-[#1E7D38]"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Koin Dialirkan</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-[#E31E53] text-white flex items-center justify-center text-xs font-black">S</div>
            <span className="text-2xl font-black text-gray-805">{(totalKoinKredit + totalKoinDebit).toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Koin Kredit (Masuk)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#287A38]">+{totalKoinKredit.toLocaleString("id-ID")}</span>
            <span className="text-[10px] text-gray-400 font-bold">Poin Masuk</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Koin Debit (Keluar)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-red-500">-{totalKoinDebit.toLocaleString("id-ID")}</span>
            <span className="text-[10px] text-gray-400 font-bold">Poin Ditukar</span>
          </div>
        </div>

      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm min-h-[300px]">

        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-black text-gray-850">Jurnal Mutasi Koin</h3>
          <span className="bg-emerald-50 text-[#1E7D38] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
            TRANSACTION LEDGER
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#1E7D38] animate-spin" />
            <p className="text-xs text-gray-400 font-bold">Memuat data mutasi koin...</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
                    <th className="pb-3 pt-1">User ID / Pengguna</th>
                    <th className="pb-3 pt-1">Jenis Mutasi</th>
                    <th className="pb-3 pt-1">Jumlah</th>
                    <th className="pb-3 pt-1">Referensi Laporan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-400 font-bold">
                        Tidak ada catatan transaksi tersedia
                      </td>
                    </tr>
                  ) : (
                    filteredTxs.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-[10px]">
                              $
                            </div>
                            <div>
                              <div className="font-bold text-gray-800">{tx.user?.nama || "Warga"}</div>
                              <div className="text-[9px] text-gray-400 font-semibold font-mono">ID: {tx.user?.id.slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                            tx.jenis === "kredit" ? "bg-emerald-50 text-[#287A38] border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"
                          }`}>
                            {tx.jenis === "kredit" ? "KREDIT" : "DEBIT"}
                          </span>
                        </td>
                        <td className="py-3.5 font-black text-gray-805 font-mono text-sm">
                          {tx.jenis === "kredit" ? "+" : "-"}{tx.jumlah}
                        </td>
                        <td className="py-3.5 text-gray-500 font-mono text-[10px]">
                          #REP-{tx.laporan.id.slice(0, 5).toUpperCase()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400">
                  Menampilkan 10 dari {pagination.total} transaksi
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
