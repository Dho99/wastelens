"use client";

import React, {
    useEffect,
    useState,
    useCallback,
    useRef,
    Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

import {
    fetchQrRedemptionDetail,
    cancelRedemption,
} from "./services/qrService";

import { QrHeader } from "./components/QrHeader";
import { QrCodeCard } from "./components/QrCodeCard";
import { TransactionDetails } from "./components/TransactionDetails";
import { QrNotice } from "./components/QrNotice";
import { QrActions } from "./components/QrActions";

const POLL_DELAY = 5000;

interface PageProps {
    params: Promise<{ storeId: string }>;
}

function GenerateQrContent({ params }: PageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setHideTabBar } = useTabBar();

    const redemptionId =
        searchParams.get("redemptionId") ?? searchParams.get("id");

    const [detail, setDetail] = useState<Awaited<
        ReturnType<typeof fetchQrRedemptionDetail>
    > | null>(null);
    const [loading, setLoading] = useState(!redemptionId ? false : true);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const timeoutRef = useRef<number | null>(null);
    const requestRunningRef = useRef(false);
    const stoppedRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setHideTabBar(true);
        return () => setHideTabBar(false);
    }, [setHideTabBar]);

    useEffect(() => {
        if (!redemptionId) {
            return;
        }

        stoppedRef.current = false;

        async function poll() {
            if (stoppedRef.current) return;
            if (requestRunningRef.current) return;

            if (document.visibilityState !== "visible") {
                scheduleNext();
                return;
            }

            requestRunningRef.current = true;

            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            // console.debug("[redemption-poll]", {
            //     redemptionId,
            //     at: new Date().toISOString(),
            // });

            let shouldContinue = false;

            try {
                const data = await fetchQrRedemptionDetail(
                    redemptionId as string,
                    abortControllerRef.current.signal,
                );

                console.log(data);

                if (stoppedRef.current) return;

                setDetail(data);
                setError(null);
                setLoading(false);

                shouldContinue = data.status === "PENDING";
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                if (!stoppedRef.current) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Terjadi kesalahan",
                    );

                    setLoading(false);
                    shouldContinue = true;
                }
            } finally {
                requestRunningRef.current = false;
            }

            if (shouldContinue && !stoppedRef.current) {
                scheduleNext();
            }
        }

        function scheduleNext() {
            if (stoppedRef.current) return;

            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = window.setTimeout(
                () => void poll(),
                POLL_DELAY,
            );
        }

        void poll();

        function handleVisibilityChange() {
            if (document.visibilityState === "visible" && !stoppedRef.current) {
                if (timeoutRef.current !== null) {
                    window.clearTimeout(timeoutRef.current);
                }

                void poll();
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            stoppedRef.current = true;
            requestRunningRef.current = false;

            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }

            abortControllerRef.current?.abort();

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, [redemptionId]);

    const handleCancel = useCallback(async () => {
        if (!redemptionId) return;

        setCancelling(true);
        try {
            await cancelRedemption(redemptionId);
            stoppedRef.current = true;
            setDetail((prev) =>
                prev
                    ? { ...prev, status: "CANCELLED" as const }
                    : prev,
            );
        } catch (e: unknown) {
            if (!stoppedRef.current) {
                setError(e instanceof Error ? e.message : "Gagal membatalkan");
            }
        } finally {
            setCancelling(false);
        }
    }, [redemptionId]);

    if (loading) {
        return (
            <div className="space-y-4 p-4 animate-pulse bg-[#FAF9F5] min-h-screen">
                <div className="flex justify-between items-center h-10" />
                <div className="h-64 bg-gray-200 rounded-3xl" />
                <div className="h-16 bg-gray-200 rounded-2xl" />
                <div className="h-20 bg-gray-200 rounded-2xl" />
            </div>
        );
    }

    if (!redemptionId) {
        return (
            <div className="p-8 text-center text-gray-500 bg-[#FAF9F5] min-h-screen">
                ID penukaran tidak ditemukan.
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="p-8 text-center text-gray-500 bg-[#FAF9F5] min-h-screen">
                {error || "Gagal memuat QR Code penukaran."}
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-12">
            <QrHeader onBackClick={() => router.back()} />

            {error && (
                <div className="px-4 mb-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-2xl">
                        {error}
                    </div>
                </div>
            )}

            <QrCodeCard
                merchantName={detail.merchantName}
                qrisData={detail.qrisData}
                initialSeconds={detail.durationSeconds}
                status={detail.status}
            />

            <TransactionDetails
                itemName={detail.itemName}
                transactionId={detail.transactionId}
                quantity={detail.quantity}
                totalCoins={detail.totalCoins}
                status={detail.status}
            />

            <QrNotice />

            <QrActions
                status={detail.status}
                onGoHome={() => router.push("/user")}
                onCancel={handleCancel}
                onHelp={() => console.log("Contact support...")}
                cancelling={cancelling}
            />
        </div>
    );
}

export default function GenerateQrPage({ params }: PageProps) {
    return (
        <ErrorBoundary>
            <Suspense
                fallback={<div className="p-8 text-center">Memuat...</div>}
            >
                <GenerateQrContent params={params} />
            </Suspense>
        </ErrorBoundary>
    );
}
