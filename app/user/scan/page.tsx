"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

import { ScanHeader } from "./components/ScanHeader";
import { Viewfinder } from "./components/Viewfinder";
import { ControlPanel } from "./components/ControlPanel";
import { LocationOverlay } from "./components/LocationOverlay";
import { CameraScanner, type CameraScannerHandle } from "./components/CameraScanner";
import { CameraPermissionError } from "./components/CameraPermissionError";
import { validatePhotoFile } from "./services/scan.client";

type ScanStage =
  | "IDLE"
  | "CAMERA_READY"
  | "CAPTURED"
  | "UPLOADING"
  | "CAMERA_ERROR";

export default function ScanPage() {
  const router = useRouter();
  const { setHideTabBar } = useTabBar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<CameraScannerHandle>(null);

  const [flashOn, setFlashOn] = useState(false);
  const [scanStage, setScanStage] = useState<ScanStage>("IDLE");
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const isCaptured = scanStage === "CAPTURED";

  useEffect(() => {
    setHideTabBar(true);
    return () => {
      setHideTabBar(false);
      if (capturedPreview) URL.revokeObjectURL(capturedPreview);
    };
  }, [setHideTabBar, capturedPreview]);

  const uploadAndProceed = useCallback(async (file: File) => {
    const validationError = validatePhotoFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch("/api/laporan/upload", { method: "POST", body: formData });
      const payload = await res.json();

      if (!res.ok || !payload.success) {
        alert(payload.error ?? "Gagal mengupload foto");
        return;
      }

      localStorage.setItem("scan_meta", JSON.stringify({
        temporaryImageId: payload.data.temporaryImageId,
        photoUrl: payload.data.url,
        photoMimeType: file.type,
      }));

      router.push("/user/scan/validation");
    } catch {
      alert("Gagal mengupload foto. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  const handleCapture = useCallback((result: { file: File; previewUrl: string }) => {
    setCapturedFile(result.file);
    setCapturedPreview(result.previewUrl);
    setScanStage("CAPTURED");
  }, []);

  const handleCaptureError = useCallback((message: string) => {
    setCameraError(message);
    setScanStage("CAMERA_ERROR");
  }, []);

  const handleCameraReady = useCallback(() => {
    setScanStage("CAMERA_READY");
  }, []);

  const handleRetake = useCallback(() => {
    if (capturedPreview) URL.revokeObjectURL(capturedPreview);
    setCapturedFile(null);
    setCapturedPreview(null);
    setCameraError(null);
    setScanStage("IDLE");
  }, [capturedPreview]);

  const handleUsePhoto = useCallback(() => {
    if (capturedFile) {
      uploadAndProceed(capturedFile);
    }
  }, [capturedFile, uploadAndProceed]);

  const handleShutterClick = useCallback(() => {
    if (scanStage === "CAPTURED") {
      handleUsePhoto();
      return;
    }
    cameraRef.current?.capture();
  }, [scanStage, handleUsePhoto]);

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndProceed(file);
    e.target.value = "";
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleRetryCamera = () => {
    setCameraError(null);
    setScanStage("IDLE");
  };

  return (
    <div className="relative min-h-screen w-full h-full overflow-hidden select-none bg-black">
      {/* z-0: Camera feed or captured preview */}
      {scanStage !== "CAMERA_ERROR" && !isCaptured && (
        <CameraScanner
          key={facingMode}
          ref={cameraRef}
          facingMode={facingMode}
          onCapture={handleCapture}
          onError={handleCaptureError}
          onCameraReady={handleCameraReady}
        />
      )}

      {isCaptured && capturedPreview && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={capturedPreview}
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* z-10: Viewfinder overlay (bounding box) */}
      {!isCaptured && scanStage !== "CAMERA_ERROR" && (
        <Viewfinder />
      )}

      {/* z-10: Permission error overlay */}
      {scanStage === "CAMERA_ERROR" && (
        <CameraPermissionError
          message={cameraError ?? "Gagal mengakses kamera"}
          onRetry={handleRetryCamera}
          onGalleryFallback={handleGalleryClick}
        />
      )}

      {/* z-20+: UI elements */}
      <ScanHeader
        flashOn={flashOn}
        onClose={() => router.push("/user")}
        onToggleFlash={() => setFlashOn((prev) => !prev)}
        onSettingsClick={isCaptured ? handleRetake : undefined}
      />

      {/* Captured state: retake / use buttons */}
      {isCaptured && (
        <div className="absolute inset-x-0 bottom-36 z-30 flex items-center justify-center gap-4">
          <button
            onClick={handleRetake}
            className="px-6 py-3 bg-white/15 backdrop-blur-md text-white font-semibold text-sm rounded-xl hover:bg-white/25 transition-all active:scale-95"
          >
            Ulang
          </button>
          <button
            onClick={handleUsePhoto}
            disabled={uploading}
            className="px-6 py-3 bg-[#287A38] text-white font-semibold text-sm rounded-xl hover:bg-[#1e6329] transition-all active:scale-95 disabled:opacity-50"
          >
            {uploading ? "Mengupload..." : "Gunakan"}
          </button>
        </div>
      )}

      {/* Camera controls (hidden in captured state) */}
      {!isCaptured && (
        <ControlPanel
          galleryThumbnailUrl={capturedPreview ?? undefined}
          onShutterClick={handleShutterClick}
          onGalleryClick={handleGalleryClick}
          onFlipCamera={handleFlipCamera}
          uploading={uploading}
        />
      )}

      <LocationOverlay locationName="Menggunakan GPS..." />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
