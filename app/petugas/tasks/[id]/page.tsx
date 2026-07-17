"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getTaskDetail, type TaskDetail } from "@/lib/services/petugas-task";
import dynamic from "next/dynamic";
import { MapPin, Truck, Building, User, Camera } from "lucide-react";

const LeafletRoutingMap = dynamic(
  () => import("@/components/leaflet-routing-map"),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-xl bg-neutral-100" /> }
);

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLng, setCurrentLng] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getTaskDetail(id);
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat detail tugas");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("GPS tidak tersedia");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLat(pos.coords.latitude);
        setCurrentLng(pos.coords.longitude);
      },
      () => setGpsError("Aktifkan GPS untuk navigasi"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-48 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-800">{error || "Tugas tidak ditemukan"}</p>
          <button
            onClick={() => router.push("/petugas/tasks")}
            className="mt-3 rounded-lg bg-neutral-100 px-4 py-2 text-xs font-medium hover:bg-neutral-200 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Detail Tugas</h2>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
          {task.status ?? "Menunggu Diproses"}
        </span>
      </div>

      <div className="space-y-3 rounded-xl border bg-white p-4">
        <div className="flex items-center gap-3">
          <User className="size-5 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500">Pelapor</p>
            <p className="font-medium">{task.user?.nama ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500">Lokasi</p>
            <p className="font-mono text-xs">
              {task.lokasi_lat.toFixed(6)}, {task.lokasi_lng.toFixed(6)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="size-5 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500">Kendaraan</p>
            <p className="font-medium capitalize">
              {task.rekomendasi_kendaraan ?? task.kendaraan?.jenis ?? "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Building className="size-5 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500">Dinas</p>
            <p className="font-medium">{task.dinas?.nama_dinas ?? "—"}</p>
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs text-neutral-500">Kategori</p>
          <p className="font-medium capitalize">{task.kategori_ukuran}</p>
        </div>
      </div>

      {task.foto_url && (
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">Foto Bukti Awal</p>
          <div className="overflow-hidden rounded-xl bg-neutral-100">
            <img
              src={task.foto_url}
              alt="Foto sampah"
              className="h-48 w-full object-cover"
            />
          </div>
        </div>
      )}

      {gpsError && (
        <div className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
          {gpsError}
        </div>
      )}

      {currentLat !== null && currentLng !== null && (
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">Navigasi</p>
          <LeafletRoutingMap
            currentLat={currentLat}
            currentLng={currentLng}
            targetLat={task.lokasi_lat}
            targetLng={task.lokasi_lng}
          />
        </div>
      )}

      <button
        onClick={() => router.push(`/petugas/tasks/${task.id}/verify`)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
      >
        <Camera className="size-5" />
        Buka Kamera & Ambil Foto Lokasi Bersih
      </button>

      <button
        onClick={() => router.push("/petugas/tasks")}
        className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
      >
        Kembali ke Daftar Tugas
      </button>
    </div>
  );
}
