"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getExchangeDummyData, ExchangeTransaction } from "./services/exchangeService";

// Slices
import { ExchangeHeader } from "./components/ExchangeHeader";
import { ProductVisual } from "./components/ProductVisual";
import { AlertBanner } from "./components/AlertBanner";
import { DetailsCard } from "./components/DetailsCard";
import { NoticeBanner } from "./components/NoticeBanner";
import { RedeemBar } from "./components/RedeemBar";
import { InsufficientCoins } from "./components/InsufficientCoins";

interface PageProps {
  params: Promise<{ storeId: string }>;
}

function ExchangeContent({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const [tx, setTx] = useState<ExchangeTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { setHideTabBar } = useTabBar();

  // Check query parameter for insufficient balance test trigger
  const isInsufficientQuery = searchParams.get("error") === "insufficient";

  useEffect(() => {
    // Fetch mock exchange detail payload from service layer
    const data = getExchangeDummyData();
    setTx(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const handleRedeem = () => {
    console.log("Exchanging coins for coupon... redirecting to QR code");
    router.push(`/user/reward/store/${resolvedParams.storeId}/exchange/generate-qr`);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-56 bg-gray-200 rounded-3xl" />
        <div className="h-16 bg-gray-200 rounded-2xl" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat halaman konfirmasi penukaran.
      </div>
    );
  }

  // Calculate remaining balance
  const remainingCoins = tx.userBalance - tx.productPrice;

  // Toggle fallback state if insufficient query is active, or if user balance is too low
  const isInsufficient = isInsufficientQuery || tx.userBalance < tx.productPrice;

  if (isInsufficient) {
    // If testing insufficient balance, we'll mock that we need "750 koin lagi" as per screenshot
    const neededCoins = isInsufficientQuery ? 750 : (tx.productPrice - tx.userBalance);
    return (
      <InsufficientCoins
        neededCoins={neededCoins}
        onRetryScan={() => router.push("/user/scan")}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32">
      {/* 1. Header (Plain back arrow) */}
      <ExchangeHeader onBackClick={() => router.back()} />

      {/* 2. Visual Product Image */}
      <ProductVisual
        productName={tx.productName}
        imageUrl={tx.productImageUrl}
        isAvailable={tx.isAvailable}
      />

      {/* 3. Alert Status Banner */}
      <AlertBanner />

      {/* 4. Details transaction Table */}
      <DetailsCard
        userBalance={tx.userBalance}
        productPrice={tx.productPrice}
        merchantName={tx.merchantName}
        method={tx.method}
      />

      {/* 5. Instruction Warning notice */}
      <NoticeBanner />

      {/* 6. Checkout action Footer */}
      <RedeemBar remainingCoins={remainingCoins} onRedeem={handleRedeem} />
    </div>
  );
}

export default function ExchangePage({ params }: PageProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
        <ExchangeContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}
