import React from "react";
import Image from "next/image";

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
      
      {/* Logo */}
      <div className="relative w-28 h-28 rounded-full bg-[#E2ECE4]/70 border border-gray-150 flex items-center justify-center mb-5 overflow-hidden shadow-inner">
        <Image
          src="/wastelens-logo.png"
          alt={appName}
          width={96}
          height={96}
          className="rounded-full"
        />
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
