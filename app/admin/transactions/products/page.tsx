"use client";

import { useEffect, useState } from "react";

type Redemption = {
  id: string;
  user: { id: string; nama: string };
  produk: { id: string; nama_barang: string; kopdes: { nama: string } };
  jumlah_koin: number;
  status: string;
  redeemed_at: string | null;
  createdAt: string;
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  DIJEMPUT: "Dijemput",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  DIJEMPUT: "bg-blue-100 text-blue-700",
  SELESAI: "bg-emerald-100 text-emerald-700",
  DIBATALKAN: "bg-red-100 text-red-700",
};

export default function AdminProductRedemptionsPage() {
  const [data, setData] = useState<Redemption[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/transactions/products?page=${page}&limit=20`)
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
      <h1 className="text-2xl font-bold mb-6">Riwayat Penukaran Produk</h1>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="p-3 font-medium">Pengguna</th>
              <th className="p-3 font-medium">Produk</th>
              <th className="p-3 font-medium">Kopdes</th>
              <th className="p-3 font-medium">Koin</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-neutral-400">Memuat...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-neutral-400">Tidak ada data</td></tr>
            ) : data.map((r) => (
              <tr key={r.id} className="border-t hover:bg-neutral-50">
                <td className="p-3">{r.user.nama}</td>
                <td className="p-3">{r.produk.nama_barang}</td>
                <td className="p-3 text-neutral-500">{r.produk.kopdes.nama}</td>
                <td className="p-3 font-mono">{r.jumlah_koin}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_COLORS[r.status] ?? ""}`}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </td>
                <td className="p-3 text-neutral-500 text-xs">
                  {new Date(r.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </td>
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
