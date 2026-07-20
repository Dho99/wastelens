"use client";

import { Camera, RefreshCw, Upload } from "lucide-react";

type Props = {
  message: string;
  onRetry: () => void;
  onGalleryFallback: () => void;
};

export function CameraPermissionError({ message, onRetry, onGalleryFallback }: Props) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-900 px-6">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <Camera className="w-7 h-7 text-red-400" />
      </div>

      <h2 className="text-white text-lg font-bold mb-2">Kamera Tidak Tersedia</h2>
      <p className="text-white/60 text-sm text-center mb-6 max-w-xs leading-relaxed">
        {message}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[260px]">
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-98"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>

        <button
          onClick={onGalleryFallback}
          className="w-full flex items-center justify-center gap-2 bg-[#287A38] hover:bg-[#1e6329] text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-98"
        >
          <Upload className="w-4 h-4" />
          Upload dari Galeri
        </button>
      </div>
    </div>
  );
}
