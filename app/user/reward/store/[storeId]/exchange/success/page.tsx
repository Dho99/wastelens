"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getExchangeSuccessDummyData, ExchangeSuccessDetail } from "./services/successDetailService";

// Slices
import { SuccessHeader } from "./components/SuccessHeader";
import { SuccessBadge } from "./components/SuccessBadge";
import { RedeemedItemCard } from "./components/RedeemedItemCard";
import { TxDetailsCard } from "./components/TxDetailsCard";
import { TipsCard } from "./components/TipsCard";
import { SuccessActions } from "./components/SuccessActions";

interface PageProps {
  params: Promise<{ storeId: string }>;
}

function SuccessContent({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [detail, setDetail] = useState<ExchangeSuccessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    // Fetch mock details payload from service layer
    const data = getExchangeSuccessDummyData();
    setDetail(data);
    setLoading(false);
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-28 w-28 bg-gray-200 rounded-full mx-auto" />
        <div className="h-20 bg-gray-200 rounded-3xl" />
        <div className="h-28 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat detail sukses penukaran.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12">
      {/* 1. Header (Plain back arrow) */}
      <SuccessHeader onBackClick={() => router.back()} />

      {/* 2. Large Success Badge */}
      <SuccessBadge />

      {/* 3. Redeemed Product Details Card */}
      <RedeemedItemCard
        itemName={detail.productName}
        itemPrice={detail.productPrice}
        imageUrl={detail.productImageUrl}
      />

      {/* 4. Transaction Info logs */}
      <TxDetailsCard
        merchantName={detail.merchantName}
        timestamp={detail.timestampText}
        transactionId={detail.transactionId}
        onCopyId={handleCopyId}
      />

      {/* 5. Green Tips Card with maple/leaf MDI icon */}
      <TipsCard tipsText={detail.tipsDescription} />

      {/* 6. Navigation Actions (Beranda, Riwayat) */}
      <SuccessActions
        onGoHome={() => router.push("/user")}
        onViewHistory={() => router.push("/user/reward")}
      />
    </div>
  );
}

export default function ExchangeSuccessPage({ params }: PageProps) {
  return (
    <ErrorBoundary>
      <SuccessContent params={params} />
    </ErrorBoundary>
  );
}
