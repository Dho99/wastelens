"use client";

import dynamic from "next/dynamic";
import { MapPin, Loader2 } from "lucide-react";

const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center gap-2">
      <Loader2 className="w-5 h-5 text-[#287A38] animate-spin" />
      <span className="text-xs font-semibold text-[#64748b]">Memuat peta...</span>
    </div>
  ),
});

export interface ReportLocationMapCardProps {
  lat: number;
  lng: number;
  addressTitle: string;
  addressSubtitle: string;
}

export function ReportLocationMapCard({
  lat,
  lng,
  addressTitle,
  addressSubtitle,
}: ReportLocationMapCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-[#0f172a]" />
        <h3 className="text-base font-extrabold text-[#0f172a] tracking-tight">
          Koordinat Lokasi
        </h3>
      </div>

      {/* Map Display Container */}
      <div className="w-full h-[230px] rounded-xl overflow-hidden border border-slate-100 relative shadow-inner">
        <LeafletMapInner lat={lat} lng={lng} />
      </div>

      {/* Address Details Footer */}
      <div className="pt-1">
        <h4 className="font-extrabold text-[#0f172a] text-sm tracking-tight">
          {addressTitle}
        </h4>
        <p className="text-xs font-medium text-[#64748b] mt-0.5">
          {addressSubtitle}
        </p>
      </div>
    </div>
  );
}
