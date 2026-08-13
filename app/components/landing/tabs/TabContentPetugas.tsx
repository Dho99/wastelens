"use client";

import React from "react";
import { Check, UserCheck, Zap } from "lucide-react";

export function TabContentPetugas() {
  const points = [
    "Rute tugas harian teroptimasi",
    "Navigasi lokasi & titik sampah presisi",
    "Verifikasi penanganan instan",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
      
      {/* Left Content Column */}
      <div className="lg:col-span-5 space-y-6 text-left">
        <h3 className="text-3xl md:text-4xl font-black text-[#0f291e] tracking-tight leading-tight">
          Deteksi Real-Time <br />
          <span className="text-[#15803d]">& Transparan</span>
        </h3>

        <p className="text-slate-600 font-medium text-sm leading-relaxed">
          Terima tugas langsung di ponsel dengan rute navigasi tercepat. Verifikasi lokasi bersih dengan mudah dan lupakan pelaporan manual yang memakan waktu.
        </p>

        {/* Checklist Points */}
        <ul className="space-y-3 pt-1">
          {points.map((pt) => (
            <li key={pt} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {pt}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column: Petugas Field App Mockup Placeholder Container */}
      <div className="lg:col-span-7">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-[36px] p-8 shadow-2xl min-h-[460px] flex flex-col items-center justify-center relative overflow-hidden group select-none transition-all duration-300 hover:border-slate-700">
          
          {/* Right Floating Badge */}
          <div className="absolute top-6 right-6 bg-emerald-500/90 text-white rounded-full px-4 py-1.5 text-xs font-black shadow-lg flex items-center gap-1.5 backdrop-blur-md z-20">
            <Zap className="w-3.5 h-3.5 fill-white stroke-none" />
            <span>Efisiensi +40%</span>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full -z-0" />
          
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <UserCheck className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-slate-700">
                <span>Mockup Petugas Field Placeholder</span>
              </div>
              <h4 className="text-base font-extrabold text-white tracking-tight">
                Petugas Field App Viewport
              </h4>
              <p className="text-xs font-semibold text-slate-400 mt-1 leading-relaxed">
                Wadah siap pakai untuk mockup aplikasi rute & tugas lapangan petugas Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
