"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import jsQR from "jsqr";

interface RedemptionPayload {
  penukaran_id: string;
  user_id: string;
  produk_id: string;
  timestamp: number;
  signature: string;
}

interface RedemptionResult {
  penukaran_id: string;
  status: string;
  redeemed_at: string;
  produk: { nama_barang: string; jumlah_koin: number };
  user: { nama: string };
}

type ScanStep = "idle" | "scanning" | "decoded" | "success" | "error";

function ScanContent() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);

  const [step, setStep] = useState<ScanStep>("idle");
  const [payload, setPayload] = useState<RedemptionPayload | null>(null);
  const [result, setResult] = useState<RedemptionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirming, setConfirming] = useState(false);

  const stopCamera = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setStep("scanning");
    setErrorMsg("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        videoRef.current.onloadedmetadata = () => {
          scanFrame();
        };
      }
    } catch {
      setErrorMsg("Tidak dapat mengakses kamera. Izinkan akses kamera.");
      setStep("error");
    }
  }, []);

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      try {
        const parsed: RedemptionPayload = JSON.parse(code.data);
        if (parsed.penukaran_id && parsed.signature) {
          setPayload(parsed);
          setStep("decoded");
          stopCamera();
          return;
        }
      } catch {
        // not a valid payload, continue scanning
      }
    }

    animRef.current = requestAnimationFrame(scanFrame);
  }, [stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleConfirm = async () => {
    if (!payload) return;
    setConfirming(true);

    try {
      const res = await fetch("/api/kopdes/redeem/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_payload: payload }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Penukaran gagal");
        setStep("error");
        setConfirming(false);
        return;
      }

      setResult(data);
      setStep("success");
    } catch {
      setErrorMsg("Gagal terhubung ke server");
      setStep("error");
    }
    setConfirming(false);
  };

  const handleRetry = () => {
    setPayload(null);
    setResult(null);
    setErrorMsg("");
    startCamera();
  };

  if (step === "decoded" && payload) {
    return (
      <div className="space-y-4 p-6">
        <h2 className="text-lg font-bold">Konfirmasi Penukaran</h2>

        <div className="rounded-xl border bg-white p-4 space-y-3">
          <div>
            <p className="text-xs text-neutral-500">ID Penukaran</p>
            <p className="font-mono text-xs">{payload.penukaran_id.slice(0, 8)}...</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">ID Produk</p>
            <p className="font-mono text-xs">{payload.produk_id.slice(0, 8)}...</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Timestamp</p>
            <p className="text-sm font-medium">
              {new Date(payload.timestamp).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Scan Ulang
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {confirming ? "Memproses..." : "Konfirmasi"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "success" && result) {
    return (
      <div className="space-y-4 p-6 text-center">
        <div className="rounded-xl bg-green-50 p-6">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✓
          </div>
          <h2 className="text-lg font-bold text-green-800">Transaksi Berhasil!</h2>
          <div className="mt-4 space-y-2 text-left text-sm">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-neutral-500">Produk</p>
              <p className="font-medium">{result.produk.nama_barang}</p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-neutral-500">Koin</p>
              <p className="font-medium">{result.produk.jumlah_koin}</p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-neutral-500">Warga</p>
              <p className="font-medium">{result.user.nama}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Scan Lagi
          </button>
          <button
            onClick={() => router.push("/kopdes")}
            className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="space-y-4 p-6 text-center">
        <div className="rounded-xl bg-red-50 p-6">
          <p className="text-sm font-medium text-red-800">{errorMsg}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => router.push("/kopdes")}
            className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="text-center">
        <h2 className="text-lg font-bold">Pindai Kode QR</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Arahkan kamera ke QR code dari HP warga
        </p>
      </div>

      {step === "scanning" && (
        <div className="relative overflow-hidden rounded-xl bg-black">
          <video
            ref={videoRef}
            className="h-80 w-full object-cover"
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-48 rounded-lg border-2 border-white/60" />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="inline-block animate-pulse rounded-full bg-white/20 px-3 py-1 text-xs text-white">
              Memindai...
            </span>
          </div>
        </div>
      )}

      {step === "idle" && (
        <button
          onClick={startCamera}
          className="w-full rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50 p-12 text-center hover:bg-emerald-100 transition-colors"
        >
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="size-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-emerald-600">Buka Kamera Pemindai</p>
        </button>
      )}

      <button
        onClick={() => router.push("/kopdes")}
        className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
      >
        Kembali
      </button>
    </div>
  );
}

export default function ScanPage() {
  return (
    <ErrorBoundary>
      <ScanContent />
    </ErrorBoundary>
  );
}
