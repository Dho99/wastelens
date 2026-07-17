import React from "react";

interface TipsCardProps {
  tipsText: string;
}

export const TipsCard: React.FC<TipsCardProps> = ({ tipsText }) => {
  return (
    <div className="px-4 mb-6">
      <div className="bg-[#FAFDFB] border border-gray-100/80 border-l-4 border-l-[#287A38] rounded-r-2xl p-4 flex gap-3 shadow-sm select-none">
        {/* MDI leaf */}
        <div className="text-[#287A38] flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17,8C8,10 5.9,16.17 5.9,16.17C5.9,16.17 7,14 11,13C12,13 14,13 14,13C14,13 11,16 9,18C8,19 7.22,20.24 7.22,20.24C7.22,20.24 9.1,19.66 10.3,19C12.3,18 15.3,15 15.3,15C15.3,15 15,17 14,19C13.6,19.8 13.5,21 13.5,21C13.5,21 16.5,19 19,16C22,12 21,5 21,5C21,5 19.3,6.2 17,8Z" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-black text-gray-800 tracking-tight">
            Tips Hijau
          </h4>
          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
            {tipsText}
          </p>
        </div>
      </div>
    </div>
  );
};
