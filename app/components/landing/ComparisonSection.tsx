"use client";

import React from "react";
import { ComparisonCard } from "./comparison/ComparisonCard";

export function ComparisonSection() {
    const negativeItems = [
        { text: "Laporan tersebar di banyak kanal (WA, Telepon, Sosmed)" },
        { text: "Pemeriksaan manual memakan waktu lama" },
        { text: "Informasi lokasi tidak konsisten atau tidak jelas" },
        { text: "Penanganan tidak terukur & sulit dievaluasi" },
        { text: "Warga tidak tahu status laporan" },
    ];

    const positiveItems = [
        { text: "Foto & lokasi diverifikasi otomatis oleh AI" },
        { text: "Prioritas laporan berdasarkan data & risiko" },
        { text: "Penugasan ke petugas lebih cepat & tepat" },
        { text: "Pemantauan real-time & transparan" },
        { text: "Data terpusat untuk keputusan yang lebih baik" },
    ];

    return (
        <section id="solusi" className="pb-10 bg-white select-none relative">
            <div className="container mx-auto lg:px-0 md:px-12 px-6 space-y-12">
                {/* Section Header */}
                <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f291e] tracking-tight">
                        Satu Platform, Dampak Nyata
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                        WasteLens menjembatani laporan warga dan aksi DLH dengan
                        teknologi AI.
                    </p>
                </div>

                {/* Comparison Grid with VS Badge in Middle */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    {/* Central VS Badge (Desktop Overlay) */}
                    <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-11 h-11 rounded-full bg-[#0d3b20] text-white font-black text-xs flex items-center justify-center border-4 border-white shadow-md tracking-wider">
                            VS
                        </div>
                    </div>

                    {/* Left Card: Tanpa WasteLens */}
                    <ComparisonCard
                        variant="negative"
                        badgeText="Tanpa WasteLens"
                        items={negativeItems}
                    />

                    {/* Right Card: Dengan WasteLens */}
                    <ComparisonCard
                        variant="positive"
                        badgeText="Dengan WasteLens"
                        items={positiveItems}
                    />
                </div>
            </div>
        </section>
    );
}
