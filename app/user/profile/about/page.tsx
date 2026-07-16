"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getAboutDummyData, AboutDetail } from "./services/aboutService";

// Slices
import { AboutHeader } from "./components/AboutHeader";
import { AppBranding } from "./components/AppBranding";
import { MissionCard } from "./components/MissionCard";
import { LegalList } from "./components/LegalList";
import { SocialGrid } from "./components/SocialGrid";

function AboutPageContent() {
  const router = useRouter();
  const [data, setData] = useState<AboutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    // Fetch mock about data payload from service layer
    const aboutData = getAboutDummyData();
    setData(aboutData);
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
        <div className="h-28 w-28 bg-gray-200 rounded-full mx-auto" />
        <div className="h-6 w-32 bg-gray-200 rounded-md mx-auto" />
        <div className="h-32 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat rincian tentang aplikasi.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12 flex flex-col justify-between">
      <div>
        {/* 1. Header (Tentang title & back arrow) */}
        <AboutHeader onBackClick={() => router.back()} />

        {/* 2. Logo Branding placeholder & versions */}
        <AppBranding appName={data.appName} version={data.appVersion} />

        {/* 3. Misi Kami Info Card */}
        <MissionCard description={data.missionDescription} />

        {/* 4. Legal T&Cs and Privacy Links List */}
        <LegalList
          onTermsClick={() => console.log("Navigate to Terms & Conditions...")}
          onPrivacyClick={() => console.log("Navigate to Privacy Policy...")}
        />

        {/* 5. Social Contact Us icon grid */}
        <SocialGrid onLinkClick={(channel) => console.log(`Opening channel: ${channel}...`)} />
      </div>

      {/* 6. Footer copyright text */}
      <div className="text-center px-6 select-none mt-4">
        <p className="text-[10px] text-gray-400 font-extrabold leading-relaxed">
          {data.copyrightText}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <ErrorBoundary>
      <AboutPageContent />
    </ErrorBoundary>
  );
}
