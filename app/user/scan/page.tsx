"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Custom UI components
import { ScanHeader } from "./components/ScanHeader";
import { Viewfinder } from "./components/Viewfinder";
import { ControlPanel } from "./components/ControlPanel";
import { LocationOverlay } from "./components/LocationOverlay";

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setHideTabBar } = useTabBar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings states
  const [flashOn, setFlashOn] = useState(false);
  const [locationName] = useState("Jakarta Selatan, Indonesia");

  // Check query parameter mockResult=error
  useEffect(() => {
    const mockResult = searchParams.get("mockResult");
    if (mockResult === "error") {
      localStorage.setItem("mock_result", "error");
      console.log("Mock result set to: error via query param");
    } else {
      localStorage.removeItem("mock_result");
    }
  }, [searchParams]);

  // Hide tab bar on mount
  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  // Save base64 image and move to validating step
  const proceedToValidation = useCallback((base64Data: string, fileName: string = "") => {
    // Save image base64 and photo url in localStorage
    localStorage.setItem("captured_image", base64Data);
    localStorage.setItem("captured_image_base64", base64Data.split(",")[1] || base64Data);

    // If filename contains "invalid", force error scenario
    if (fileName.toLowerCase().includes("invalid")) {
      localStorage.setItem("mock_result", "error");
    }

    router.push("/user/scan/validation");
  }, [router]);

  // Handle Shutter click (Capture mock stack image)
  const handleShutterClick = useCallback(async () => {
    try {
      const imgRes = await fetch("/images/waste_bags_stack.png");
      const blob = await imgRes.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        proceedToValidation(reader.result as string, "waste_bags_stack.png");
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Failed to load camera asset:", err);
      // Fallback fallback base64 or redictect
      router.push("/user/scan/validation");
    }
  }, [proceedToValidation, router]);

  // Handle Gallery click (Trigger hidden file input)
  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection from gallery/camera capture input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation: Only images
    if (!file.type.startsWith("image/")) {
      alert("Format file tidak valid. Harap pilih file gambar.");
      return;
    }

    // Validation: Size limit (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      alert("Ukuran file terlalu besar. Batas maksimal adalah 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      proceedToValidation(reader.result as string, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFlipCamera = () => {
    alert("Kamera dibalik: Menggunakan kamera depan.");
  };

  return (
    <div className="relative min-h-screen w-full h-full overflow-hidden select-none bg-black">
      {/* Hidden File Input for Gallery / Camera capture */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 1. Viewfinder Camera Feed (piled garbage background image) */}
      <Viewfinder backgroundImageUrl="/images/waste_bags_stack.png" />

      {/* 2. Top Navigation header control overlay */}
      <ScanHeader
        flashOn={flashOn}
        onClose={() => router.push("/user")}
        onToggleFlash={() => setFlashOn((prev) => !prev)}
        onSettingsClick={() => alert("Pengaturan kamera dibuka.")}
      />

      {/* 3. Bottom controls panel (Shutter, Gallery, Flip Camera) */}
      <ControlPanel
        galleryThumbnailUrl="/images/gallery_thumbnail.png"
        onShutterClick={handleShutterClick}
        onGalleryClick={handleGalleryClick}
        onFlipCamera={handleFlipCamera}
      />

      {/* 4. Bottom coordinates & Location details */}
      <LocationOverlay locationName={locationName} />
    </div>
  );
}
