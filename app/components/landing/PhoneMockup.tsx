"use client";

import React from "react";
import { Coins, Truck, MapPin, ChevronLeft, Scan } from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center select-none py-6">
      
      {/* Background Soft Green Radial Glow */}
      <div className="absolute inset-0 bg-emerald-300/20 blur-3xl rounded-full -z-10 transform scale-90" />

      {/* Main Smartphone Frame */}
      <div className="relative z-10 w-[290px] sm:w-[320px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/10">
        
        {/* Dynamic Island / Top Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
        </div>

        {/* Smartphone Screen Inner */}
        <div className="bg-white rounded-[38px] overflow-hidden border border-slate-200 text-slate-800 font-sans shadow-inner pt-6 pb-4 px-3.5 space-y-3">
          
          {/* App Bar Header */}
          <div className="flex items-center justify-between pt-2 pb-1 border-b border-slate-100 text-xs font-bold text-slate-700">
            <ChevronLeft className="w-4 h-4 text-slate-500 cursor-pointer" />
            <div className="flex items-center gap-1.5 text-[#15803d] font-extrabold tracking-tight">
              <Scan className="w-3.5 h-3.5" />
              <span>AI SCANNING</span>
            </div>
            <div className="w-4" /> {/* Spacer */}
          </div>

          {/* AI Camera Viewport Container */}
          <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-800 border border-slate-200 group">
            {/* Background Simulated Waste Image */}
            <div
              className="absolute inset-0 bg-cover bg-center brightness-90"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80')",
              }}
            />

            {/* AI Scanning Detection Bounding Boxes */}
            <div className="absolute top-3 left-4 right-8 bottom-6 border-2 border-emerald-400 rounded-xl bg-emerald-500/10 animate-pulse flex flex-col justify-between p-1.5">
              <div className="self-start bg-emerald-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <span>Tumpukan Sampah</span>
                <span className="text-emerald-200">0.92</span>
              </div>
            </div>

            <div className="absolute bottom-3 left-10 w-24 h-16 border-2 border-cyan-400 rounded-lg bg-cyan-500/10 p-1">
              <span className="bg-cyan-600/90 text-white text-[8px] font-bold px-1.5 py-0.2 rounded">
                Botol Plastik
              </span>
            </div>

            {/* AI Top Tag */}
            <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Scanning Active</span>
            </div>
          </div>

          {/* Detail Laporan Inside App */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2 text-[11px]">
            <h4 className="font-extrabold text-slate-800 text-xs tracking-tight border-b border-slate-200/60 pb-1">
              Detail Laporan
            </h4>
            
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-slate-600">
              <div className="font-semibold text-slate-400">Jenis Sampah</div>
              <div className="font-bold text-slate-800 text-right">Sampah Campuran</div>

              <div className="font-semibold text-slate-400">Lokasi</div>
              <div className="font-bold text-slate-800 text-right truncate">Jl. Merdeka No. 25, Bandung</div>

              <div className="font-semibold text-slate-400">Waktu</div>
              <div className="font-bold text-slate-800 text-right">Hari ini, 09.41</div>

              <div className="font-semibold text-slate-400">Tingkat Prioritas</div>
              <div className="font-black text-red-500 text-right">Tinggi</div>
            </div>
          </div>

          {/* Submit Button Inside App */}
          <button
            type="button"
            className="w-full bg-[#15803d] hover:bg-[#0f602e] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Kirim Laporan
          </button>

        </div>
      </div>

      {/* 3 Floating Glassmorphism Cards (Desktop Overlay) */}
      <div className="hidden sm:flex flex-col gap-3.5 absolute -right-6 lg:-right-12 top-8 z-20 w-60">
        
        {/* Floating Card 1: Reward */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 transform hover:-translate-y-1 transition-transform">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">Reward Kamu</div>
            <div className="text-xs font-black text-[#15803d]">+ 500 koin</div>
            <p className="text-[9px] font-medium text-slate-500 mt-0.5 leading-tight">
              Terima kasih! Laporanmu berkontribusi.
            </p>
          </div>
        </div>

        {/* Floating Card 2: Status */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 transform hover:-translate-y-1 transition-transform">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15803d] flex items-center justify-center shrink-0 shadow-2xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">Status Laporan</div>
            <div className="text-xs font-black text-[#15803d]">Sedang Ditangani</div>
            <p className="text-[9px] font-medium text-slate-500 mt-0.5 leading-tight">
              Petugas telah menuju lokasi.
            </p>
          </div>
        </div>

        {/* Floating Card 3: Location */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 transform hover:-translate-y-1 transition-transform">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15803d] flex items-center justify-center shrink-0 shadow-2xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">Lokasi Terverifikasi</div>
            <div className="text-xs font-black text-[#15803d]">GPS akurat</div>
            <p className="text-[9px] font-medium text-slate-500 mt-0.5 leading-tight truncate max-w-[120px]">
              Jl. Merdeka No. 25, Bandung
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
