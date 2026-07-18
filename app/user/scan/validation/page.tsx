"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getInitialValidationSteps, ValidationStep } from "./services/validationService";

// Slices
import { DetectionOverlay } from "./components/DetectionOverlay";
import { HeaderText } from "./components/HeaderText";
import { StepperList } from "./components/StepperList";
import { BottomNotice } from "./components/BottomNotice";

export default function ValidationPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<ValidationStep[]>([]);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  useEffect(() => {
    // Set initial validation progress stepper values
    const initialSteps = getInitialValidationSteps();
    setSteps(initialSteps);

    // Timeline stepper animation simulator
    // Transition 1: Step 2 Done, Step 3 Processing (after 1.5s)
    const t1 = setTimeout(() => {
      setSteps([
        {
          id: 1,
          title: "Memeriksa kualitas foto",
          description: "Foto terdeteksi jernih dan memenuhi syarat.",
          status: "DONE"
        },
        {
          id: 2,
          title: "Mendeteksi objek sampah",
          description: "Plastik, logam teridentifikasi.",
          status: "DONE"
        },
        {
          id: 3,
          title: "Memeriksa informasi lokasi",
          description: "Memverifikasi koordinat GPS...",
          status: "PROSES",
          statusLabel: "Proses"
        }
      ]);
    }, 1500);

    // Transition 2: Step 3 Done (after 3.0s)
    const t2 = setTimeout(() => {
      setSteps([
        {
          id: 1,
          title: "Memeriksa kualitas foto",
          description: "Foto terdeteksi jernih dan memenuhi syarat.",
          status: "DONE"
        },
        {
          id: 2,
          title: "Mendeteksi objek sampah",
          description: "Plastik, logam teridentifikasi.",
          status: "DONE"
        },
        {
          id: 3,
          title: "Memeriksa informasi lokasi",
          description: "Koordinat GPS terverifikasi.",
          status: "DONE"
        }
      ]);
    }, 3000);

    // Transition 3: Auto-redirect to success screen (after 3.8s)
    const t3 = setTimeout(() => {
      console.log("Validation complete! Redirecting to success screen...");
      router.push("/user/scan/success");
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router]);

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-6 flex flex-col justify-between">
      <div>
        {/* 1. Detection Viewport Image Overlay */}
        <DetectionOverlay />

        {/* 2. Headline & Loader Info */}
        <HeaderText />

        {/* 3. Stepper timeline progress list */}
        <StepperList steps={steps} />
      </div>

      {/* 4. Bottom Notice banner */}
      <BottomNotice />
    </div>
  );
}
