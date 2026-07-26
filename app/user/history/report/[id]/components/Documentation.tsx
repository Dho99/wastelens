import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";

interface DocumentationProps {
  citizenPhotoUrl: string;
  aiPhotoUrl: string;
}

export const Documentation: React.FC<DocumentationProps> = ({
  citizenPhotoUrl,
  aiPhotoUrl,
}) => {
  return (
    <div className="px-4 mb-5">
      <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mb-3 px-1">
        DOKUMENTASI LAPORAN
      </p>

      <div className="grid grid-cols-2 gap-3.5">
        {/* Foto Warga */}
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100/50">
            {citizenPhotoUrl ? (
              <Image
                src={citizenPhotoUrl}
                alt="Foto Warga"
                fill
                className="object-cover"
                sizes="50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-300" />
              </div>
            )}
            {/* Dark tag at bottom left */}
            <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded">
              Awal
            </span>
          </div>
          <p className="text-xs font-bold text-gray-500 text-center">Foto Warga</p>
        </div>

        {/* Verifikasi AI */}
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100/50">
            {aiPhotoUrl ? (
              <Image
                src={aiPhotoUrl}
                alt="Verifikasi AI"
                fill
                className="object-cover"
                sizes="50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-300" />
              </div>
            )}
            {/* Stamp at top right */}
            <span className="absolute top-2.5 right-2.5 bg-[#287A38] text-white rounded-full p-1 shadow-md border-2 border-white">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </span>
            {/* Green tag at bottom left */}
            <span className="absolute bottom-2 left-2 bg-[#287A38]/85 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-0.5 rounded">
              Tervalidasi
            </span>
          </div>
          <p className="text-xs font-bold text-gray-500 text-center">Verifikasi AI</p>
        </div>
      </div>
    </div>
  );
};
