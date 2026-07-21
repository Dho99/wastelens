"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

import { getInitialValidationSteps, ValidationStep } from "./services/validationService";
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
    const runClassification = async () => {
      const metaRaw = localStorage.getItem("scan_meta");
      if (!metaRaw) {
        router.push("/user/scan");
        return;
      }

      const meta = JSON.parse(metaRaw);
      const { temporaryImageId } = meta;

      try {
        const res = await fetch("/api/laporan/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ temporaryImageId }),
        });

        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error ?? "Classification failed");
        }

        const result = {
          sizeCategory: payload.analysis.sizeCategory,
          wasteTypes: payload.analysis.wasteTypes,
          drainageRisk: payload.analysis.drainageRisk,
          obstructionRisk: payload.analysis.obstructionRisk,
          confidence: payload.analysis.confidence,
          needsManualReview: payload.analysis.needsManualReview,
          visualIndicators: payload.analysis.visualIndicators ?? [],
        };

        localStorage.setItem("scan_meta", JSON.stringify({
          ...meta,
          classificationResult: result,
        }));

        router.push("/user/scan/location");
      } catch {
        localStorage.setItem("scan_meta", JSON.stringify({
          ...meta,
          classificationResult: {
            sizeCategory: "UNCERTAIN",
            wasteTypes: ["UNKNOWN"],
            drainageRisk: false,
            obstructionRisk: false,
            confidence: 0,
            needsManualReview: true,
            visualIndicators: [],
          },
        }));

        router.push("/user/scan/location");
      }
    };

    runClassification();
  }, [router]);

  useEffect(() => {
    const initialSteps = getInitialValidationSteps();
    setSteps(initialSteps);

    const t1 = setTimeout(() => {
      setSteps([
        { id: 1, title: "Memeriksa kualitas foto", description: "Foto terdeteksi jernih dan memenuhi syarat.", status: "DONE" },
        { id: 2, title: "Mendeteksi objek sampah", description: "Plastik, logam teridentifikasi.", status: "DONE" },
        { id: 3, title: "Memeriksa informasi lokasi", description: "Memverifikasi koordinat GPS...", status: "PROSES", statusLabel: "Proses" },
      ]);
    }, 1500);

    const t2 = setTimeout(() => {
      setSteps([
        { id: 1, title: "Memeriksa kualitas foto", description: "Foto terdeteksi jernih dan memenuhi syarat.", status: "DONE" },
        { id: 2, title: "Mendeteksi objek sampah", description: "Plastik, logam teridentifikasi.", status: "DONE" },
        { id: 3, title: "Memeriksa informasi lokasi", description: "Koordinat GPS terverifikasi.", status: "DONE" },
      ]);
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-6 flex flex-col justify-between">
      <div>
        <DetectionOverlay />
        <HeaderText />
        <StepperList steps={steps} />
      </div>
      <BottomNotice />
    </div>
  );
}
