"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

import { ConfirmHeader } from "./components/ConfirmHeader";
import { ConfirmStepper } from "./components/ConfirmStepper";
import { ConfirmVisuals } from "./components/ConfirmVisuals";
import { DetectedLocation } from "./components/DetectedLocation";
import { ReportDetailsCard } from "./components/ReportDetailsCard";
import { ActionSubmit } from "./components/ActionSubmit";

import { useSubmitWasteReport } from "../hooks/useSubmitWasteReport";
import type { SubmitPayload, AddressPayload } from "../services/scan.client";
import { getConfirmDummyData, ConfirmData } from "./services/confirmService";

export default function ConfirmPage() {
  const router = useRouter();
  const { setHideTabBar } = useTabBar();
  const mutation = useSubmitWasteReport();

  const [resolvedAddress, setResolvedAddress] = useState<AddressPayload | null | "loading">("loading");

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const meta = useMemo(() => {
    const raw = localStorage.getItem("scan_meta");
    if (!raw) return null;
    return JSON.parse(raw);
  }, []);

  const reportConfirmData = meta?.reportConfirmData;

  useEffect(() => {
    if (!reportConfirmData) return;

    if (reportConfirmData.address) {
      setResolvedAddress(null);
      return;
    }

    const coords = reportConfirmData.browserLocation;
    if (!coords?.latitude || !coords?.longitude) {
      setResolvedAddress(null);
      return;
    }

    fetch("/api/laporan/reverse-geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: coords.latitude, lng: coords.longitude }),
    })
      .then((r) => r.json())
      .then((res) => setResolvedAddress(res.data ?? null))
      .catch(() => setResolvedAddress(null));
  }, [reportConfirmData]);

  const displayAddress = useMemo(() => {
    if (!reportConfirmData) return "Jakarta Pusat";
    if (reportConfirmData.address) return reportConfirmData.address;
    if (resolvedAddress && resolvedAddress !== "loading") {
      return resolvedAddress.addressText ?? `${reportConfirmData.confirmedLatitude.toFixed(4)}, ${reportConfirmData.confirmedLongitude.toFixed(4)}`;
    }
    if (resolvedAddress === "loading") return "Memuat alamat...";
    return `${reportConfirmData.confirmedLatitude.toFixed(4)}, ${reportConfirmData.confirmedLongitude.toFixed(4)}`;
  }, [reportConfirmData, resolvedAddress]);

  const confirmData = useMemo<ConfirmData | null>(() => {
    const fromMeta = meta?.reportConfirmData;
    if (fromMeta) {
      return {
        citizenPhotoUrl: meta.photoUrl || "/images/waste_bags_stack.png",
        address: displayAddress,
        reportTime: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
        aiClassification: meta.classificationResult?.sizeCategory ?? "UNCERTAIN",
        aiAccuracy: Math.round((meta.classificationResult?.confidence ?? 0) * 100),
        wasteCategories: meta.classificationResult?.wasteTypes ?? ["UNKNOWN"],
        rewardPoints: 0,
        confirmedLatitude: fromMeta.confirmedLatitude,
        confirmedLongitude: fromMeta.confirmedLongitude,
      };
    }
    return getConfirmDummyData();
  }, [meta, displayAddress]);

  const handleSubmitReport = async () => {
    if (!meta?.classificationResult || !meta?.reportConfirmData) {
      alert("Data laporan tidak lengkap. Silakan mulai dari awal.");
      return;
    }

    const { reportConfirmData, classificationResult, temporaryImageId } = meta;

    const hasExif =
      reportConfirmData.exifLocation?.latitude != null &&
      reportConfirmData.exifLocation?.longitude != null;

    const payload: SubmitPayload = {
      temporaryImageId,
      location: {
        browser: {
          latitude: reportConfirmData.browserLocation.latitude,
          longitude: reportConfirmData.browserLocation.longitude,
          accuracyMeters: reportConfirmData.browserLocation.accuracyMeters,
          capturedAt: reportConfirmData.browserLocation.capturedAt,
        },
        exif: {
          latitude: hasExif ? reportConfirmData.exifLocation.latitude : null,
          longitude: hasExif ? reportConfirmData.exifLocation.longitude : null,
          timestamp: null,
        },
      },
      analysis: {
        sizeCategory: classificationResult.sizeCategory ?? "UNCERTAIN",
        wasteTypes: classificationResult.wasteTypes ?? ["UNKNOWN"],
        drainageRisk: classificationResult.drainageRisk ?? false,
        accessObstructionRisk: classificationResult.obstructionRisk ?? false,
        confidence: classificationResult.confidence ?? 0,
        needsManualReview: classificationResult.needsManualReview ?? true,
      },
      clientRequestId: crypto.randomUUID(),
    };

    if (resolvedAddress && resolvedAddress !== "loading") {
      payload.address = resolvedAddress;
    }

    mutation.mutate(payload,
      {
        onSuccess: (result) => {
          const addressText = result.address?.addressText
            ?? `${reportConfirmData.confirmedLatitude.toFixed(4)}, ${reportConfirmData.confirmedLongitude.toFixed(4)}`;

          localStorage.setItem(
            "success_report_data",
            JSON.stringify({
              reportId: result.reportId,
              status: result.status,
              rewardStatus: result.rewardStatus,
              reportTime: new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }) + " WIB",
              locationName: addressText,
              scanImageUrl: meta.photoUrl ?? "",
              landscapeImageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8c5c8?w=800&auto=format&fit=crop&q=80",
            }),
          );

          localStorage.removeItem("scan_meta");

          router.push("/user/scan/success");
        },
        onError: (err) => {
          const apiError = err as { message?: string };
          alert(apiError.message ?? "Gagal mengirim laporan. Silakan coba lagi.");
        },
      },
    );
  };

  if (!confirmData) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat konfirmasi laporan.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12">
      <ConfirmHeader
        onBackClick={() => router.back()}
        onHelpClick={() => console.log("Show confirmation help instructions...")}
      />

      <ConfirmStepper />

      <ConfirmVisuals citizenPhotoUrl={confirmData.citizenPhotoUrl} />

      <DetectedLocation
        address={confirmData.address}
        latitude={confirmData.confirmedLatitude ?? -6.2}
        longitude={confirmData.confirmedLongitude ?? 106.8}
      />

      <ReportDetailsCard
        reportTime={confirmData.reportTime}
        aiClassification={confirmData.aiClassification}
        aiAccuracy={confirmData.aiAccuracy}
        wasteCategories={confirmData.wasteCategories}
      />

      <ActionSubmit
        rewardPoints={confirmData.rewardPoints ?? 0}
        onSubmit={handleSubmitReport}
        onEdit={() => router.back()}
        submitting={mutation.isPending}
      />
    </div>
  );
}
