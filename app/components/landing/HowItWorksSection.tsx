"use client";

import React from "react";
import { Camera, MapPin, Cpu, Truck, ArrowRight } from "lucide-react";
import { StepCard } from "./how-it-works/StepCard";

export function HowItWorksSection() {
    const steps = [
        {
            stepNumber: 1,
            icon: <Camera className="w-7 h-7 stroke-[2.2]" />,
            title: "Ambil Foto",
            description:
                "Warga mengambil foto titik sampah langsung dari lokasi kejadian.",
        },
        {
            stepNumber: 2,
            icon: <MapPin className="w-7 h-7 stroke-[2.2]" />,
            title: "Kirim Lokasi",
            description:
                "Koordinat GPS & detail kirim otomatis untuk memudahkan navigasi petugas.",
        },
        {
            stepNumber: 3,
            icon: <Cpu className="w-7 h-7 stroke-[2.2]" />,
            title: "Analisis & Prioritas",
            description:
                "AI menganalisis ukuran, jenis, & potensi dampak untuk menentukan prioritas penanganan.",
        },
        {
            stepNumber: 4,
            icon: <Truck className="w-7 h-7 stroke-[2.2]" />,
            title: "Penanganan",
            description:
                "Petugas menerima tugas, menangani, dan update status hingga selesai.",
        },
    ];

    return (
        <section
            id="cara-kerja"
            className="py-10 bg-[#f8fafc] select-none relative"
        >
            <div className="container mx-auto lg:px-0 md:px-12 px-6 space-y-12">
                {/* Section Header */}
                <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f291e] tracking-tight">
                        Cara Kerja WasteLens
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                        4 langkah mudah untuk lingkungan yang lebih bersih.
                    </p>
                </div>

                {/* 4 Step Cards Row with Dashed Arrow Connectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative items-stretch">
                    {steps.map((step, idx) => (
                        <React.Fragment key={step.stepNumber}>
                            <div className="relative flex-1">
                                <StepCard
                                    stepNumber={step.stepNumber}
                                    icon={step.icon}
                                    title={step.title}
                                    description={step.description}
                                />
                            </div>

                            {/* Green Dashed Arrow Connector between steps (desktop lg screens) */}
                            {idx < steps.length - 1 && (
                                <div
                                    className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 text-[#15803d]"
                                    style={{
                                        left: `calc(${(idx + 1) * 25}% - 14px)`,
                                    }}
                                >
                                    <div className="flex items-center gap-1 opacity-70">
                                        <span className="border-t-2 border-dashed border-[#15803d] w-6" />
                                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
