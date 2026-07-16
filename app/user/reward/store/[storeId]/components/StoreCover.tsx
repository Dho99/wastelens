import React from "react";

interface StoreCoverProps {
  name: string;
  rating: number;
  isOpen: boolean;
  address: string;
  coverImageUrl: string;
}

export const StoreCover: React.FC<StoreCoverProps> = ({
  name,
  rating,
  isOpen,
  address,
  coverImageUrl,
}) => {
  return (
    <div className="px-4 mb-5">
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm flex flex-col justify-end">
        {/* cover image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Faint Dark Vignette Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Overlay Text Details (Bottom Left) */}
        <div className="relative z-10 p-5 text-white flex flex-col gap-1 select-none">
          {/* Badge row (Open tag + Ratings) */}
          <div className="flex items-center gap-2.5">
            {isOpen && (
              <span className="bg-[#287A38] text-white text-[9px] font-black px-2.5 py-0.5 rounded tracking-wider uppercase">
                OPEN
              </span>
            )}
            <div className="flex items-center gap-1">
              {/* Star MDI Icon */}
              <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
              </svg>
              <span className="text-[10px] font-black text-white leading-none">
                {rating}
              </span>
            </div>
          </div>

          {/* Store Name */}
          <h2 className="text-xl font-black tracking-tight mt-0.5">
            {name}
          </h2>

          {/* Address pin */}
          <div className="flex items-center gap-1 text-[10px] text-gray-200/90 font-bold">
            {/* Location pin outline */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
            </svg>
            <span>{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
