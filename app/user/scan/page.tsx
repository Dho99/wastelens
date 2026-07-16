"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Slices
import { ScanHeader } from "./components/ScanHeader";
import { Viewfinder } from "./components/Viewfinder";
import { ControlPanel } from "./components/ControlPanel";
import { LocationOverlay } from "./components/LocationOverlay";
import { GPSPrompt } from "./components/GPSPrompt";

export default function ScanPage() {
  const router = useRouter();
  const [flashOn, setFlashOn] = useState(false);
  const [gpsPermissionGranted, setGpsPermissionGranted] = useState(false);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  // Mock snap handler
  const handleShutterClick = () => {
    console.log("Photo captured! Redirecting to confirm report details...");
    router.push("/user/scan/confirm");
  };

  // If GPS is not yet allowed, show the Aktifkan Lokasi screen
  if (!gpsPermissionGranted) {
    return (
      <GPSPrompt
        onAllowLocation={() => {
          console.log("GPS Location permission allowed by user.");
          setGpsPermissionGranted(true);
        }}
        onChooseManual={() => {
          console.log("User chose location manually.");
          setGpsPermissionGranted(true);
        }}
        onBack={() => router.push("/user")}
        onHelp={() => console.log("Showing GPS activation help...")}
      />
    );
  }

  return (
    <div className="relative w-full h-screen bg-black select-none">
      {/* 1. Camera Viewfinder overlay */}
      <Viewfinder
        backgroundImageUrl="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80" // Stack of plastic bags / waste pile mock
      />

      {/* 2. Scanning Header Actions */}
      <ScanHeader
        flashOn={flashOn}
        onClose={() => router.push("/user")}
        onToggleFlash={() => setFlashOn(!flashOn)}
        onSettingsClick={() => console.log("Open scanner settings...")}
      />

      {/* 3. Bottom controls */}
      <ControlPanel
        galleryThumbnailUrl="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=150&auto=format&fit=crop&q=80" // trash bins thumbnail
        onShutterClick={handleShutterClick}
        onGalleryClick={() => console.log("Open photo gallery picker...")}
        onFlipCamera={() => console.log("Switch active camera source...")}
      />

      {/* 4. Location Metadata tag */}
      <LocationOverlay locationName="Jakarta Selatan, Indonesia" />
    </div>
  );
}
