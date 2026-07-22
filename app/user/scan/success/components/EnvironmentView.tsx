import React from "react";

interface EnvironmentViewProps {
  locationName: string;
  landscapeImageUrl: string;
}

export const EnvironmentView: React.FC<EnvironmentViewProps> = ({
  locationName,
  landscapeImageUrl,
}) => {
  return (
    <div className="px-4 mb-5">
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={landscapeImageUrl}
          alt="Clean environment"
          className="w-full h-full object-cover"
        />

        {/* Location overlay tag at bottom-left */}
        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-[2px] rounded-full py-1 px-3 flex items-center gap-1.5 shadow-sm border border-white/10 select-none">
          {/* MDI map-marker-outline */}
          <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
          </svg>
          <span className="text-[10px] font-black text-white tracking-wide">
            {locationName}
          </span>
        </div>
      </div>
    </div>
  );
};
