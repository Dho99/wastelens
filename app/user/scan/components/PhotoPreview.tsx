"use client";

import NextImage from "next/image";
import { Camera, ImageIcon } from "lucide-react";

type Props = {
  photoUrl: string;
  onReplace: () => void;
  fileName?: string;
};

export function PhotoPreview({ photoUrl, onReplace, fileName }: Props) {
  return (
    <div className="space-y-3">
      <div className="relative h-56 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
        {photoUrl ? (
          <NextImage
            src={photoUrl}
            alt="Preview foto sampah"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ImageIcon className="w-4 h-4" />
          <span className="font-semibold truncate max-w-[180px]">
            {fileName ?? "Foto sampah"}
          </span>
        </div>
        <button
          onClick={onReplace}
          className="text-xs font-bold text-[#287A38] hover:text-[#1e6329] underline underline-offset-2"
        >
          Ganti Foto
        </button>
      </div>
    </div>
  );
}
