"use client";

import { ImageIcon } from "lucide-react";

type Props = {
  photoUrl: string;
  onReplace: () => void;
  fileName?: string;
};

export function PhotoPreview({ photoUrl, onReplace, fileName }: Props) {
  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt="Preview foto sampah"
          className="w-full h-56 object-cover"
        />
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
