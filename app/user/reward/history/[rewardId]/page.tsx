"use client";

import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { useRewardDetail } from "./hooks/useRewardDetail";

// Slices
import { DetailHeader } from "./components/DetailHeader";
import { RedemptionCard } from "./components/RedemptionCard";
import { OtherInfoCard } from "./components/OtherInfoCard";
import { EcoTipsCard } from "./components/EcoTipsCard";

interface PageProps {
    params: Promise<{ rewardId: string }>;
}

function HistoryDetailContent({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { setHideTabBar } = useTabBar();
    const { data: detail, isLoading } = useRewardDetail(resolvedParams.rewardId);

    useEffect(() => {
        setHideTabBar(true);
        return () => setHideTabBar(false);
    }, [setHideTabBar]);

    const handleCopyId = () => {
        if (detail) {
            navigator.clipboard.writeText(detail.transactionId);
            alert("ID Transaksi disalin ke papan klip!");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4 p-4 animate-pulse">
                <div className="flex justify-between items-center h-10" />
                <div className="h-44 bg-gray-200 rounded-3xl" />
                <div className="h-40 bg-gray-200 rounded-3xl" />
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="p-8 text-center text-gray-500">
                Gagal memuat rincian transaksi penukaran.
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-32">
            {/* 1. Header back navigation */}
            <DetailHeader onBackClick={() => router.back()} />

            {/* 2. Redemption Main Card info */}
            <RedemptionCard
                itemName={detail.itemName}
                itemPrice={detail.itemPrice}
                imageUrl={detail.itemImageUrl}
                status={detail.status}
                merchantName={detail.merchantName}
                timestampText={detail.timestampText}
                transactionId={detail.transactionId}
                onCopyId={handleCopyId}
            />

            {/* 3. Other Information details table */}
            <OtherInfoCard
                storeLocation={detail.storeLocation}
                validUntil={detail.validUntil}
            />

            {/* 4. Eco Green Tips card pane */}
            <EcoTipsCard tipsText={detail.tipsDescription} />

            {/* 5. Bottom Back to Home Floating Button */}
            <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 shadow-lg">
                <button
                    onClick={() => router.push("/user")}
                    className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-95 text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <span>Kembali ke Beranda</span>
                    {/* MDI home-outline */}
                    <svg
                        className="w-4 h-4 fill-current text-emerald-200"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12,5.69L17,10.19V18H15V12H9V18H7V10.19L12,5.69M12,3L2,12H5V20H11V14H13V20H19V12H22L12,3Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function HistoryDetailPage({ params }: PageProps) {
    return (
        <ErrorBoundary>
            <HistoryDetailContent params={params} />
        </ErrorBoundary>
    );
}
