"use client";

import React from "react";

export interface ReportMetadataCardProps {
  pelapor: string;
  jamLaporan: string;
  alamat: string;
}

export function ReportMetadataCard({
  pelapor,
  jamLaporan,
  alamat,
}: ReportMetadataCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 md:p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Column 1: Pelapor */}
        <div className="pt-2 md:pt-0 first:pt-0">
          <span className="text-xs font-semibold text-[#94a3b8] tracking-tight block">
            Pelapor
          </span>
          <p className="text-base md:text-lg font-extrabold text-[#0f172a] mt-1 tracking-tight">
            {pelapor}
          </p>
        </div>

        {/* Column 2: Jam Laporan */}
        <div className="pt-4 md:pt-0 md:pl-6">
          <span className="text-xs font-semibold text-[#94a3b8] tracking-tight block">
            Jam Laporan
          </span>
          <p className="text-base md:text-lg font-extrabold text-[#0f172a] mt-1 tracking-tight">
            {jamLaporan}
          </p>
        </div>

        {/* Column 3: Alamat */}
        <div className="pt-4 md:pt-0 md:pl-6">
          <span className="text-xs font-semibold text-[#94a3b8] tracking-tight block">
            Alamat
          </span>
          <p className="text-base md:text-lg font-extrabold text-[#0f172a] mt-1 tracking-tight leading-snug">
            {alamat}
          </p>
        </div>
      </div>
    </div>
  );
}
