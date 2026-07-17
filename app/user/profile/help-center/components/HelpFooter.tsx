import React from "react";

interface HelpFooterProps {
  quote: string;
}

export const HelpFooter: React.FC<HelpFooterProps> = ({ quote }) => {
  return (
    <div className="flex flex-col items-center text-center px-6 pb-12 select-none">
      
      {/* Light Purple logo circle */}
      <div className="w-16 h-16 rounded-full bg-[#E2ECE4] border border-gray-150 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
        <div className="w-8 h-8 rounded bg-[#E8E8FF] border border-[#DCE2F9] flex items-center justify-center text-[#7E80E5] shadow-sm">
          {/* MDI image-outline */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
          </svg>
        </div>
      </div>

      {/* Quote */}
      <p className="text-xs font-semibold text-gray-550 italic leading-relaxed max-w-[280px]">
        &quot;{quote}&quot;
      </p>

      {/* Title */}
      <span className="text-[9.5px] font-black text-[#1E7D38] tracking-widest uppercase mt-3">
        LAYANAN PELANGGAN WASTELENS
      </span>

    </div>
  );
};
