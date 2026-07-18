"use client";

import { useRef, useEffect, useCallback, useState, useImperativeHandle, forwardRef } from "react";

type Props = {
  onCapture: (result: { file: File; previewUrl: string }) => void;
  onError: (message: string) => void;
  onCameraReady?: () => void;
  facingMode?: "environment" | "user";
};

export type CameraScannerHandle = {
  capture: () => void;
  stopStream: () => void;
};

type CameraState = "IDLE" | "REQUESTING" | "READY" | "ERROR";

export const CameraScanner = forwardRef<CameraScannerHandle, Props>(
  function CameraScanner({ onCapture, onError, onCameraReady, facingMode = "environment" }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("IDLE");

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraState("REQUESTING");
    try {
      let stream: MediaStream | null = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
      } catch {
        const fallbackMode = facingMode === "environment" ? "user" : "environment";
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: fallbackMode },
            audio: false,
          });
        } catch {
          throw new Error("Kamera tidak tersedia");
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraState("READY");
      onCameraReady?.();
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Izin kamera ditolak. Buka pengaturan browser untuk mengizinkan akses kamera."
          : err instanceof Error
            ? err.message
            : "Gagal membuka kamera";
      setCameraState("ERROR");
      onError(message);
    }
  }, [onError, onCameraReady]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          onError("Gagal memproses gambar");
          return;
        }
        const file = new File([blob], "capture.jpeg", { type: "image/jpeg" });
        const previewUrl = URL.createObjectURL(file);
        onCapture({ file, previewUrl });
      },
      "image/jpeg",
      0.92,
    );
  }, [onCapture, onError]);

  useImperativeHandle(ref, () => ({ capture, stopStream }), [capture, stopStream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  const retry = useCallback(() => {
    stopStream();
    startCamera();
  }, [stopStream, startCamera]);

  if (cameraState === "IDLE" || cameraState === "REQUESTING") {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/70 text-sm font-semibold">Mengakses kamera...</p>
        </div>
      </div>
    );
  }

  if (cameraState === "ERROR") {
    return null;
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
});
