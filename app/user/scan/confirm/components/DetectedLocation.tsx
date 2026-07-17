import React from "react";

interface DetectedLocationProps {
  address: string;
  mapPreviewUrl: string;
}

export const DetectedLocation: React.FC<DetectedLocationProps> = ({
  address,
  mapPreviewUrl,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        {/* Header detail */}
        <div className="flex gap-3.5 items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E2ECE4] border border-[#d6ebd9] flex items-center justify-center text-[#1E7D38] shadow-sm flex-shrink-0">
            {/* MDI map-marker-outline */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              Lokasi Terdeteksi
            </span>
            <p className="text-sm font-extrabold text-gray-800 leading-snug">
              {address}
            </p>
          </div>
        </div>

        {/* Map View Frame */}
        <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mapPreviewUrl}
            alt="Jakarta Map Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
