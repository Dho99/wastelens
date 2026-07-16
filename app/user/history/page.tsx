"use client";

import { useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

interface Foto {
  url: string;
}

interface LaporanItem {
  id: string;
  foto_url: string;
  lokasi_lat: number;
  lokasi_lng: number;
  kategori_ukuran: string;
  rekomendasi_kendaraan: string | null;
  status: string;
  createdAt: string;
  foto: Foto[];
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  DIPROSES: "bg-blue-100 text-blue-800",
  SELESAI: "bg-green-100 text-green-800",
};

function HistoryContent() {
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/laporan/history")
      .then((r) => r.json())
      .then((data) => setLaporan(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (laporan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm font-medium text-neutral-500">Belum ada laporan</p>
        <p className="mt-1 text-xs text-neutral-400">
          Mulai dengan memindai sampah melalui menu Kamera
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-bold">Riwayat Pelaporan</h2>
      {laporan.map((item) => (
        <div
          key={item.id}
          className="flex gap-3 rounded-lg border bg-white p-3"
        >
          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            {item.foto[0]?.url ? (
              <img
                src={item.foto[0].url}
                alt="foto sampah"
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-neutral-400">
                No img
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-medium capitalize">
                {item.kategori_ukuran}
              </p>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  STATUS_COLOR[item.status] ?? "bg-neutral-100 text-neutral-600"
                }`}
              >
                {STATUS_LABEL[item.status] ?? item.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">
              {item.rekomendasi_kendaraan
                ? `Kendaraan: ${item.rekomendasi_kendaraan}`
                : "Menunggu assignment"}
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">
              {new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
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
