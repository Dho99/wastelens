"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getQrDummyData, QrRedemptionDetail } from "./services/qrService";

// Slices
import { QrHeader } from "./components/QrHeader";
import { QrCodeCard } from "./components/QrCodeCard";
import { TransactionDetails } from "./components/TransactionDetails";
import { QrNotice } from "./components/QrNotice";
import { QrActions } from "./components/QrActions";

interface PageProps {
  params: Promise<{ storeId: string }>;
}

function GenerateQrContent({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [detail, setDetail] = useState<QrRedemptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    // Fetch mock details payload from service layer
    const data = getQrDummyData();
    setDetail(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="h-16 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat QR Code penukaran.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12">
      {/* 1. Header (Plain back arrow) */}
      <QrHeader onBackClick={() => router.back()} />

      {/* 2. QR Code Box (with timer & progress bar) */}
      <QrCodeCard
        merchantName={detail.merchantName}
        initialSeconds={detail.durationSeconds}
      />

      {/* 3. Transaction Details Grid (Item name, transaction ID) */}
      <TransactionDetails
        itemName={detail.itemName}
        transactionId={detail.transactionId}
      />

      {/* 4. Caution Notice alert banner */}
      <QrNotice />

      {/* 5. Action Buttons (Kembali ke Beranda, Butuh Bantuan) */}
      <QrActions
        onGoHome={() => router.push("/user")}
        onHelp={() => console.log("Contact support for assistance...")}
      />
    </div>
  );
}

export default function GenerateQrPage({ params }: PageProps) {
  return (
    <ErrorBoundary>
      <GenerateQrContent params={params} />
    </ErrorBoundary>
  );
}
