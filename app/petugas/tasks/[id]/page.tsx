"use client";

import Icon from "@mdi/react";
import {
  mdiClipboardTextOutline,
  mdiMapMarker,
  mdiDirections,
  mdiImageOutline,
  mdiInformation,
  mdiAlert,
  mdiCameraOutline,
  mdiTruckFast,
  mdiScaleBalance,
  mdiRecycle,
} from "@mdi/js";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useTaskDetail, type TaskDetailData } from "../../hooks/useTaskDetail";
import { setPhoto } from "@/lib/photo-store";

const LocationMap = dynamic(() => import("@/components/leaflet-location-map"), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse bg-neutral-100" />,
});

const PRIORITY_LABEL: Record<string, string> = {
  LOW: "Rendah",
  MEDIUM: "Sedang",
  HIGH: "Tinggi",
  CRITICAL: "Kritis",
};

function formatLocation(task: TaskDetailData): string {
  if (task.address_text) return task.address_text;
  return `${task.lokasi_lat.toFixed(6)}, ${task.lokasi_lng.toFixed(6)}`;
}

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [cleaned, setCleaned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: task, isLoading, isError, error, refetch } = useTaskDetail(id);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto("foto_sesudah", file);
    router.push(`/petugas/tasks/${id}/verify`);
  };

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="min-h-screen pb-8 font-sans">
        <div className="space-y-6 py-4">
          <div className="h-8 w-40 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-48 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-40 animate-pulse rounded-2xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (isError || !task) {
    return (
      <div className="min-h-screen pb-8 font-sans">
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-red-800">
            {error instanceof Error ? error.message : "Gagal memuat detail tugas"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const hasWarnings = task.drainage_risk || task.access_obstruction_risk;

  return (
    <div className="min-h-screen pb-8 font-sans">
      <div className="space-y-6 py-4">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-primary">
          <Icon path={mdiClipboardTextOutline} className="h-4 w-4" />
          <span className="text-sm font-medium">{task.status_label}</span>
        </div>

        {/* Lokasi Penjemputan Section */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-neutral-800">
            <Icon path={mdiMapMarker} className="h-5 w-5 text-primary" />
            Lokasi Penjemputan
          </h2>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="p-4 pb-3">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                Pelapor
              </p>
              <p className="mb-0.5 text-[14px] font-bold leading-snug text-neutral-800">
                {task.user?.name ?? "Tidak diketahui"}
              </p>
              <p className="text-sm text-neutral-500">{formatLocation(task)}</p>
            </div>

            {/* Map */}
            <div className="relative w-full">
              <LocationMap
                lat={task.lokasi_lat}
                lng={task.lokasi_lng}
                height="h-48"
                popup="Lokasi Penjemputan"
              />

              <button
                className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm font-bold text-neutral-700 shadow-md transition-colors hover:bg-neutral-50"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${task.lokasi_lat},${task.lokasi_lng}`,
                    "_blank",
                  )
                }
              >
                <Icon path={mdiDirections} className="h-4 w-4 text-primary" />
                Buka Navigasi
              </button>
            </div>
          </div>
        </section>

        {/* Foto Laporan Section */}
        {task.foto.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-neutral-800">
              <Icon path={mdiImageOutline} className="h-5 w-5 text-primary" />
              Foto Laporan
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {task.foto.map((f, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-sm"
                >
                  <Image
                    src={f.url}
                    alt={`Foto laporan ${i + 1}`}
                    className="h-full w-full object-cover"
                    width={300}
                    height={400}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10">
                    <span className="text-[13px] font-medium text-white">
                      Foto {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informasi Tugas */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-neutral-800">
            <Icon path={mdiInformation} className="h-5 w-5 text-primary" />
            Informasi Tugas
          </h2>

          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            {/* Detail cards */}
            <div className="grid grid-cols-2 gap-3">
              {task.rekomendasi_kendaraan && (
                <div className="rounded-xl bg-primary/10 p-3 flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div className="flex items-center justify-center rounded-lg bg-primary/20 p-1.5">
                      <Icon path={mdiTruckFast} className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800 mb-1">Kendaraan</p>
                    <p className="text-sm text-neutral-600">{task.rekomendasi_kendaraan}</p>
                  </div>
                </div>
              )}
              <div className="rounded-xl bg-primary/10 p-3 flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <div className="flex items-center justify-center rounded-lg bg-primary/20 p-1.5">
                    <Icon path={mdiScaleBalance} className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800 mb-1">Ukuran</p>
                  <p className="text-sm capitalize text-neutral-600">
                    {task.kategori_ukuran}
                  </p>
                </div>
              </div>
            </div>

            {/* Waste types */}
            {task.waste_types.length > 0 && (
              <div className="rounded-xl bg-primary/10 p-3 flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <div className="flex items-center justify-center rounded-lg bg-primary/20 p-1.5">
                    <Icon path={mdiRecycle} className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800 mb-1">
                    Jenis Sampah
                  </p>
                  <p className="text-sm text-neutral-600">
                    {task.waste_types.join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Priority */}
            {task.priority_level && (
              <div className="rounded-xl bg-primary/10 p-3 flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <div className="flex items-center justify-center rounded-lg bg-primary/20 p-1.5">
                    <Icon path={mdiAlert} className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800 mb-1">Prioritas</p>
                  <p className="text-sm text-neutral-600">
                    {PRIORITY_LABEL[task.priority_level] ?? task.priority_level}
                  </p>
                </div>
              </div>
            )}

            {/* Risk warnings */}
            {hasWarnings && (
              <div className="rounded-xl bg-accent/10 p-3 flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <div className="flex items-center justify-center rounded-lg bg-accent/20 p-1.5">
                    <Icon path={mdiAlert} className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800 mb-1">
                    Peringatan
                  </p>
                  <ul className="list-inside list-disc text-sm text-neutral-600 space-y-0.5">
                    {task.drainage_risk && (
                      <li>Risiko drainase — perhatikan saluran air di sekitar</li>
                    )}
                    {task.access_obstruction_risk && (
                      <li>Akses terbatas — mungkin ada hambatan di lokasi</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Action Button */}
        {cleaned ? (
          <button
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-primary/90"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon path={mdiCameraOutline} className="h-5 w-5" />
            Ambil Foto
          </button>
        ) : (
          <button
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-accent/90"
            onClick={() => setCleaned(true)}
          >
            Mulai Bersihkan
          </button>
        )}

        {/* Hidden camera input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
        />
      </div>
    </div>
  );
}
