"use client";

import { useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

interface HistoryItem {
  id: string;
  user_nama: string;
  produk_nama: string;
  jumlah_koin: number;
  status: string;
  redeemed_at: string | null;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  REDEEMED: "Ditukar",
  EXPIRED: "Kedaluwarsa",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  REDEEMED: "bg-green-100 text-green-800",
  EXPIRED: "bg-red-100 text-red-600",
};

function HistoryContent() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/kopdes/redeem/history?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.data ?? []);
        setPagination(data.pagination ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return (
      <div className="space-y-3 p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-neutral-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-bold">Riwayat Penukaran</h2>

      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 p-8 text-center">
          <p className="text-sm text-neutral-500">Belum ada transaksi penukaran</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{item.produk_nama}</p>
                    <p className="text-xs text-neutral-500">
                      {item.user_nama} — {item.jumlah_koin} koin
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLOR[item.status] ?? "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {item.redeemed_at
                    ? `Ditukar: ${new Date(item.redeemed_at).toLocaleString("id-ID")}`
                    : `Dibuat: ${new Date(item.created_at).toLocaleString("id-ID")}`}
                </p>
              </div>
            ))}
          </div>

          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
              >
                Sebelumnya
              </button>
              <span className="text-xs text-neutral-500">
                {pagination.page} / {pagination.total_pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                disabled={page >= pagination.total_pages}
                className="rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ErrorBoundary>
      <HistoryContent />
    </ErrorBoundary>
  );
}
