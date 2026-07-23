"use client";

import React from "react";
import { Check, Building2, TrendingUp } from "lucide-react";

export function TabContentOperator() {
  const points = [
    "Real-time Command Center",
    "Tracking & alokasi armada otomatis",
    "Analitik & laporan komprehensif",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
      
      {/* Left Content Column */}
      <div className="lg:col-span-5 space-y-6 text-left">
        <h3 className="text-3xl md:text-4xl font-black text-[#0f291e] tracking-tight leading-tight">
          Pemantauan <br />
          <span className="text-[#15803d]">Komprehensif</span>
        </h3>

        <p className="text-slate-600 font-medium text-sm leading-relaxed">
          Pantau seluruh titik sampah kota melalui dashboard monitoring real-time. Kelola penugasan armada secara otomatis dengan bantuan AI untuk efisiensi operasional maksimal.
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

      {/* Right Column: Operator DLH Mockup Placeholder Container */}
      <div className="lg:col-span-7">
        <div className="w-full bg-[#0d2a1c] border border-[#1b4632] rounded-[36px] p-8 shadow-2xl min-h-[460px] flex flex-col items-center justify-center relative overflow-hidden group select-none transition-all duration-300 hover:border-[#23583f]">
          
          {/* Top Right Floating Badge */}
          <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl px-4 py-2 text-xs font-black shadow-lg flex items-center gap-1.5 transform hover:scale-105 transition-transform z-20">
            <TrendingUp className="w-4 h-4" />
            <span>35% EFFICIENCY BOOST</span>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full -z-0" />
          
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/90 border border-emerald-800 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Building2 className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-800">
                <span>Mockup Operator DLH Placeholder</span>
              </div>
              <h4 className="text-base font-extrabold text-white tracking-tight">
                Operator Command Center Viewport
              </h4>
              <p className="text-xs font-semibold text-emerald-300/70 mt-1 leading-relaxed">
                Wadah siap pakai untuk mockup portal komando operator DLH Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
