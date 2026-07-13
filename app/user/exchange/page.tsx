"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";

interface KopdesItem {
  id: string;
  nama: string;
  alamat: string;
  jarak_km: number;
  produk_count: number;
}

function ExchangeContent() {
  const router = useRouter();
  const [kopdesList, setKopdesList] = useState<KopdesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError("Browser tidak mendukung GPS");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `/api/kopdes?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
          );
          const data = await res.json();
          setKopdesList(data);
        } catch {
          setLocError("Gagal memuat data kopdes");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLocError("Aktifkan GPS untuk melihat kopdes terdekat");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (locError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm font-medium text-neutral-600">{locError}</p>
      </div>
    );
  }

  if (kopdesList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm font-medium text-neutral-500">
          Tidak ada kopdes terdekat
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-bold">Pilih Kopdes Terdekat</h2>

      {kopdesList.map((kopdes) => (
        <button
          key={kopdes.id}
          onClick={() => router.push(`/user/exchange/${kopdes.id}`)}
          className="w-full rounded-lg border bg-white p-4 text-left hover:border-emerald-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{kopdes.nama}</p>
              <p className="mt-0.5 text-xs text-neutral-500 truncate">
                {kopdes.alamat}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {kopdes.produk_count} produk tersedia
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {kopdes.jarak_km} km
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function ExchangePage() {
  return (
    <ErrorBoundary>
      <ExchangeContent />
    </ErrorBoundary>
  );
}
