"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getConfirmDummyData, ConfirmData } from "./services/confirmService";

// Slices
import { ConfirmHeader } from "./components/ConfirmHeader";
import { ConfirmStepper } from "./components/ConfirmStepper";
import { ConfirmVisuals } from "./components/ConfirmVisuals";
import { DetectedLocation } from "./components/DetectedLocation";
import { ReportDetailsCard } from "./components/ReportDetailsCard";
import { ActionSubmit } from "./components/ActionSubmit";

export default function ConfirmPage() {
  const router = useRouter();
  const [data, setData] = useState<ConfirmData | null>(null);
  const [loading, setLoading] = useState(true);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  useEffect(() => {
    // Load confirm mock dataset from service layer
    const mockData = getConfirmDummyData();
    setData(mockData);
    setLoading(false);
  }, []);

  const handleSubmitReport = () => {
    console.log("Confirming report detail... redirecting to processing AI validation");
    router.push("/user/scan/validation");
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-8 w-48 bg-gray-200 rounded-md mx-auto" />
        <div className="h-56 bg-gray-200 rounded-3xl" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat konfirmasi laporan.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12">
      {/* 1. Header (Konfirmasi Laporan) */}
      <ConfirmHeader
        onBackClick={() => router.back()}
        onHelpClick={() => console.log("Show confirmation help instructions...")}
      />

      {/* 2. Step Progress Indicator */}
      <ConfirmStepper />

      {/* 3. Original Photo Panel */}
      <ConfirmVisuals citizenPhotoUrl={data.citizenPhotoUrl} />

      {/* 4. Detected Address & GPS Map View */}
      <DetectedLocation
        address={data.address}
        mapPreviewUrl={data.mapPreviewUrl}
      />

      {/* 5. AI Categorization Logs details */}
      <ReportDetailsCard
        reportTime={data.reportTime}
        aiClassification={data.aiClassification}
        aiAccuracy={data.aiAccuracy}
        wasteCategories={data.wasteCategories}
      />

      {/* 6. Declared checkboxes & Actions list */}
      <ActionSubmit
        rewardPoints={data.rewardPoints}
        onSubmit={handleSubmitReport}
        onEdit={() => router.back()}
      />
    </div>
  );
}
