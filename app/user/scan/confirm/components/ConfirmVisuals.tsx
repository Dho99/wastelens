import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ConfirmVisualsProps {
  citizenPhotoUrl: string;
}

export const ConfirmVisuals: React.FC<ConfirmVisualsProps> = ({
  citizenPhotoUrl,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          {citizenPhotoUrl ? (
            <Image
              src={citizenPhotoUrl}
              alt="Original Capture"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-300" />
            </div>
          )}

          {/* Original Foto Green Badge */}
          <div className="absolute top-3 left-3 bg-[#287A38]/90 backdrop-blur-sm text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
            {/* Camera MDI Icon */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M4 4h3l2-3h6l2 3h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            </svg>
            <span>Original Foto</span>
          </div>
        </div>
      </div>
    </div>
  );
};
