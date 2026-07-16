"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

// Services
import { getReportDetailDummyData, ReportDetail } from "./services/reportDetailService";

// Slices
import { DetailHeader } from "./components/DetailHeader";
import { ReportInfo } from "./components/ReportInfo";
import { Documentation } from "./components/Documentation";
import { ReportMeta } from "./components/ReportMeta";
import { RewardBanner } from "./components/RewardBanner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReportDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch mock data from service layer using the parameter report ID
    const details = getReportDetailDummyData(resolvedParams.id);
    setReport(details);
    setLoading(false);
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-32 bg-gray-200 rounded-3xl" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat detail laporan.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-16">
      {/* 1. Header Navigation */}
      <DetailHeader
        onBackClick={() => router.back()}
        onShareClick={() => console.log("Sharing report details...")}
      />

      {/* 2. Main Report ID & Status Info Card */}
      <ReportInfo
        reportCode={report.reportCode}
        status={report.status}
        statusUpdatedText={report.statusUpdatedText}
      />

      {/* 3. Documentation (Citizen vs AI check image panel) */}
      <Documentation
        citizenPhotoUrl={report.citizenPhotoUrl}
        aiPhotoUrl={report.aiPhotoUrl}
      />

      {/* 4. Details / Metadata Panel */}
      <ReportMeta
        locationTitle={report.locationTitle}
        locationDetails={report.locationDetails}
        reportTime={report.reportTime}
        wasteTypes={report.wasteTypes}
      />

      {/* 5. Reward/Thank you box */}
      {report.status === "SELESAI" && (
        <RewardBanner points={report.pointsGained} />
      )}

      {/* 6. Map Action Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => router.push("/user")}
          className="w-full bg-[#0F5A25] hover:bg-[#0c4a1e] active:scale-95 text-white font-bold text-sm py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          {/* MDI map-legend SVG */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M9,2L3,5V21L9,18L15,21L21,18V2L15,5L9,2M15,18.89L9,15.89V5.11L15,8.11V18.89Z" />
          </svg>
          Lihat di Peta
        </button>
      </div>

      {/* 7. Footer Report Redirect */}
      <div className="text-center pb-6">
        <p className="text-xs text-gray-500 font-semibold">
          Ingin melaporkan masalah lain?{" "}
          <button
            onClick={() => router.push("/user/scan")}
            className="text-[#1E7D38] underline hover:text-[#165d29] font-bold"
          >
            Klik di sini
          </button>
        </p>
      </div>
    </div>
  );
}
