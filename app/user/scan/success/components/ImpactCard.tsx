import React from "react";

interface ImpactCardProps {
  rewardPoints: number;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({ rewardPoints }) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-[#FFF8EC] border border-[#ffecd6] rounded-3xl p-5 shadow-sm flex gap-4 relative overflow-hidden">
        {/* Faint Gift Background Vector decoration */}
        <div className="absolute right-3 bottom-0 opacity-[0.04] pointer-events-none select-none">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="text-amber-800">
            <path d="M17,10V21H7V10H17M12,4.88c0.75,0 1.38,0.61 1.38,1.37a1.37,1.37 0 0,1 -1.38,1.38C11.25,7.63 10.63,7 10.63,6.25c0-.76.62-1.37 1.37-1.37M20,10v1.5a1.5,1.5 0 0,1 -1.5,1.5h-13A1.5,1.5 0 0,1 4,11.5V10c0-.83.67-1.5 1.5-1.5h13a1.5,1.5 0 0,1 1.5,1.5Z" />
          </svg>
        </div>

        {/* Orange Star circle icon */}
        <div className="w-11 h-11 rounded-full bg-[#F39E1F] text-white flex items-center justify-center shadow-sm flex-shrink-0">
          {/* MDI star */}
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
          </svg>
        </div>

        {/* Details log */}
        <div className="flex-1 flex flex-col gap-0.5 z-10 pr-2">
          <h3 className="text-sm font-extrabold text-amber-900 tracking-tight">
            Impact &amp; Hadiah
          </h3>
          <p className="text-xs text-amber-800/80 font-semibold leading-relaxed">
            Kamu akan mendapatkan <span className="text-[#E38A00] font-black">{rewardPoints} Koin</span> setelah laporan diverifikasi oleh tim WasteLens.
          </p>
        </div>
      </div>
    </div>
  );
};
