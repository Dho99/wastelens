"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Icon from "@mdi/react";
import {
  mdiCameraOutline,
  mdiClockOutline,
  mdiCheckCircle,
  mdiRecycle,
  mdiInformationOutline,
  mdiSendOutline,
  mdiRefresh,
} from "@mdi/js";
import { useTaskDetail } from "../../../hooks/useTaskDetail";
import { completeTask } from "@/lib/services/petugas-task";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam`;
  return `${Math.floor(hours / 24)} hari`;
}

export default function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: task, isLoading, isError, error, refetch } = useTaskDetail(id);

  const [fotoSesudah, setFotoSesudah] = useState<string | null>(null);
  const [fotoSesudahBase64, setFotoSesudahBase64] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("foto_sesudah");
    if (stored) {
      setFotoSesudah(stored);
      setFotoSesudahBase64(stored.split(",")[1] ?? "");
      sessionStorage.removeItem("foto_sesudah");
    }
  }, []);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setFotoSesudah(dataUrl);
      setFotoSesudahBase64(dataUrl.split(",")[1] ?? "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!fotoSesudahBase64) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      await completeTask(id, fotoSesudahBase64);
      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal mengirim verifikasi",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- Success state ---
  if (success) {
    return (
      <div className="py-8 text-center font-sans">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-primary/20">
          <Icon path={mdiCheckCircle} className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-primary">Verifikasi Berhasil!</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-neutral-500">
          Laporan telah diverifikasi dan koin pelapor akan segera ditambahkan.
        </p>
        <button
          onClick={() => router.push("/petugas")}
          className="mt-8 w-full rounded-2xl bg-primary px-4 py-3.5 text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-primary/90"
        >
          Kembali ke Daftar Tugas
        </button>
      </div>
    );
  }

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="min-h-screen pb-8 font-sans">
        <div className="space-y-6 py-4">
          <div className="h-6 w-40 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-100" />
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[4/5] animate-pulse rounded-[20px] bg-neutral-100" />
            <div className="aspect-[4/5] animate-pulse rounded-[20px] bg-neutral-100" />
          </div>
          <div className="h-48 animate-pulse rounded-[28px] bg-neutral-100" />
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

  const fotoSebelum = task.foto?.[0]?.url ?? task.foto_url;

  return (
    <div className="min-h-screen pb-8 font-sans">
      <div className="space-y-6 py-4">
        {/* Header Info */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-primary/20 px-3 py-1.5 text-[11px] font-bold text-primary">
              Verifikasi Selesai
            </span>
            <span className="text-xs font-medium tracking-wide text-neutral-500">
              ID: {task.id.slice(0, 8)}
            </span>
          </div>
          <h2 className="mb-2 text-[19px] font-bold leading-snug text-neutral-800">
            {task.address_text ?? `${task.lokasi_lat.toFixed(6)}, ${task.lokasi_lng.toFixed(6)}`}
          </h2>
          <div className="flex items-center gap-1.5 text-neutral-600">
            <Icon path={mdiClockOutline} className="h-4 w-4" />
            <span className="text-sm font-medium">{timeAgo(task.createdAt)}</span>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Foto Sebelum */}
          <div className="relative flex aspect-[4/5] flex-col overflow-hidden rounded-[20px] bg-neutral-200 shadow-sm">
            <div className="absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-bold tracking-wider text-white shadow-sm">
              LAPORAN WARGA
            </div>
            <div className="relative flex-1">
              <Image
                src={fotoSebelum}
                alt="Sebelum"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-black/40 py-2.5 text-center backdrop-blur-[2px]">
              <span className="text-[13px] font-semibold text-white">
                Foto Sebelum
              </span>
            </div>
          </div>

          {/* Foto Sesudah */}
          <div className="relative flex aspect-[4/5] flex-col overflow-hidden rounded-[20px] border-[1.5px] border-primary bg-neutral-200 shadow-sm">
            <div className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold tracking-wider text-white shadow-sm">
              PETUGAS
            </div>
            <div className="absolute right-2 top-2 z-10 flex items-center justify-center rounded-full bg-white p-[2px] text-primary shadow-sm">
              <Icon path={mdiCheckCircle} className="h-[14px] w-[14px]" />
            </div>
            <div className="relative flex-1">
              {fotoSesudah ? (
                <Image
                  src={fotoSesudah}
                  alt="Sesudah"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              ) : (
                <div
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-neutral-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon path={mdiCameraOutline} className="h-8 w-8 text-neutral-400" />
                </div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-primary py-2.5 text-center">
              <span className="text-[13px] font-semibold text-white">
                Foto Sesudah
              </span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="relative overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
          {/* Top Row */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="mb-0.5 text-[11px] font-medium text-neutral-500">
                Jenis Sampah
              </p>
              <p className="text-[15px] font-bold text-neutral-800">
                {task.waste_types.length > 0
                  ? task.waste_types.join(", ")
                  : task.kategori_ukuran}
              </p>
            </div>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <Icon path={mdiRecycle} className="h-[22px] w-[22px] text-primary" />
            </div>
          </div>

          <div className="mb-4 h-[1px] w-full bg-neutral-200" />

          {/* Middle Row */}
          <div className="mb-5 flex justify-between gap-4">
            <div>
              <p className="mb-0.5 text-[11px] font-medium text-neutral-500">
                Kategori Ukuran
              </p>
              <p className="text-[15px] font-bold capitalize text-neutral-800">
                {task.kategori_ukuran}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-[11px] font-medium text-neutral-500">
                Metode Verifikasi
              </p>
              <p className="text-[15px] font-bold text-neutral-800">
                Foto AI-Validated
              </p>
            </div>
          </div>

          {/* Bottom Row — vehicle & priority */}
          <div>
            <p className="mb-2 text-[11px] font-medium text-neutral-500">
              Detail Tugas
            </p>
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-3.5">
              <p className="text-[13px] leading-relaxed text-neutral-700">
                {task.rekomendasi_kendaraan && (
                  <>Kendaraan: {task.rekomendasi_kendaraan}</>
                )}
                {task.rekomendasi_kendaraan && task.priority_level && " — "}
                {task.priority_level && <>Prioritas: {task.priority_level}</>}
                {!task.rekomendasi_kendaraan && !task.priority_level && (
                  "Tidak ada catatan tambahan"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Alert Box */}
        <div className="flex gap-3 rounded-3xl border border-accent/20 bg-accent/10 p-4">
          <div className="mt-0.5 shrink-0">
            <Icon path={mdiInformationOutline} className="h-5 w-5 text-accent" />
          </div>
          <p className="pr-1 text-[11px] font-medium leading-relaxed text-neutral-700">
            Pastikan foto sesudah terlihat jelas dan tidak buram sebelum menekan
            tombol kirim. Data ini akan sinkronisasi otomatis ke dashboard pusat.
          </p>
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!fotoSesudahBase64 || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-[15px] font-semibold text-white shadow-lg transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "Memproses..." : "Verifikasi Selesai"}
            {!submitting && <Icon path={mdiSendOutline} className="h-5 w-5" />}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-full py-2 text-[14px] font-bold text-primary transition-colors hover:bg-primary/5"
          >
            Ambil Ulang Foto <Icon path={mdiRefresh} className="h-5 w-5" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCapture}
        />
      </div>
    </div>
  );
}
