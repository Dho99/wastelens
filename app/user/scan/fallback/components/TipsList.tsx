import React from "react";
import { TipItem } from "../services/fallbackService";

interface TipsListProps {
  tips: TipItem[];
}

export const TipsList: React.FC<TipsListProps> = ({ tips }) => {
  return (
    <div className="px-5 mb-6">
      <h3 className="text-sm font-black text-gray-900 tracking-wide mb-3 px-1">
        Tips agar deteksi lancar:
      </h3>

      <div className="space-y-3">
        {tips.map((tip) => {
          let iconNode = null;

          if (tip.iconType === "SUN") {
            // MDI brightness-5 (Sun / Brightness)
            iconNode = (
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,18A6,6 0 1,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z" />
              </svg>
            );
          } else {
            // MDI focus-field (viewfinder)
            iconNode = (
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,19H15V21H19A2,2 0 0,0 21,19V15H19M19,5V9H21V5A2,2 0 0,0 19,3H15V5M5,5H9V3H5A2,2 0 0,0 3,5V9H5M5,19V15H3V19A2,2 0 0,0 5,21H9V19M12,8A4,4 0 1,0 16,12A4,4 0 0,0 12,8Z" />
              </svg>
            );
          }

          return (
            <div
              key={tip.id}
              className="bg-white border border-gray-100/80 rounded-2xl p-4 flex gap-4 shadow-sm items-center"
            >
              {/* Soft orange circle icon wrapper */}
              <div className="w-11 h-11 rounded-full bg-[#FFF0E6] text-[#C55D2D] flex items-center justify-center shadow-sm flex-shrink-0">
                {iconNode}
              </div>

              {/* Tips description labels */}
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-black text-gray-800">
                  {tip.title}
                </h4>
                <p className="text-[11px] text-gray-400 font-semibold leading-normal">
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
