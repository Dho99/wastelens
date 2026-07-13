"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { getTaskDetail, completeTask, type TaskDetail } from "@/lib/services/petugas-task";

function VerifyContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fotoSesudah, setFotoSesudah] = useState<string | null>(null);
  const [fotoSesudahBase64, setFotoSesudahBase64] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getTaskDetail(id)
      .then((data) => setTask(data))
      .catch(() => setError("Gagal memuat detail tugas"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setFotoSesudah(dataUrl);
      const base64 = dataUrl.split(",")[1] ?? "";
      setFotoSesudahBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!fotoSesudahBase64) return;
    setSubmitting(true);
    setError("");

    try {
      await completeTask(id, fotoSesudahBase64);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal verifikasi");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-48 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-48 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
          ✓
        </div>
        <h2 className="text-xl font-bold text-green-800">Tugas Selesai!</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Verifikasi pickup telah dicatat. Koin pelapor telah ditambahkan.
        </p>
        <button
          onClick={() => router.push("/petugas/tasks")}
          className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Kembali ke Daftar Tugas
        </button>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-800">{error}</p>
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
      <h2 className="text-lg font-bold">Verifikasi Pembersihan</h2>

      {task?.foto_url && (
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">Foto Sebelum</p>
          <div className="overflow-hidden rounded-xl bg-neutral-100">
            <img
              src={task.foto_url}
              alt="Sebelum"
              className="h-40 w-full object-cover"
            />
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium text-neutral-500">Foto Sesudah</p>

        {fotoSesudah ? (
          <div className="overflow-hidden rounded-xl bg-neutral-100">
            <img
              src={fotoSesudah}
              alt="Sesudah"
              className="h-40 w-full object-cover"
            />
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
          >
            <CameraIcon />
            <p className="mt-2 text-sm font-medium text-emerald-600">
              Ambil Foto Lokasi Bersih
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCapture}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/petugas/tasks/${id}`)}
          className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={!fotoSesudahBase64 || submitting}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Memproses..." : "Verifikasi Selesai"}
        </button>
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      className="size-10 text-emerald-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export default function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ErrorBoundary>
      <VerifyContent params={params} />
    </ErrorBoundary>
  );
}
