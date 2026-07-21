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
    <div className="bg-[#FAF9F5] min-h-screen pb-12 max-w-screen-sm mx-auto w-full flex flex-col justify-between">
      <div>
        {/* Header (WasteLens with Profile & Bell) */}
        <div className="flex h-16 items-center justify-between px-5 py-4 bg-[#FAF9F5] border-b border-gray-100/50 mb-2 select-none">
          <div className="flex items-center gap-3">
            {/* User Avatar with Circular Green Border */}
            <div className="relative w-10 h-10 rounded-full border-2 border-[#1E7D38] p-[1.5px] flex items-center justify-center bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="User Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xl font-extrabold text-[#1E7D38] tracking-tight">
              WasteLens
            </span>
          </div>
          <button className="relative p-1 text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-colors">
            {/* MDI bell-outline */}
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12,2A2,2 0 0,0 10,4A2,2 0 0,0 10,4.29C7.12,5.14 5,7.82 5,11V17L3,19V20H21V19L19,17V11C19,7.82 16.88,5.14 14,4.29A2,2 0 0,0 14,4A2,2 0 0,0 12,2M12,6A5,5 0 0,1 17,11V17H7V11A5,5 0 0,1 12,6M10,21A2,2 0 0,0 12,23A2,2 0 0,0 14,21H10Z" />
            </svg>
          </button>
        </div>

        {/* 1. Objek Sampah Belum Terdeteksi Card */}
        <ErrorCard onRetry={() => router.push("/user/scan")} />

        {/* 2. Tips List cards panel */}
        <TipsList tips={tips} />
      </div>
    </div>
  );
}
