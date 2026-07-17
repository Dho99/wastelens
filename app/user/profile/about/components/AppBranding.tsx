import React from "react";

interface AppBrandingProps {
  appName: string;
  version: string;
}

export const AppBranding: React.FC<AppBrandingProps> = ({
  appName,
  version,
}) => {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-4 pb-6 select-none">
      
      {/* Curved Logo Placeholder container */}
      <div className="relative w-28 h-28 rounded-full bg-[#E2ECE4]/70 border border-gray-150 flex items-center justify-center mb-5 overflow-hidden shadow-inner">
        {/* Curved drop water shape backdrop */}
        <div className="absolute w-24 h-24 rounded-[32px] rotate-45 bg-[#CFDCD2]/40" />

        {/* Center blue/purple image placeholder icon */}
        <div className="relative w-12 h-12 rounded-xl bg-[#E8E8FF] border border-[#DCE2F9] flex items-center justify-center text-[#7E80E5] shadow-sm">
          {/* MDI image-outline */}
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
          </svg>
        </div>
      </div>

      {/* Brand Name */}
      <h2 className="text-3xl font-black text-[#0D631B] tracking-tight leading-none mb-3">
        {appName}
      </h2>

      {/* Version Tag */}
      <span className="bg-[#FAF9F5] text-gray-500 text-[10px] font-black px-4 py-1 rounded-full border border-gray-200/60 shadow-sm tracking-wide">
        {version}
      </span>

    </div>
  );
};
