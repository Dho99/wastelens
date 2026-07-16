import React from "react";

interface EcoTipsCardProps {
  tipsText: string;
}

export const EcoTipsCard: React.FC<EcoTipsCardProps> = ({ tipsText }) => {
  return (
    <div className="px-4 mb-6">
      <div className="bg-[#FFE0B2]/40 border border-[#FFE0B2]/70 rounded-[32px] p-6 flex gap-4 relative overflow-hidden select-none">
        
        {/* Faint Recycle Logo Background decoration */}
        <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05] pointer-events-none text-amber-800">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5,10.2L5.2,11.5L2,13.3L3.8,16.5L7,14.7L7.7,16L4.5,17.8L3.2,15.5L1,14.3L1.5,13.2L4.5,10.2M19.5,10.2L22.5,13.2L23,14.3L20.8,15.5L19.5,17.8L16.3,16L17,14.7L20.2,16.5L18.4,13.3L15.2,11.5L19.5,10.2M12,2L16.3,4.5L17,5.7L13.8,7.5L12.5,9.8L9.3,8L10,6.7L13.2,8.5L11.4,5.3L8.2,3.5L12,2Z" />
          </svg>
        </div>

        {/* Leaf green icon */}
        <div className="text-[#0D631B] flex-shrink-0 mt-0.5 z-10">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M17,8C8,10 5.9,16.17 5.9,16.17C5.9,16.17 7,14 11,13C12,13 14,13 14,13C14,13 11,16 9,18C8,19 7.22,20.24 7.22,20.24C7.22,20.24 9.1,19.66 10.3,19C12.3,18 15.3,15 15.3,15C15.3,15 15,17 14,19C13.6,19.8 13.5,21 13.5,21C13.5,21 16.5,19 19,16C22,12 21,5 21,5C21,5 19.3,6.2 17,8Z" />
          </svg>
        </div>

        {/* Text descriptions */}
        <div className="flex flex-col gap-1.5 z-10">
          <h4 className="text-sm font-extrabold text-amber-900 tracking-tight leading-none">
            Tips Hijau
          </h4>
          <p className="text-xs text-amber-850/80 font-bold leading-relaxed">
            {tipsText}
          </p>
        </div>

      </div>
    </div>
  );
};
