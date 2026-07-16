import React from "react";

interface RewardBannerProps {
  points: number;
}

export const RewardBanner: React.FC<RewardBannerProps> = ({ points }) => {
  return (
    <div className="px-4 mb-5">
      <div className="bg-[#287A38] rounded-3xl p-5 text-white flex items-center justify-between shadow-sm relative overflow-hidden">
        {/* Subtle decorative background circle pattern */}
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mb-10 pointer-events-none" />

        <div className="flex flex-col gap-1 pr-2">
          <h3 className="text-xl font-black tracking-wide">Terima Kasih!</h3>
          <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
            Kontribusi Anda telah tervalidasi.
          </p>
        </div>

        {/* Highlighted Reward Box */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl px-4 py-3 text-center min-w-[100px] flex-shrink-0">
          <p className="text-[9px] font-black text-emerald-200 tracking-wider uppercase mb-0.5">
            HADIAH
          </p>
          <p className="text-lg font-black text-white leading-none whitespace-nowrap">
            +{points} Poin
          </p>
        </div>
      </div>
    </div>
  );
};
