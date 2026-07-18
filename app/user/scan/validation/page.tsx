"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getInitialValidationSteps, ValidationStep } from "./services/validationService";
import { mockValidateWasteImage } from "../services/waste-validation.service";

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



  const [validationResult, setValidationResult] = useState<{ isValid: boolean } | null>(null);

  // Trigger mock validation on mount
  useEffect(() => {
    const runValidation = async () => {
      const shouldFail = localStorage.getItem("mock_result") === "error";
      try {
        const result = await mockValidateWasteImage(shouldFail);
        setValidationResult(result);

        if (result.isValid) {
          // Build Report Confirm Data for the next screens
          const confirmData = {
            citizenPhotoUrl: localStorage.getItem("captured_image") || "/images/waste_bags_stack.png",
            address: "Jl. Sudirman No. 42, Jakarta Pusat", // default location placeholder
            mapPreviewUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80",
            reportTime: new Date().toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }) + " WIB",
            aiClassification: result.detectedObject,
            aiAccuracy: Math.round(result.confidence * 100),
            wasteCategories: result.wasteCategory,
            rewardPoints: 50,
          };
          localStorage.setItem("report_confirm_data", JSON.stringify(confirmData));
          localStorage.setItem("classification_result", JSON.stringify({
            isWasteDetected: result.isValid,
            kategori_ukuran: result.estimatedVolume.toLowerCase(),
            rekomendasi_kendaraan: "tossa",
            confidence: result.confidence
          }));
        }
      } catch (err) {
        console.error("Mock validation failed:", err);
        setValidationResult({ isValid: false });
      }
    };
    runValidation();
  }, []);

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

    // Transition 3: Auto-redirect to location permission or error screen (after 3.8s)
    const t3 = setTimeout(() => {
      // Access current state via local lookup or defaults
      const shouldFail = localStorage.getItem("mock_result") === "error";
      if (shouldFail) {
        console.log("Validation complete! Redirecting to error screen...");
        router.push("/user/scan/fallback");
      } else {
        console.log("Validation complete! Redirecting to location screen...");
        router.push("/user/scan/location");
      }
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
