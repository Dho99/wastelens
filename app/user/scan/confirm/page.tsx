"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getConfirmDummyData, ConfirmData } from "./services/confirmService";
import { mockSubmitWasteReport } from "../services/waste-validation.service";

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
  const [submitting, setSubmitting] = useState(false);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  useEffect(() => {
    // Load confirm dataset from localStorage or fallback to mock data
    const saved = localStorage.getItem("report_confirm_data");
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData(getConfirmDummyData());
    }
    setLoading(false);
  }, []);

  const handleSubmitReport = async () => {
    setSubmitting(true);
    try {
      // 1. Run the mock submit transition
      const mockRes = await mockSubmitWasteReport();

      // 2. Call the actual backend API to persist report if data is available
      const rawClassification = localStorage.getItem("classification_result");
      const base64 = localStorage.getItem("captured_image_base64");
      const latStr = localStorage.getItem("captured_lat");
      const lngStr = localStorage.getItem("captured_lng");

      if (rawClassification && base64 && latStr && lngStr) {
        const classification = JSON.parse(rawClassification);
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        const res = await fetch("/api/laporan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            lat,
            lng,
            kategori_ukuran: classification.kategori_ukuran,
            rekomendasi_kendaraan: classification.rekomendasi_kendaraan,
            deskripsi: localStorage.getItem("captured_deskripsi") || "",
          }),
        });

        if (res.ok) {
          const resData = await res.json();
          // Update report ID from the actual saved entry
          mockRes.reportId = resData.id || mockRes.reportId;
        }
      }

      // Save success report details for display on success screen
      localStorage.setItem(
        "success_report_data",
        JSON.stringify({
          reportId: mockRes.reportId,
          submittedAt: new Date(mockRes.submittedAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
          rewardPoints: mockRes.rewardPoints,
          locationName: data?.address || "Jakarta Pusat",
        })
      );

      router.push("/user/scan/success");
    } catch (err) {
      console.error("Failed to submit report:", err);
      alert("Gagal mengirim laporan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
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
        submitting={submitting}
      />
    </div>
  );
}
