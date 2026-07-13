"use client";

import { useEffect, useState } from "react";

type CoinTx = {
  id: string;
  user: { id: string; nama: string };
  laporan: { id: string };
  jumlah: number;
  jenis: string;
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };

export default function AdminCoinTransactionsPage() {
  const [data, setData] = useState<CoinTx[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/transactions/coins?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((json) => {
        setData(json.data ?? []);
        setPagination(json.pagination ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi Koin</h1>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="p-3 font-medium">Pengguna</th>
              <th className="p-3 font-medium">Jenis</th>
              <th className="p-3 font-medium">Jumlah</th>
              <th className="p-3 font-medium">Laporan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-neutral-400">Memuat...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-neutral-400">Tidak ada data</td></tr>
            ) : data.map((tx) => (
              <tr key={tx.id} className="border-t hover:bg-neutral-50">
                <td className="p-3">{tx.user.nama}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    tx.jenis === "kredit" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {tx.jenis === "kredit" ? "KREDIT" : "DEBIT"}
                  </span>
                </td>
                <td className="p-3 font-mono">{tx.jumlah}</td>
                <td className="p-3 text-neutral-500 font-mono text-xs">{tx.laporan.id.slice(0, 8)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                p === page ? "bg-neutral-900 text-white border-neutral-900" : "hover:bg-neutral-100"
              }`}
            >{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
