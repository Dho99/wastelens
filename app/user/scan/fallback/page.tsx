"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getFallbackTipsDummyData, TipItem } from "./services/fallbackService";

// Slices
import { ErrorCard } from "./components/ErrorCard";
import { TipsList } from "./components/TipsList";

export default function FallbackPage() {
  const router = useRouter();
  const [tips, setTips] = useState<TipItem[]>([]);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  useEffect(() => {
    // Load static tips items from fallback service layer
    const data = getFallbackTipsDummyData();
    setTips(data);
  }, []);

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12">
      {/* 1. Objek Sampah Belum Terdeteksi Card */}
      <ErrorCard onRetry={() => router.push("/user/scan")} />

      {/* 2. Tips List cards panel */}
      <TipsList tips={tips} />
    </div>
  );
}
