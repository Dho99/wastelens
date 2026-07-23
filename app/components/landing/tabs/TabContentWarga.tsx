"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, Smartphone, Coins } from "lucide-react";

export function TabContentWarga() {
    const points = [
        "Laporan cepat & mudah",
        "Pantau status laporan Anda",
        "Dapatkan reward setiap kontribusi",
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
                <h3 className="text-3xl md:text-4xl font-black text-[#0f291e] tracking-tight leading-tight">
                    Berpartisipasi Mudah, <br />
                    <span className="text-[#15803d]">Dampak Nyata</span>
                </h3>

                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Setiap laporan Anda membantu menciptakan lingkungan yang
                    lebih bersih untuk kita semua. Kirim laporan dengan foto dan
                    lokasi tanpa formulir panjang. Pantau status penanganan
                    secara transparan langsung dari ponsel Anda.
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

                {/* Action Button */}
                <div className="pt-3">
                    <Link
                        href="/user/report"
                        className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-md shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                        <span>Mulai Lapor Sekarang</span>
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Right Column: Warga Mockup Placeholder Container */}
            <div className="lg:col-span-7">
                <div className="w-full bg-[#f4fbf6] border border-[#a7f3d0] rounded-[36px] p-8 shadow-xl min-h-[460px] flex flex-col items-center justify-center relative overflow-hidden group select-none transition-all duration-300 hover:border-[#6ee7b7]">
                    {/* Background Ambient Glow */}
                    <div className="absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full -z-0" />

                    <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-[#a7f3d0] text-[#15803d] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <Smartphone className="w-8 h-8 stroke-[1.8]" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-[#15803d] px-3 py-1 rounded-full text-xs font-black mb-2">
                                <Coins className="w-3.5 h-3.5" />
                                <span>Mockup Warga Placeholder</span>
                            </div>
                            <h4 className="text-base font-extrabold text-[#0f291e] tracking-tight">
                                Warga Mobile App Viewport
                            </h4>
                            <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                                Wadah siap pakai untuk mockup antarmuka aplikasi
                                warga Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
