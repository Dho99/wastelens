"use client";

import React from "react";

export const EcoPointsInfoCard: React.FC = () => {
  return (
    <div className="px-5 mb-8 select-none">
      {/* Light yellow info banner card */}
      <div className="bg-[#FFF5D6] border border-[#FFE7A3]/60 rounded-3xl p-5 shadow-sm flex gap-4.5 items-start">
        
        {/* Info Icon in orange color */}
        <div className="w-10 h-10 rounded-xl bg-white border border-[#FFF0C2] flex items-center justify-center text-[#D47E00] shadow-sm flex-shrink-0">
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M11,9H13V7H11V9M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
          </svg>
        </div>

        {/* Text descriptions */}
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-black text-gray-805 leading-none">
            Tentang Eco Points
          </h4>
          <p className="text-[11px] text-[#A66E14] font-semibold leading-relaxed">
            Poin dihitung berdasarkan jumlah sampah yang didaur ulang dan partisipasi dalam tantangan komunitas mingguan. Raih peringkat teratas untuk mendapatkan lencana eksklusif!
          </p>
        </div>

      </div>
    </div>
  );
};
