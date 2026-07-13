"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { Clipboard, MapPin, CheckCircle } from "lucide-react";

interface DashboardStats {
  total_tasks: number;
  completed_today: number;
  total_completed: number;
}

function PetugasDashboardContent() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/petugas/tasks?limit=1");
        if (res.ok) {
          const data = await res.json();
          setStats({
            total_tasks: data.pagination?.total ?? 0,
            completed_today: 0,
            total_completed: 0,
          });
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-32 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold">Petugas Lapangan</h1>
        <p className="text-sm text-neutral-500">Panel tugas dan verifikasi</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-amber-50 p-4 text-center">
          <MapPin className="mx-auto mb-1 size-5 text-amber-600" />
          <p className="text-2xl font-bold text-amber-700">{stats?.total_tasks ?? 0}</p>
          <p className="mt-1 text-xs text-neutral-500">Tugas Aktif</p>
        </div>
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <CheckCircle className="mx-auto mb-1 size-5 text-green-600" />
          <p className="text-2xl font-bold text-green-700">{stats?.completed_today ?? 0}</p>
          <p className="mt-1 text-xs text-neutral-500">Selesai Hari Ini</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <Clipboard className="mx-auto mb-1 size-5 text-blue-600" />
          <p className="text-2xl font-bold text-blue-700">{stats?.total_completed ?? 0}</p>
          <p className="mt-1 text-xs text-neutral-500">Total Selesai</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700">Aksi Cepat</h2>
        <button
          onClick={() => router.push("/petugas/tasks")}
          className="flex w-full items-center gap-4 rounded-xl bg-emerald-600 p-5 text-left text-white hover:bg-emerald-700 transition-colors"
        >
          <div className="flex size-14 items-center justify-center rounded-lg bg-black/10">
            <Clipboard className="size-7" />
          </div>
          <div>
            <p className="font-semibold">Lihat Daftar Tugas</p>
            <p className="mt-0.5 text-sm opacity-80">
              {stats?.total_tasks ?? 0} tugas menunggu
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function PetugasDashboardPage() {
  return (
    <ErrorBoundary>
      <PetugasDashboardContent />
    </ErrorBoundary>
  );
}
