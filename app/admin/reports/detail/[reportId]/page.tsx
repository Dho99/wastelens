"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useReportDetail } from "../../../hooks/useReportDetail";
import { ReportMetadataCard } from "./components/ReportMetadataCard";
import { ReportPhotoCard } from "./components/ReportPhotoCard";
import { ReportTimelineCard } from "./components/ReportTimelineCard";
import { ReportLocationMapCard } from "./components/ReportLocationMapCard";

export default function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const reportId = resolvedParams.reportId;
  const { data, isLoading } = useReportDetail(reportId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-[#287A38] animate-spin" />
        <p className="text-sm font-semibold text-[#64748b]">
          Memuat detail laporan...
        </p>
      </div>
    );
  }

  const detail = data ?? {
    id: reportId,
    reportNumber: reportId.startsWith("LPR-") ? reportId : `LPR-${reportId.slice(0, 7).toUpperCase()}`,
    pelapor: "Bpk. Agus",
    jamLaporan: "09:15 WIB",
    alamat: "Jl. KHZ Mustofa No. 12, Menteng",
    fotoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
    timestampText: "24 Oct 2023, 09:12:44 GMT+7",
    estimasiPenangananText: "~120 Menit",
    timelineSteps: [
      { id: "1", label: "Dilaporkan", time: "09:15 WIB", completed: true },
      { id: "2", label: "Verifikasi AI", time: "09:16 WIB", completed: true },
      { id: "3", label: "Penugasan", time: "09:40 WIB", completed: true },
      { id: "4", label: "Menuju Lokasi", time: "09:50 WIB", completed: true },
      { id: "5", label: "Proses Pembersihan", time: "10:30 WIB", completed: true },
      { id: "6", label: "Selesai", time: "11:15 WIB", completed: true },
    ],
    locationLat: -6.1923,
    locationLng: 106.8370,
    addressTitle: "Jl. Menteng Raya No. 15",
    addressSubtitle: "Kecamatan Menteng, Jakarta Pusat, DKI Jakarta",
  };

  return (
    <div className="p-6 md:p-10 space-y-6 bg-[#f8fafc] text-[#0f172a] select-none pb-20">
      {/* Header Row with Back Button */}
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/reports")}
          aria-label="Kembali ke Log Aktivitas"
          className="mt-1 p-2 rounded-full hover:bg-slate-200/80 text-[#0f172a] transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Laporan #{detail.reportNumber}
          </h1>
          <p className="text-sm font-medium text-[#64748b] mt-1">
            Detail operasional penanganan sampah
          </p>
        </div>
      </div>

      {/* Top Metadata Card */}
      <ReportMetadataCard
        pelapor={detail.pelapor}
        jamLaporan={detail.jamLaporan}
        alamat={detail.alamat}
      />

      {/* Middle Grid: Photo & Progress Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <ReportPhotoCard
            fotoUrl={detail.fotoUrl}
            timestampText={detail.timestampText}
          />
        </div>
        <div className="lg:col-span-5">
          <ReportTimelineCard
            estimasiText={detail.estimasiPenangananText}
            steps={detail.timelineSteps}
          />
        </div>
      </div>

      {/* Bottom Card: Leaflet Location Map */}
      <ReportLocationMapCard
        lat={detail.locationLat}
        lng={detail.locationLng}
        addressTitle={detail.addressTitle}
        addressSubtitle={detail.addressSubtitle}
      />
    </div>
  );
}
