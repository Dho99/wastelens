import React from "react";
import { Navbar } from "@/app/components/landing/Navbar";
import { HeroSection } from "@/app/components/landing/HeroSection";
import { ComparisonSection } from "@/app/components/landing/ComparisonSection";
import { HowItWorksSection } from "@/app/components/landing/HowItWorksSection";
import { OperatorDlhSection } from "@/app/components/landing/OperatorDlhSection";
import { RoleTabsSection } from "@/app/components/landing/RoleTabsSection";
import { Footer } from "@/app/components/landing/Footer";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#15803d] selection:text-white">
            {/* Sticky Navbar with Backdrop Blur */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Comparison Section: "Satu Platform, Dampak Nyata" */}
            <ComparisonSection />

            {/* How It Works Section: "Cara Kerja WasteLens" */}
            <HowItWorksSection />

            {/* Operator DLH Section: "Pantau, Kelola, Tindak Cepat" */}
            <OperatorDlhSection />

            {/* Interactive 3-Role Tabbed Section: Warga, Operator DLH, Petugas */}
            <RoleTabsSection />

            {/* Landing Page Footer */}
            <Footer />
        </main>
    );
}
