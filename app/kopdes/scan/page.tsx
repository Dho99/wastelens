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
    Camera,
    History,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types (mirrors server/modules/redemption/redemption.types.ts)
// ---------------------------------------------------------------------------

type ScanStep =
    | "idle"
    | "scanning"
    | "decoded"
    | "verifying"
    | "verified"
    | "confirming"
    | "success"
    | "error";

interface VerifyResponse {
    success: boolean;
    error?: string;
    code?: string;
    data?: {
        redemptionId: string;
        status: string;
        product: { name: string; quantity: number };
        totalCoins: number;
        user: { displayName: string };
        createdAt: string;
        expiresAt: string;
    };
}

interface ConfirmResponse {
    success: boolean;
    error?: string;
    code?: string;
    data?: {
        redemptionId: string;
        status: string;
        redeemedAt: string;
    };
}

interface HistoryItem {
    id: string;
    user_nama: string;
    produk_nama: string;
    jumlah_koin: number;
    status: string;
    redeemed_at: string | null;
    created_at: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseTokenFromInput(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
        const url = new URL(trimmed);
        const candidate =
            url.searchParams.get("token") ?? url.pathname.split("/").pop();
        if (candidate && candidate.length >= 8) return candidate;
    } catch {
        // not a URL, treat as raw token
    }
    return trimmed.length >= 8 ? trimmed : null;
}

