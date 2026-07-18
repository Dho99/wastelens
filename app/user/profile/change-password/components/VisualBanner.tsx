import React from "react";

export const VisualBanner: React.FC = () => {
  return (
    <div className="px-4 mb-5">
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-gradient-to-tr from-[#C5D0D9] via-[#DCE6ED] to-[#EAF2F7] border border-gray-150/40 shadow-sm flex flex-col justify-end p-5">
        
        {/* Large Key/Image placeholder icon in the center */}
        <div className="absolute inset-0 flex items-center justify-center text-[#909CA6]/60">
          {/* MDI image-area-outline */}
          <svg className="w-16 h-16 fill-current" viewBox="0 0 24 24">
            <path d="M19,5V19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M14.14,11.86L11.14,15.73L9,13.14L6,17H18L14.14,11.86Z" />
          </svg>
        </div>

        {/* White Pill Tag overlay */}
        <span className="relative bg-white/95 text-[#1E7D38] text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider w-fit shadow-sm z-10 select-none">
          KEAMANAN AKUN
        </span>

      </div>
    </div>
  );
};
