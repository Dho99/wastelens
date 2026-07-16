"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";

interface ClassificationResult {
  isWasteDetected: boolean;
  kategori_ukuran: "small" | "medium" | "large" | null;
  rekomendasi_kendaraan: "pickup" | "tossa" | "truck" | null;
  alasan_kendaraan: string | null;
  confidence: number;
}

type Step = "capture" | "classifying" | "result" | "error";

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("capture");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [validating, setValidating] = useState(false);
  const [locationValid, setLocationValid] = useState<boolean | null>(null);
  const [cooldownMsg, setCooldownMsg] = useState<string>("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showGpsPrompt, setShowGpsPrompt] = useState(false);

  const handleFileCapture = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setStep("classifying");

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string)?.split(",")[1] ?? "";
      setImageBase64(base64);

      try {
        const res = await fetch("/api/laporan/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mimeType: file.type }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error ?? "Gagal mengklasifikasi gambar");
          setStep("error");
          return;
        }

        setClassification(data);

        if (!data.isWasteDetected) {
          setErrorMsg("Foto bukan sampah! Objek tidak terdeteksi sampah.");
          setStep("error");
          return;
        }

        setStep("result");
        validateLocation();
      } catch {
        setErrorMsg("Gagal terhubung ke server");
        setStep("error");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const validateLocation = async () => {
    if (!navigator.geolocation) {
      setErrorMsg("Browser tidak mendukung GPS");
      setStep("error");
      return;
    }

    setValidating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLat(userLat);
        setLng(userLng);

        try {
          const res = await fetch("/api/laporan/validate-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: userLat, lng: userLng }),
          });

          const data = await res.json();

          if (data.inCooldown) {
            setCooldownMsg(data.message);
            setLocationValid(false);
            setShowGpsPrompt(true);
          } else {
            setLocationValid(true);
          }
        } catch {
          setErrorMsg("Gagal memvalidasi lokasi");
          setStep("error");
        } finally {
          setValidating(false);
        }
      },
      () => {
        setErrorMsg("Lokasi tidak ditemukan/tidak terekstrak");
        setStep("error");
        setValidating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const handleGpsRetry = () => {
    setShowGpsPrompt(false);
    setValidating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLat(userLat);
        setLng(userLng);

        try {
          const res = await fetch("/api/laporan/validate-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: userLat, lng: userLng }),
          });

          const data = await res.json();

          if (data.inCooldown) {
            setCooldownMsg(data.message);
            setLocationValid(false);
            setShowGpsPrompt(true);
          } else {
            setLocationValid(true);
          }
        } catch {
          setErrorMsg("Gagal memvalidasi lokasi");
          setStep("error");
        } finally {
          setValidating(false);
        }
      },
      () => {
        setErrorMsg("Lokasi tidak ditemukan. Nyalakan GPS dan coba lagi.");
        setValidating(false);
        setShowGpsPrompt(true);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleSubmit = async () => {
    if (!imageBase64 || lat === null || lng === null || !classification) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          lat,
          lng,
          kategori_ukuran: classification.kategori_ukuran,
          rekomendasi_kendaraan: classification.rekomendasi_kendaraan,
          deskripsi,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error ?? "Gagal menyimpan laporan");
        setSubmitting(false);
        return;
      }

      router.push("/user");
      router.refresh();
    } catch {
      setErrorMsg("Gagal mengirim laporan");
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setStep("capture");
    setImageBase64(null);
    setClassification(null);
    setErrorMsg("");
    setLocationValid(null);
    setCooldownMsg("");
    setShowGpsPrompt(false);
    setDeskripsi("");
  };

  if (step === "classifying" || validating) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 size-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="text-sm text-neutral-600">
          {validating ? "Memvalidasi lokasi..." : "Menganalisis gambar..."}
        </p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="space-y-4 p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-800">{errorMsg}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetAll}
            className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Ambil Ulang
          </button>
          <button
            onClick={() => router.push("/user")}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showGpsPrompt) {
    return (
      <div className="space-y-4 p-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-800">{cooldownMsg}</p>
          <p className="mt-2 text-xs text-yellow-700">
            Nyalakan GPS dengan akurasi tinggi untuk verifikasi ulang lokasi.
          </p>
        </div>
        <button
          onClick={handleGpsRetry}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Nyalakan GPS & Coba Lagi
        </button>
        <button
          onClick={resetAll}
          className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          Batal
        </button>
      </div>
    );
  }

  if (locationValid && classification) {
    return (
      <div className="space-y-4 p-4">
        <h2 className="text-lg font-bold">Konfirmasi Laporan</h2>

        <div className="rounded-xl bg-emerald-50 p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-neutral-500">Kategori</p>
              <p className="font-medium capitalize">{classification.kategori_ukuran}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Kendaraan</p>
              <p className="font-medium capitalize">{classification.rekomendasi_kendaraan ?? "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-neutral-500">Alasan</p>
              <p className="font-medium">{classification.alasan_kendaraan ?? "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-neutral-500">Lokasi</p>
              <p className="font-medium font-mono text-xs">
                {lat?.toFixed(6)}, {lng?.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Deskripsi (opsional)
          </label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Tambahkan deskripsi..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetAll}
            className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Menyimpan..." : "Kirim Laporan"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h2 className="text-lg font-bold">Ambil Foto Tumpukan Sampah</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Arahkan kamera ke tumpukan sampah di pinggir jalan
        </p>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
      >
        <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="size-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-emerald-600">Ketuk untuk mengambil foto</p>
        <p className="mt-1 text-xs text-neutral-400">Gunakan kamera belakang</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileCapture}
      />

      <button
        onClick={() => router.push("/user")}
        className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
      >
        Kembali
      </button>
    </div>
  );
}