function formatCountdown(ms: number): string {
    if (ms <= 0) return "Kedaluwarsa";
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

function statusBadgeClass(status: string): string {
    switch (status) {
        case "REDEEMED":
            return "bg-emerald-100 text-emerald-700";
        case "EXPIRED":
            return "bg-red-100 text-red-700";
        case "CANCELLED":
            return "bg-neutral-100 text-neutral-500";
        default:
            return "bg-amber-100 text-amber-700";
    }
}

function statusLabel(status: string): string {
    switch (status) {
        case "REDEEMED":
            return "Sukses";
        case "EXPIRED":
            return "Kedaluwarsa";
        case "CANCELLED":
            return "Dibatalkan";
        default:
            return "Pending";
    }
}

const ERROR_CODE_LABELS: Record<string, string> = {
    QR_INVALID: "QR Tidak Valid",
    QR_ALREADY_USED: "QR Sudah Digunakan",
    QR_EXPIRED: "QR Kedaluwarsa",
    QR_CANCELLED: "QR Dibatalkan",
    QR_NOT_VALID_FOR_THIS_COOPERATIVE: "Bukan untuk Koperasi Ini",
    UNAUTHENTICATED: "Sesi Habis",
    FORBIDDEN: "Akses Ditolak",
    IDEMPOTENCY_KEY_REQUIRED: "Konfirmasi Gagal",
    TRANSACTION_CONFLICT: "Konflik Transaksi",
    INTERNAL_ERROR: "Kesalahan Server",
};

// ---------------------------------------------------------------------------
// Corner bracket overlay
// ---------------------------------------------------------------------------

function ScanCorners() {
    const corner = "absolute size-10 border-emerald-400";
    return (
        <>
            <div
                className={`${corner} left-6 top-6 rounded-tl-xl border-l-4 border-t-4`}
            />
            <div
                className={`${corner} right-6 top-6 rounded-tr-xl border-r-4 border-t-4`}
            />
            <div
                className={`${corner} bottom-6 left-6 rounded-bl-xl border-b-4 border-l-4`}
            />
            <div
                className={`${corner} bottom-6 right-6 rounded-br-xl border-b-4 border-r-4`}
            />
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
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [step, setStep] = useState<ScanStep>("idle");
    const [rawToken, setRawToken] = useState<string | null>(null);
    const [verifyResult, setVerifyResult] = useState<
        VerifyResponse["data"] | null
    >(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const [manualInput, setManualInput] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [torchOn, setTorchOn] = useState(false);
    const [facingMode, setFacingMode] = useState<"environment" | "user">(
        "environment",
    );
    const [expiryCountdown, setExpiryCountdown] = useState<string | null>(null);
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    // -----------------------------------------------------------------------
    // Fetch recent history
    // -----------------------------------------------------------------------

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch("/api/kopdes/redeem/history?limit=5");
                if (!res.ok) return;
                const json = await res.json();
                if (!cancelled) {
                    setHistoryItems(json.data ?? []);
                }
            } catch {
                // silently fail — history is non-critical
            } finally {
                if (!cancelled) setHistoryLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // -----------------------------------------------------------------------
    // Camera helpers
    // -----------------------------------------------------------------------

    const stopCamera = useCallback(() => {
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
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
        if (
            video.readyState !== video.HAVE_ENOUGH_DATA ||
            !video.videoWidth ||
            !video.videoHeight
        ) {
            animRef.current = requestAnimationFrame(() =>
                scanFrameRef.current?.(),
            );
            return;
        }
        const maxWidth = 720;
        const scale = Math.min(1, maxWidth / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            const token = parseTokenFromInput(code.data);
            if (token) {
                navigator.vibrate?.(200);
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

    const startCamera = useCallback(
        async (facing?: "environment" | "user") => {
            const mode = facing ?? facingMode;
            setStep("scanning");
            setErrorMsg("");
            setErrorCode(null);
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
                    video: { facingMode: mode },
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    const video = videoRef.current;
                    video.srcObject = stream;
                    video.playsInline = true;
                    const startScan = () => scanFrameRef.current?.();
                    video.onloadedmetadata = startScan;
                    video.onloadeddata = startScan;
                    video.play().catch(() => {});
                }
            } catch {
                setErrorMsg(
                    "Tidak dapat mengakses kamera. Gunakan input manual.",
                );
                setStep("error");
            }
        },
        [facingMode, scanFrame],
    );

    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    const toggleTorch = useCallback(async () => {
        if (!streamRef.current) return;
        const track = streamRef.current.getVideoTracks()[0];
        try {
            const capabilities =
                track.getCapabilities() as MediaTrackCapabilities & {
                    torch?: boolean;
                };
            if (!capabilities.torch) return;
            await track.applyConstraints({
                advanced: [
                    { torch: !torchOn } as unknown as MediaTrackConstraintSet,
                ],
            });
            setTorchOn(!torchOn);
        } catch {
            // torch not supported
        }
    }, [torchOn]);

    const switchCamera = useCallback(() => {
        const next = facingMode === "environment" ? "user" : "environment";
        setFacingMode(next);
        stopCamera();
        // small timeout to let stopCamera clean up before restarting
        setTimeout(() => startCamera(next), 100);
    }, [facingMode, startCamera, stopCamera]);

    // -----------------------------------------------------------------------
    // API calls
    // -----------------------------------------------------------------------

    const handleVerify = useCallback(async (token: string) => {
        setStep("verifying");
        setErrorMsg("");
        setErrorCode(null);
        try {
            const res = await fetch("/api/kopdes/redemptions/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data: VerifyResponse = await res.json();
            if (!res.ok || !data.success) {
                setErrorMsg(data.error ?? "QR tidak valid");
                setErrorCode(data.code ?? null);
                setStep("error");
                return;
            }
            setVerifyResult(data.data ?? null);
            setStep("verified");
        } catch {
            setErrorMsg("Gagal terhubung ke server");
            setErrorCode("NETWORK_ERROR");
            setStep("error");
        }
    }, []);

    // Start countdown when reaching "verified" step
    useEffect(() => {
        if (step !== "verified" || !verifyResult) {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            setExpiryCountdown(null);
            return;
        }

        const expiresAt = new Date(verifyResult.expiresAt).getTime();

        function tick() {
            const remaining = expiresAt - Date.now();
            if (remaining <= 0) {
                setExpiryCountdown("Kedaluwarsa");
                clearInterval(countdownRef.current!);
                countdownRef.current = null;
                return;
            }
            setExpiryCountdown(formatCountdown(remaining));
        }

        tick();
        countdownRef.current = setInterval(tick, 1000);

        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
        };
    }, [step, verifyResult]);

    const handleConfirm = useCallback(async () => {
        if (!rawToken) return;
        setStep("confirming");
        setConfirming(true);
        setErrorMsg("");
        setErrorCode(null);
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
            if (!res.ok || !data.success) {
                setErrorMsg(data.error ?? "Konfirmasi gagal");
                setErrorCode(data.code ?? null);
                setStep("error");
                return;
            }
            setStep("success");
        } catch {
            setErrorMsg("Gagal terhubung ke server");
            setErrorCode("NETWORK_ERROR");
            setStep("error");
        }
        setConfirming(false);
    }, [rawToken]);

    const handleManualSubmit = useCallback(() => {
        const token = parseTokenFromInput(manualInput);
        if (!token) {
            setErrorMsg(
                "Token tidak valid. Masukkan URL QR atau token dengan minimal 8 karakter.",
            );
            setErrorCode("INVALID_TOKEN");
            return;
        }
        setRawToken(token);
        setStep("decoded");
        setErrorMsg("");
        setErrorCode(null);
    }, [manualInput]);

    const handleRetry = useCallback(() => {
        setRawToken(null);
        setVerifyResult(null);
        setErrorMsg("");
        setErrorCode(null);
        setManualInput("");
        setTorchOn(false);
        setExpiryCountdown(null);
        startCamera();
    }, [startCamera]);

    // -----------------------------------------------------------------------
    // renderCamera — left column
    // -----------------------------------------------------------------------

    function renderCamera() {
        if (step === "scanning") {
            return (
                <div
                    className="relative overflow-hidden rounded-xl bg-black"
                    style={{ aspectRatio: "4/3" }}
                >
                    <video
                        ref={videoRef}
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay
                        playsInline
                        muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 z-10">
                        <ScanCorners />
                    </div>
                    <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
                        <span className="whitespace-nowrap rounded-full bg-black/60 px-5 py-2.5 text-xs font-medium text-white">
                            Arahkan QR Code Warga ke area ini
                        </span>
                    </div>
                </div>
            );
        }

        if (step === "decoded" && rawToken) {
            return (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Verifikasi QR</h2>
                    <div className="rounded-xl border bg-white p-4 space-y-3">
                        <p className="text-xs text-neutral-500 break-all font-mono">
                            {rawToken.slice(0, 24)}...
                        </p>
                        <p className="text-xs text-neutral-500">
                            Tekan &ldquo;Verifikasi&rdquo; untuk memeriksa
                            keabsahan QR
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

        if (step === "verifying" || step === "confirming") {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="size-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="mt-4 text-sm text-neutral-500">
                        {step === "verifying"
                            ? "Memverifikasi QR..."
                            : "Memproses transaksi..."}
                    </p>
                </div>
            );
        }

        if (step === "verified" && verifyResult) {
            return (
                <div className="space-y-4">
                    <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-emerald-800">
                                QR Valid
                            </p>
                            {expiryCountdown && (
                                <span
                                    className={`text-xs font-bold font-mono ${expiryCountdown === "Kedaluwarsa" ? "text-red-600" : "text-emerald-600"}`}
                                >
                                    {expiryCountdown === "Kedaluwarsa"
                                        ? expiryCountdown
                                        : `Sisa ${expiryCountdown}`}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Produk</span>
                            <span className="font-medium">
                                {verifyResult.product.name}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Jumlah</span>
                            <span className="font-medium">
                                {verifyResult.product.quantity}x
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Total Koin</span>
                            <span className="font-medium">
                                {verifyResult.totalCoins}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Pengguna</span>
                            <span className="font-medium">
                                {verifyResult.user.displayName}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">
                                Kedaluwarsa
                            </span>
                            <span className="font-medium">
                                {new Date(
                                    verifyResult.expiresAt,
                                ).toLocaleTimeString("id-ID")}
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
                            disabled={
                                confirming || expiryCountdown === "Kedaluwarsa"
                            }
                            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                            {confirming
                                ? "Memproses..."
                                : "Konfirmasi Penyerahan"}
                        </button>
                    </div>
                </div>
            );
        }

        if (step === "success") {
            return (
                <div className="space-y-4 text-center">
                    <div className="rounded-xl bg-green-50 p-6">
                        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-green-100 text-2xl">
                            &#10003;
                        </div>
                        <h2 className="text-lg font-bold text-green-800">
                            Transaksi Berhasil!
                        </h2>
                        <p className="mt-2 text-sm text-green-700">
                            Produk {verifyResult?.product.name ?? ""} telah
                            diserahkan.
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
                <div className="space-y-4">
                    {errorCode && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                                    {ERROR_CODE_LABELS[errorCode] ?? errorCode}
                                </span>
                            </div>
                            <p className="text-sm text-red-800">{errorMsg}</p>
                        </div>
                    )}
                    {!errorCode && (
                        <div className="rounded-xl bg-red-50 p-6 text-center">
                            <p className="text-sm font-medium text-red-800">
                                {errorMsg}
                            </p>
                        </div>
                    )}
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

        // idle — default
        return (
            <button
                onClick={() => startCamera()}
                className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-emerald-400/30 bg-emerald-50/50 hover:bg-emerald-50 transition-colors min-h-[300px]"
            >
                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                        className="size-8 text-emerald-600"
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
                <p className="text-sm font-semibold text-emerald-600">
                    Buka Kamera Pemindai
                </p>
            </button>
        );
    }

    // -----------------------------------------------------------------------
    // renderBill — right column
    // -----------------------------------------------------------------------

    // function renderBill() {
    //     if (step === "success" && verifyResult) {
    //         return (
    //             <div className="flex flex-1 flex-col items-center justify-center text-center">
    //                 <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
    //                     <CheckCircle2 className="size-8 text-emerald-600" />
    //                 </div>
    //                 <h3 className="mt-4 text-lg font-extrabold text-emerald-600">
    //                     Transaksi Berhasil!
    //                 </h3>
    //                 <div className="mt-4 w-full space-y-2 text-left text-sm">
    //                     <div className="rounded-xl bg-neutral-50 p-3">
    //                         <p className="text-xs text-neutral-400">Produk</p>
    //                         <p className="font-semibold">
    //                             {verifyResult.product.name}
    //                         </p>
    //                     </div>
    //                     <div className="rounded-xl bg-neutral-50 p-3">
    //                         <p className="text-xs text-neutral-400">Koin</p>
    //                         <p className="font-semibold">
    //                             {verifyResult.totalCoins}
    //                         </p>
    //                     </div>
    //                     <div className="rounded-xl bg-neutral-50 p-3">
    //                         <p className="text-xs text-neutral-400">Warga</p>
    //                         <p className="font-semibold">
    //                             {verifyResult.user.displayName}
    //                         </p>
    //                     </div>
    //                 </div>
    //                 <div className="mt-6 flex w-full gap-3">
    //                     <button
    //                         onClick={handleRetry}
    //                         className="flex-1 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
    //                     >
    //                         Scan Lagi
    //                     </button>
    //                     <button
    //                         onClick={() => router.push("/kopdes")}
    //                         className="flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
    //                     >
    //                         Dashboard
    //                     </button>
    //                 </div>
    //             </div>
    //         );
    //     }

    //     if (step === "error") return null;

    //     if (step === "verified" && verifyResult) {
    //         return (
    //             <>
    //                 <div className="flex items-center justify-between">
    //                     <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-neutral-400">
    //                         Detail Transaksi
    //                     </p>
    //                     <CheckCircle2 className="size-5 text-emerald-600" />
    //                 </div>
    //                 <div className="mt-5 space-y-3 text-sm">
    //                     <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
    //                         <div className="flex items-center gap-3">
    //                             <div className="flex size-9 items-center justify-center rounded-full bg-neutral-100">
    //                                 <User className="size-4 text-neutral-500" />
    //                             </div>
    //                             <div>
    //                                 <p className="text-[10px] uppercase tracking-wide text-neutral-400">
    //                                     Warga
    //                                 </p>
    //                                 <p className="text-sm font-semibold">
    //                                     {verifyResult.user.displayName}
    //                                 </p>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div className="rounded-xl bg-neutral-50 p-3 flex justify-between">
    //                         <span className="text-neutral-600">Produk</span>
    //                         <span className="font-semibold">
    //                             {verifyResult.product.name}{" "}
    //                             {verifyResult.product.quantity}x
    //                         </span>
    //                     </div>
    //                     <div className="rounded-xl bg-neutral-50 p-3 flex justify-between">
    //                         <span className="text-neutral-600">Total Koin</span>
    //                         <span className="font-semibold">
    //                             {verifyResult.totalCoins}
    //                         </span>
    //                     </div>
    //                     <div className="flex justify-between text-xs text-neutral-400">
    //                         <span>
    //                             ID: {verifyResult.redemptionId.slice(0, 8)}...
    //                         </span>
    //                     </div>
    //                 </div>
    //                 {expiryCountdown && (
    //                     <div className="mt-3 text-center">
    //                         <span
    //                             className={`text-xs font-bold font-mono ${expiryCountdown === "Kedaluwarsa" ? "text-red-600" : "text-amber-600"}`}
    //                         >
    //                             {expiryCountdown === "Kedaluwarsa"
    //                                 ? "QR telah kedaluwarsa"
    //                                 : `Sisa waktu: ${expiryCountdown}`}
    //                         </span>
    //                     </div>
    //                 )}
    //                 <div className="flex-1" />
    //                 <div className="mt-4 space-y-2">
    //                     <button
    //                         onClick={handleConfirm}
    //                         disabled={
    //                             confirming || expiryCountdown === "Kedaluwarsa"
    //                         }
    //                         className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 transition-colors"
    //                     >
    //                         {confirming
    //                             ? "Memproses..."
    //                             : "Konfirmasi Transaksi"}
    //                         <Send className="size-4" />
    //                     </button>
    //                     <p className="text-center text-[11px] text-neutral-400">
    //                         Pastikan data transaksi sudah benar sebelum
    //                         konfirmasi
    //                     </p>
    //                 </div>
    //             </>
    //         );
    //     }

    //     // idle / scanning / decoded — placeholder
    //     return (
    //         <>
    //             <div className="flex items-center justify-between">
    //                 <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-neutral-400">
    //                     Status Pembayaran
    //                 </p>
    //                 <Camera className="size-4 text-emerald-500" />
    //             </div>
    //             <p className="mt-1 text-sm font-bold text-emerald-600">
    //                 Menunggu pemindaian...
    //             </p>
    //             <div className="mt-5 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
    //                 <div className="flex items-center gap-3">
    //                     <div className="flex size-9 items-center justify-center rounded-full bg-neutral-100">
    //                         <User className="size-4 text-neutral-500" />
    //                     </div>
    //                     <div>
    //                         <p className="text-[10px] uppercase tracking-wide text-neutral-400">
    //                             Identitas Warga
    //                         </p>
    //                         <p className="text-sm font-semibold">-</p>
    //                     </div>
    //                 </div>
    //                 <div className="text-right">
    //                     <p className="text-[10px] uppercase tracking-wide text-neutral-400">
    //                         Saldo Tersedia
    //                     </p>
    //                     <p className="text-sm font-bold">-</p>
    //                 </div>
    //             </div>

    //             <div className="flex-1" />

    //             {/* Recent scans */}
    //             <div className="mt-4">
    //                 <div className="flex items-center gap-1.5 mb-2">
    //                     <History className="size-3 text-neutral-400" />
    //                     <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
    //                         Riwayat
    //                     </p>
    //                 </div>
    //                 {historyLoading ? (
    //                     <div className="flex items-center gap-2 text-xs text-neutral-400 py-2">
    //                         <div className="size-3 animate-spin rounded-full border-2 border-neutral-300 border-t-emerald-500" />
    //                         Memuat...
    //                     </div>
    //                 ) : historyItems.length === 0 ? (
    //                     <p className="text-xs text-neutral-400 py-2">
    //                         Belum ada transaksi
    //                     </p>
    //                 ) : (
    //                     <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
    //                         {historyItems.map((item) => (
    //                             <div
    //                                 key={item.id}
    //                                 className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2"
    //                             >
    //                                 <div className="min-w-0 flex-1">
    //                                     <p className="text-xs font-semibold text-neutral-700 truncate">
    //                                         {item.produk_nama}
    //                                     </p>
    //                                     <p className="text-[10px] text-neutral-400">
    //                                         {item.user_nama}
    //                                     </p>
    //                                 </div>
    //                                 <span
    //                                     className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${statusBadgeClass(item.status)}`}
    //                                 >
    //                                     {statusLabel(item.status)}
    //                                 </span>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //             </div>
    //         </>
    //     );
    // }

    // -----------------------------------------------------------------------
    // Main render
    // -----------------------------------------------------------------------

    return (
        <div className="flex h-full flex-col lg:flex-row">
            {/* LEFT COLUMN — Scanner */}
            <div className="flex flex-1 flex-col p-4 lg:w-[60%] lg:p-6">
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
                            onClick={toggleTorch}
                            className={`grid size-9 place-items-center rounded-full border transition-colors ${
                                torchOn
                                    ? "bg-emerald-100 border-emerald-300 text-emerald-600"
                                    : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100"
                            }`}
                        >
                            <Zap className="size-4" />
                        </button>
                        <button
                            type="button"
                            aria-label="Flip camera"
                            onClick={switchCamera}
                            className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 transition-colors"
                        >
                            <RefreshCw className="size-4" />
                        </button>
                    </div>
                </div>

                <div className="flex min-h-[420px] flex-1 flex-col">
                    {renderCamera()}
                </div>

                {/* Manual input — always visible as fallback */}
                {/* <div className="mt-3 flex gap-2">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Atau masukkan token / URL QR manual..."
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleManualSubmit();
                            }}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                    </div>
                    <button
                        onClick={handleManualSubmit}
                        disabled={!manualInput.trim()}
                        className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-emerald-700 transition-colors"
                    >
                        Kirim
                    </button>
                </div> */}
            </div>

            {/* DIVIDER */}
            {/* <div className="mx-4 h-px bg-neutral-200 lg:mx-0 lg:h-auto lg:w-px" /> */}

            {/* RIGHT COLUMN — Bill Details */}
            {/* <div className="flex flex-col p-4 lg:w-[40%] lg:p-6">
                {renderBill()}
            </div> */}
        </div>
    );
}
