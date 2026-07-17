"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  user: { id: string; nama: string };
  kategori_ukuran: string;
  status: string;
  lokasi_lat: number;
  lokasi_lng: number;
  createdAt: string;
  dinas: { nama_dinas: string } | null;
  kendaraan: { jenis: string } | null;
  foto: { url: string }[];
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  DIJEMPUT: "Dijemput",
  SELESAI: "Selesai",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  DIJEMPUT: "bg-blue-100 text-blue-700",
  SELESAI: "bg-emerald-100 text-emerald-700",
};

export default function AdminReportsPage() {
  const [data, setData] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/reports?${params}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json.data ?? []);
        setPagination(json.pagination ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Riwayat Laporan</h1>

      <div className="flex gap-3 mb-5">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Semua Status</option>
          <option value="PENDING">Pending</option>
          <option value="DIJEMPUT">Dijemput</option>
          <option value="SELESAI">Selesai</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="p-3 font-medium">Pelapor</th>
              <th className="p-3 font-medium">Ukuran</th>
              <th className="p-3 font-medium">Dinas</th>
              <th className="p-3 font-medium">Kendaraan</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Lokasi</th>
              <th className="p-3 font-medium">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-neutral-400">Memuat...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-neutral-400">Tidak ada data</td></tr>
            ) : data.map((r) => (
              <tr key={r.id} className="border-t hover:bg-neutral-50">
                <td className="p-3">{r.user.nama}</td>
                <td className="p-3 capitalize">{r.kategori_ukuran}</td>
                <td className="p-3 text-neutral-500">{r.dinas?.nama_dinas ?? "—"}</td>
                <td className="p-3 text-neutral-500 capitalize">{r.kendaraan?.jenis ?? "—"}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_COLORS[r.status] ?? ""}`}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </td>
                <td className="p-3 text-neutral-500 font-mono text-xs">
                  {r.lokasi_lat.toFixed(4)}, {r.lokasi_lng.toFixed(4)}
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
