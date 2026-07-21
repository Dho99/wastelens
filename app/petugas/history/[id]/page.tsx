"use client";

import { use } from "react";
import Image from "next/image";
import Icon from "@mdi/react";
import {
  mdiCheckCircle,
  mdiCalendarBlank,
  mdiClockOutline,
  mdiMapMarker,
  mdiAlertOutline,
} from "@mdi/js";
import dynamic from "next/dynamic";
import { useTaskDetail } from "../../hooks/useTaskDetail";

const LocationMap = dynamic(() => import("@/components/leaflet-location-map"), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse bg-neutral-100" />,
});

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default function DetailHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: task, isLoading, isError, error, refetch } = useTaskDetail(id);

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="min-h-screen pb-8 font-sans">
        <div className="space-y-6 py-4">
          <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-48 animate-pulse rounded-2xl bg-neutral-100" />
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
            {error instanceof Error ? error.message : "Gagal memuat detail"}
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

  const pickup = task.verifikasi_pickup?.[0];
  const fotoSebelum = task.foto?.[0]?.url ?? task.foto_url;
  const fotoSesudah = pickup?.foto_sesudah ?? "";
  const address =
    task.address_text ??
    `${task.lokasi_lat.toFixed(6)}, ${task.lokasi_lng.toFixed(6)}`;

  return (
    <div className="min-h-screen pb-8 font-sans">
      <div className="space-y-6 py-4">
        {/* Task ID Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="mb-1 text-xs text-neutral-500">Task ID</p>
              <h2 className="text-xl font-bold text-neutral-800">
                {task.id.slice(0, 8)}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-white">
              <Icon path={mdiCheckCircle} className="h-4 w-4" />
              <span className="text-sm font-medium">Selesai</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-neutral-700">
            <div className="flex items-center gap-1.5">
              <Icon path={mdiCalendarBlank} className="h-4 w-4" />
              <span className="text-sm font-medium">
                {pickup ? formatDate(pickup.waktu) : formatDate(task.updatedAt)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon path={mdiClockOutline} className="h-4 w-4" />
              <span className="text-sm font-medium">
                {pickup ? formatTime(pickup.waktu) : formatTime(task.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Lokasi Penjemputan Card */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <Icon path={mdiMapMarker} className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold text-neutral-800">
                Lokasi Penjemputan
              </h3>
              <p className="text-sm leading-snug text-neutral-500">{address}</p>
            </div>
          </div>
          <LocationMap lat={task.lokasi_lat} lng={task.lokasi_lng} popup={address} />
        </div>

        {/* Foto Verifikasi */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-800">
              Foto Verifikasi
            </h3>
            <span className="text-sm font-bold text-primary">Terverifikasi</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Before */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 aspect-[4/5] w-full overflow-hidden rounded-xl border border-neutral-200">
                {fotoSebelum ? (
                  <Image
                    src={fotoSebelum}
                    alt="Kondisi Awal"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                    Tidak ada foto
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-neutral-600">
                Kondisi Awal
              </p>
            </div>

            {/* After */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 aspect-[4/5] w-full overflow-hidden rounded-xl border-2 border-primary">
                {fotoSesudah ? (
                  <Image
                    src={fotoSesudah}
                    alt="Kondisi Bersih"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                    Tidak ada foto
                  </div>
                )}
              </div>
              <p className="text-sm font-bold text-primary">Kondisi Bersih</p>
            </div>
          </div>
        </section>

        {/* Laporkan Masalah Button */}
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-[#d32f2f]">
          <Icon path={mdiAlertOutline} className="h-5 w-5" />
          Laporkan Masalah pada Tugas Ini
        </button>
      </div>
    </div>
  );
}
