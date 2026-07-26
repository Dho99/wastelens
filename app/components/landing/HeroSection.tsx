"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Hexagon,
    ArrowRight,
    Play,
    Cpu,
    MapPin,
    ShieldCheck,
    Heart,
} from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";
import { DemoVideoModal } from "./DemoVideoModal";

export function HeroSection() {
    const [showDemo, setShowDemo] = useState(false);
    return (
        <section
            id="home"
            className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f8f3] to-white pt-10 pb-20 select-none"
        >
            {/* Background Subtle City Skyline Silhouette Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="container mx-auto lg:px-0 md:px-12 px-6 space-y-12">
                <div className="flex flex-col lg:flex-row gap-12 justify-between items-center">
                    {/* Left Content (Typography & CTAs) */}
                    <div className="lg:col-span-6 space-y-7 text-left order-2 lg:order-1">
                        {/* Top AI Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#edf7f2] border border-emerald-200/80 rounded-full px-4 py-1.5 shadow-2xs">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#15803d] flex items-center justify-center">
                                <Hexagon className="w-3.5 h-3.5 fill-[#15803d] stroke-none" />
                            </div>
                            <span className="text-xs font-extrabold text-[#15803d] tracking-tight">
                                AI untuk Lingkungan yang Lebih Bersih
                            </span>
                        </div>

                        {/* Main Multi-color Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0f291e] tracking-tight leading-[1.15]">
                            Laporkan Sampah <br />
                            Lebih Cepat, <br />
                            Penanganan <br />
                            <span className="text-[#f97316]">Lebih Tepat</span>
                        </h1>

                        {/* Subtitle Paragraph */}
                        <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed max-w-xl">
                            WasteLens membantu warga melaporkan sampah dengan
                            mudah. Laporan diverifikasi AI dan diprioritaskan
                            agar penanganan oleh DLH lebih efektif dan
                            transparan.
                        </p>

                        {/* Action CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                            {/* Primary Orange CTA */}
                            <Link
                                href="/user"
                                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs md:text-sm px-7 py-3.5 rounded-full flex items-center gap-2.5 shadow-md shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
                            >
                                <span>Mulai Lapor Sekarang</span>
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                                </div>
                            </Link>

                            {/* Secondary Demo CTA */}
                            <button
                                type="button"
                                onClick={() => setShowDemo(true)}
                                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-full flex items-center gap-2.5 shadow-2xs hover:scale-[1.02] transition-all cursor-pointer"
                            >
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                                    <Play className="w-3 h-3 fill-slate-700 stroke-none ml-0.5" />
                                </div>
                                <span>Lihat Demo</span>
                            </button>
                        </div>

                        {/* 4 Feature Highlights Grid */}
                        <div className="pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 order-1">
                            {/* Feature 1 */}
                            <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-xl bg-emerald-50 text-[#15803d] shrink-0">
                                    <Cpu className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[#0f291e] tracking-tight">
                                        AI Assisted
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                        Verifikasi otomatis
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-xl bg-emerald-50 text-[#15803d] shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[#0f291e] tracking-tight">
                                        Lokasi Akurat
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                        GPS terverifikasi
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-xl bg-emerald-50 text-[#15803d] shrink-0">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[#0f291e] tracking-tight">
                                        Transparan
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                        Update real-time
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-xl bg-emerald-50 text-[#15803d] shrink-0">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[#0f291e] tracking-tight">
                                        Bermanfaat
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                        Dapatkan reward
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content (Interactive Phone & Status Cards) */}
                    <div className="lg:col-span-6 flex justify-center lg:justify-end order-1 lg:order-2">
                        <PhoneMockup />
                    </div>
                </div>
            </div>

            <DemoVideoModal
                isOpen={showDemo}
                onClose={() => setShowDemo(false)}
            />
        </section>
    );
}
