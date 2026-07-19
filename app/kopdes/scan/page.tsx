"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

type ScanStep = "idle" | "scanning" | "decoded" | "verifying" | "verified" | "confirming" | "success" | "error";

interface VerifyResponse {
  success: boolean;
  message?: string;
  data?: {
    redemptionId: string;
    status: string;
    product: { name: string; quantity: number };
    totalCoins: number;
    user: { displayName: string };
    createdAt: string;
    expiresAt: string;
  };
  errorCode?: string;
}

interface ConfirmResponse {
  success: boolean;
  message?: string;
  data?: {
    redemptionId: string;
    status: string;
    redeemedAt: string;
  };
  errorCode?: string;
}

function parseTokenFromInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const token = url.searchParams.get("token") ?? url.searchParams.get("t");
    if (token && token.length > 0) return token;
  } catch {
    // not a URL, treat as raw token
  }

  if (trimmed.length <= 256) return trimmed;
  return null;
}

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);
  const scanFrameRef = useRef<(() => void) | null>(null);

  const [step, setStep] = useState<ScanStep>("idle");
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyResponse["data"] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [confirming, setConfirming] = useState(false);

  const stopCamera = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animRef.current = requestAnimationFrame(() => scanFrameRef.current?.());
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
      const token = parseTokenFromInput(code.data);
      if (token) {
        setRawToken(token);
        setStep("decoded");
        stopCamera();
        return;
      }
    }

    animRef.current = requestAnimationFrame(() => scanFrameRef.current?.());
  }, [stopCamera]);

  useEffect(() => {
    scanFrameRef.current = scanFrame;
  });

  const startCamera = useCallback(async () => {
    setStep("scanning");
    setErrorMsg("");

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setErrorMsg(
        "Kamera tidak tersedia. Gunakan input manual sebagai alternatif.",
      );
      setStep("error");
      return;
    }

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
      setErrorMsg("Tidak dapat mengakses kamera. Gunakan input manual.");
      setStep("error");
    }
  }, [scanFrame]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleVerify = useCallback(async (token: string) => {
    setStep("verifying");
    setErrorMsg("");

    try {
      const res = await fetch("/api/kopdes/redemptions/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data: VerifyResponse = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message ?? data.errorCode ?? "QR tidak valid");
        setStep("error");
        return;
      }

      setVerifyResult(data.data ?? null);
      setStep("verified");
    } catch {
      setErrorMsg("Gagal terhubung ke server");
      setStep("error");
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!rawToken) return;
    setConfirming(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      const res = await fetch("/api/kopdes/redemptions/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ token: rawToken }),
      });

      const data: ConfirmResponse = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message ?? data.errorCode ?? "Konfirmasi gagal");
        setConfirming(false);
        return;
      }

      setStep("success");
    } catch {
      setErrorMsg("Gagal terhubung ke server");
    }
    setConfirming(false);
  }, [rawToken]);

  const handleManualSubmit = useCallback(() => {
    const token = parseTokenFromInput(manualInput);
    if (!token) {
      setErrorMsg("Token tidak valid. Masukkan URL QR atau token.");
      return;
    }
    setRawToken(token);
    setStep("decoded");
  }, [manualInput]);

  const handleRetry = () => {
    setRawToken(null);
    setVerifyResult(null);
    setErrorMsg("");
    setManualInput("");
    startCamera();
  };

  if (step === "decoded" && rawToken) {
    return (
      <div className="space-y-4 p-6">
        <h2 className="text-lg font-bold">Verifikasi QR</h2>
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <p className="text-xs text-neutral-500 break-all font-mono">
            {rawToken.slice(0, 24)}...
          </p>
          <p className="text-xs text-neutral-500">
            Tekan &ldquo;Verifikasi&rdquo; untuk memeriksa keabsahan QR
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            Scan Ulang
          </button>
          <button
            onClick={() => handleVerify(rawToken)}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Verifikasi
          </button>
        </div>
      </div>
    );
  }

  if (step === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="size-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="mt-4 text-sm text-neutral-500">Memverifikasi QR...</p>
      </div>
    );
  }

  if (step === "verified" && verifyResult) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">QR Valid</p>
        </div>

        <div className="rounded-xl border bg-white p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Produk</span>
            <span className="font-medium">{verifyResult.product.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Jumlah</span>
            <span className="font-medium">{verifyResult.product.quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Total Koin</span>
            <span className="font-medium">{verifyResult.totalCoins}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Pengguna</span>
            <span className="font-medium">{verifyResult.user.displayName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Kedaluwarsa</span>
            <span className="font-medium">
              {new Date(verifyResult.expiresAt).toLocaleTimeString("id-ID")}
            </span>
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
            {confirming ? "Memproses..." : "Konfirmasi Penyerahan"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="space-y-4 p-6 text-center">
        <div className="rounded-xl bg-green-50 p-6">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-green-100 text-2xl">
            &#10003;
          </div>
          <h2 className="text-lg font-bold text-green-800">Transaksi Berhasil!</h2>
          <p className="mt-2 text-sm text-green-700">
            Produk {verifyResult?.product.name ?? ""} telah diserahkan.
          </p>
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
          Arahkan kamera ke QR dari HP warga
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
            <svg
              className="size-8 text-emerald-600"
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
          </div>
          <p className="text-sm font-medium text-emerald-600">
            Buka Kamera Pemindai
          </p>
        </button>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-neutral-400">atau</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Input Manual (URL atau Token)
        </label>
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="https://...?v=1&t=... atau token"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-hidden"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleManualSubmit();
          }}
        />
        <button
          onClick={handleManualSubmit}
          disabled={!manualInput.trim()}
          className="w-full rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
        >
          Verifikasi Manual
        </button>
      </div>

      <button
        onClick={() => router.push("/kopdes")}
        className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
      >
        Kembali
      </button>
    </div>
  );
}
