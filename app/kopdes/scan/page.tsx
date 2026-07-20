"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import {
  Zap,
  RefreshCw,
  CheckCircle2,
  Send,
  User,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

interface RecentScan {
  name: string;
  amount: string;
  active: boolean;
}

type ScanStep = "idle" | "scanning" | "decoded" | "success" | "error";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const recentScans: RecentScan[] = [
  { name: "Ahmad Yani", amount: "Rp 45.000", active: true },
  { name: "Siti Aminah", amount: "Rp 12.000", active: false },
];

// ---------------------------------------------------------------------------
// Corner bracket overlay
// ---------------------------------------------------------------------------

function ScanCorners() {
  const corner =
    "absolute size-10 border-emerald-400";
  return (
    <>
      {/* top-left */}
      <div className={`${corner} left-6 top-6 rounded-tl-xl border-l-4 border-t-4`} />
      {/* top-right */}
      <div className={`${corner} right-6 top-6 rounded-tr-xl border-r-4 border-t-4`} />
      {/* bottom-left */}
      <div className={`${corner} bottom-6 left-6 rounded-bl-xl border-b-4 border-l-4`} />
      {/* bottom-right */}
      <div className={`${corner} bottom-6 right-6 rounded-br-xl border-b-4 border-r-4`} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);
  const scanFrameRef = useRef<(() => void) | null>(null);

  const [step, setStep] = useState<ScanStep>("idle");
  const [payload, setPayload] = useState<RedemptionPayload | null>(null);
  const [result, setResult] = useState<RedemptionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirming, setConfirming] = useState(false);

  // -----------------------------------------------------------------------
  // Camera helpers
  // -----------------------------------------------------------------------

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
        "Kamera tidak tersedia. Pastikan Anda mengakses melalui HTTPS atau localhost.",
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
        await videoRef.current.play();

        videoRef.current.onloadedmetadata = () => {
          scanFrame();
        };
      }
    } catch {
      setErrorMsg("Tidak dapat mengakses kamera. Izinkan akses kamera.");
      setStep("error");
    }
  }, [scanFrame]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

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

  // -----------------------------------------------------------------------
  // Derived bill data
  // -----------------------------------------------------------------------

  const isScanned = step === "decoded" && payload;
  const isSuccess = step === "success" && result;
  const showBill = isScanned || isSuccess || step === "error";

  const bill = isSuccess
    ? {
        nama: result.user.nama,
        saldo: null as string | null,
        produk: result.produk.nama_barang,
        qty: 1,
        koin: result.produk.jumlah_koin,
        harga: null as number | null,
        total: null as string | null,
      }
    : isScanned
      ? {
          nama: "-",
          saldo: null,
          produk: "-",
          qty: 1,
          koin: 0,
          harga: null,
          total: null,
        }
      : {
          nama: "-",
          saldo: null,
          produk: "-",
          qty: 1,
          koin: 0,
          harga: null,
          total: null,
        };

  // -----------------------------------------------------------------------
  // Render helpers
  // -----------------------------------------------------------------------

  const renderCamera = () => {
    if (step === "error") {
      return (
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-neutral-100">
          <div className="text-center px-6">
            <p className="text-sm font-medium text-red-700">{errorMsg}</p>
            <button
              onClick={handleRetry}
              className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      );
    }

    if (step === "scanning") {
      return (
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />
          {/* Scan corner overlay */}
          <div className="absolute inset-0 z-10">
            <ScanCorners />
          </div>
          {/* Tooltip pill */}
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            <span className="whitespace-nowrap rounded-full bg-black/60 px-5 py-2.5 text-xs font-medium text-white">
              Arahkan QR Code Warga ke area ini
            </span>
          </div>
        </div>
      );
    }

    // idle
    return (
      <button
        onClick={startCamera}
        className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/15">
          <svg
            className="size-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
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
        <p className="text-sm font-semibold text-primary">
          Buka Kamera Pemindai
        </p>
      </button>
    );
  };

  const renderBill = () => {
    if (step === "success") {
      return (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/15">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-extrabold text-primary">
            Transaksi Berhasil!
          </h3>
          <div className="mt-4 w-full space-y-2 text-left text-sm">
            <div className="rounded-xl bg-neutral-50 p-3">
              <p className="text-xs text-neutral-400">Produk</p>
              <p className="font-semibold">{result!.produk.nama_barang}</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <p className="text-xs text-neutral-400">Koin</p>
              <p className="font-semibold">{result!.produk.jumlah_koin}</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <p className="text-xs text-neutral-400">Warga</p>
              <p className="font-semibold">{result!.user.nama}</p>
            </div>
          </div>
          <div className="mt-6 flex w-full gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Scan Lagi
            </button>
            <button
              onClick={() => router.push("/kopdes")}
              className="flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      );
    }

    if (step === "error") {
      return null; // error shown in camera panel, right side empty
    }

    return (
      <>
        {/* Status header */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-neutral-400">
            Status Pembayaran
          </p>
          <CheckCircle2 className="size-5 text-primary" />
        </div>
        <p className="mt-1 text-sm font-bold text-primary">
          Status: Saldo Mencukupi
        </p>

        {/* Identity & Balance card */}
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-neutral-100">
              <User className="size-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-neutral-400">
                Identitas Warga
              </p>
              <p className="text-sm font-semibold">{bill.nama}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-neutral-400">
              Saldo Tersedia
            </p>
            <p className="text-sm font-bold">Rp.0</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-5 border-neutral-200" />

        {/* Bill breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">Jenis Produk</span>
            <div className="text-right">
              <span className="font-semibold">{bill.produk}</span>
              {bill.qty > 0 && (
                <span className="ml-1 text-xs text-neutral-400">
                  {bill.qty}x
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">Subtotal Koin</span>
            <span className="font-semibold">
              {bill.koin > 0 ? bill.koin : "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">Subtotal Harga</span>
            <span className="font-semibold">
              {bill.harga != null ? `Rp ${bill.harga.toLocaleString("id-ID")}` : "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">Pajak (0%)</span>
            <span className="font-semibold">Rp 0</span>
          </div>

          {/* Dashed divider */}
          <hr className="border-dashed border-neutral-300" />

          <div className="flex items-center justify-between text-base">
            <span className="font-extrabold">TOTAL TAGIHAN</span>
            <span className="text-lg font-extrabold">
              {bill.total ?? "-"}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Confirm button */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleConfirm}
            disabled={step !== "decoded" || confirming}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-40 transition-colors"
          >
            {confirming ? "Memproses..." : "Konfirmasi Transaksi"}
            <Send className="size-4" />
          </button>
          <p className="text-center text-[11px] text-neutral-400">
            Pastikan data transaksi sudah benar sebelum konfirmasi
          </p>
        </div>
      </>
    );
  };

  // -----------------------------------------------------------------------
  // Main render
  // -----------------------------------------------------------------------

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* ================================================================= */}
      {/* LEFT COLUMN — Scanner */}
      {/* ================================================================= */}
      <div className="flex flex-1 flex-col p-4 lg:w-[60%] lg:p-6">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              Scanner Transaksi
            </h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Pindai QR Code untuk memulai pembayaran
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Toggle flash"
              className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 transition-colors"
            >
              <Zap className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Flip camera"
              className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 transition-colors"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>
        </div>

        {/* Camera area — min-h ensures scanner is usable on mobile */}
        <div className="flex min-h-[420px] flex-1 flex-col">
          {renderCamera()}
        </div>

        {/* Recent scan chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {recentScans.map((scan) => (
            <button
              key={scan.name}
              type="button"
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                scan.active
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  scan.active ? "bg-primary" : "bg-neutral-300"
                }`}
              />
              <span className="max-w-[140px] truncate">{scan.name}</span>
              <span className="tabular-nums">{scan.amount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* DIVIDER */}
      {/* ================================================================= */}
      <div className="mx-4 h-px bg-neutral-200 lg:mx-0 lg:h-auto lg:w-px" />

      {/* ================================================================= */}
      {/* RIGHT COLUMN — Bill Details */}
      {/* ================================================================= */}
      <div className="flex flex-col p-4 lg:w-[40%] lg:p-6">
        {renderBill()}
      </div>
    </div>
  );
}
