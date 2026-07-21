import React from "react";

interface LocationOverlayProps {
  locationName: string;
}

export const LocationOverlay: React.FC<LocationOverlayProps> = ({ locationName }) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center text-center px-8 select-none pointer-events-none drop-shadow-md">
      {/* Location Pin & Name */}
      <div className="flex items-center gap-1.5 mb-1 bg-black/10 backdrop-blur-[2px] px-3.5 py-1 rounded-full border border-white/10 shadow-sm">
        {/* MDI map-marker-outline */}
        <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
        </svg>
        <span className="text-[10px] font-black text-white tracking-wide">
          {locationName}
        </span>
      </div>

      {/* Description Terms */}
      <p className="text-[9px] text-white/80 font-bold max-w-[280px] leading-normal tracking-wide">
        Lokasi Anda akan disertakan dalam laporan untuk membantu tim kebersihan. Foto dienkripsi demi privasi Anda.
      </p>
    </div>
  );
};
