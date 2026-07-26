"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";

export interface ReportPhotoCardProps {
  fotoUrl: string;
  timestampText: string;
}

export function ReportPhotoCard({
  fotoUrl,
  timestampText,
}: ReportPhotoCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 md:p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-[#0f172a]" />
        <h3 className="text-base font-extrabold text-[#0f172a] tracking-tight">
          Foto Laporan Warga
        </h3>
      </div>

      {/* Photo Container with Timestamp Overlay */}
      <div className="relative w-full h-[330px] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner group">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt="Foto Laporan Warga"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <Camera className="w-8 h-8 text-slate-300" />
          </div>
        )}

        {/* Glassmorphism Timestamp Badge */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/85 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 shadow-md max-w-[90%]">
          <span className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase block">
            TIMESTAMP
          </span>
          <span className="text-xs font-black text-[#0f172a] tracking-tight mt-0.5 block">
            {timestampText}
          </span>
        </div>
      </div>
    </div>
  );
}
