"use client";

import React from "react";
import {
    Hexagon,
    Sparkles,
    Map,
    BarChart2,
    Bell,
    LayoutGrid,
} from "lucide-react";
import { FeaturePoint } from "./operator/FeaturePoint";

export interface OperatorDlhSectionProps {
    children?: React.ReactNode;
}

export function OperatorDlhSection({ children }: OperatorDlhSectionProps) {
    const featurePoints = [
        {
            icon: <Sparkles className="w-5 h-5 stroke-[2.2]" />,
            title: "Penugasan Cerdas",
            description: "AI merekomendasikan petugas terdekat & terbaik.",
        },
        {
            icon: <Map className="w-5 h-5 stroke-[2.2]" />,
            title: "Peta Laporan Interaktif",
            description: "Lihat sebaran & prioritas laporan di peta real-time.",
        },
        {
            icon: <BarChart2 className="w-5 h-5 stroke-[2.2]" />,
            title: "Visualisasi Data",
            description: "Dashboard analitik untuk memantau kinerja tim.",
        },
        {
            icon: <Bell className="w-5 h-5 stroke-[2.2]" />,
            title: "Notifikasi & Update",
            description: "Pantau progres penanganan secara real-time.",
        },
    ];

    return (
        <section
            id="operator-dlh"
            className="py-10 bg-gradient-to-b from-white via-slate-50/60 to-white select-none relative"
        >
            <div className="container mx-auto lg:px-0 md:px-12 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Content Column */}
                    <div className="lg:col-span-5 space-y-6 text-left">
                        {/* Top Operator Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#edf7f2] border border-emerald-200/80 rounded-full px-4 py-1.5 shadow-2xs">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#15803d] flex items-center justify-center">
                                <Hexagon className="w-3.5 h-3.5 fill-[#15803d] stroke-none" />
                            </div>
                            <span className="text-xs font-extrabold text-[#15803d] tracking-tight">
                                Untuk Operator DLH
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0f291e] tracking-tight leading-[1.15]">
                            Pantau, Kelola, <br />
                            <span className="text-[#15803d]">Tindak Cepat</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                            WasteLens menyediakan dashboard terintegrasi untuk
                            membantu tim DLH mengambil keputusan berbasis data
                            dan bertindak lebih cepat.
                        </p>

                        {/* 4 Feature Points List */}
                        <div className="space-y-3.5 pt-2">
                            {featurePoints.map((pt) => (
                                <FeaturePoint
                                    key={pt.title}
                                    icon={pt.icon}
                                    title={pt.title}
                                    description={pt.description}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Custom Mockup Container Slot */}
                    <div className="lg:col-span-7">
                        {children ? (
                            children
                        ) : (
                            /* Clean, elegant placeholder slot ready for user's mockup */
                            <div className="w-full bg-[#0d2a1c] border border-[#1b4632] rounded-[36px] p-8 shadow-2xl min-h-[460px] flex flex-col items-center justify-center relative overflow-hidden group select-none transition-all duration-300 hover:border-[#23583f]">
                                {/* Background Ambient Glow */}
                                <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full -z-0" />

                                {/* Subtle Grid Pattern Overlay */}
                                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

                                <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <LayoutGrid className="w-8 h-8 stroke-[1.8]" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-white tracking-tight">
                                            Operator Dashboard Slot
                                        </h3>
                                        <p className="text-xs font-semibold text-emerald-300/70 mt-1 leading-relaxed">
                                            Wadah siap pakai untuk mockup
                                            operator DLH Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
