import React from "react";
import { RewardPartner } from "../services/rewardService";

interface NearestPartnersProps {
  partners: RewardPartner[];
  onViewAll?: () => void;
  onPartnerClick?: (partnerId: string) => void;
}

export const NearestPartners: React.FC<NearestPartnersProps> = ({
  partners,
  onViewAll,
  onPartnerClick,
}) => {
  return (
    <div className="mb-6">
      {/* Header section */}
      <div className="flex items-center justify-between px-5 mb-3">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">
          Tukar di Mitra Terdekat
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#1E7D38] hover:text-[#165D29] hover:underline transition-all"
        >
          Lihat Semua
        </button>
      </div>

      {/* Horizontal scrolling box list */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none px-4">
        {partners.map((partner) => {
          let iconNode = null;
          let iconBg = "bg-gray-100 text-gray-400";

          if (partner.type === "STORE") {
            // MDI storefront-outline
            iconBg = "bg-[#FDF2F4] text-[#C53C2D]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z" />
              </svg>
            );
          } else {
            // MDI coffee-outline
            iconBg = "bg-[#FFF8EC] text-[#F39E1F]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M2,21H20V19H2M20,8H18V5H2V14A4,4 0 0,0 6,18H14A4,4 0 0,0 18,14V12H20A2,2 0 0,0 22,10V10A2,2 0 0,0 20,8M16,5V8H4V5H16M16,14A2,2 0 0,1 14,16H6A2,2 0 0,1 4,14V10H16V14M20,10H18V10H20V10Z" />
              </svg>
            );
          }

          return (
            <div
              key={partner.id}
              onClick={() => onPartnerClick?.(partner.id)}
              className="bg-white border border-gray-100/80 rounded-3xl p-4 flex flex-col justify-between shadow-sm min-w-[200px] flex-shrink-0 cursor-pointer hover:scale-[1.01] transition-all duration-200"
            >
              {/* Header Info */}
              <div className="flex gap-3 items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${iconBg}`}>
                  {iconNode}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 className="text-xs font-black text-gray-800 truncate">
                    {partner.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                    {/* Location pin icon */}
                    <svg className="w-3 h-3 fill-current text-gray-400" viewBox="0 0 24 24">
                      <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7-7.75 7-13C17,5.13 13.87,2 12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z" />
                    </svg>
                    <span>{partner.distance}</span>
                  </p>
                </div>
              </div>

              {/* Thin Divider */}
              <div className="w-full h-[1px] bg-gray-100 mb-3" />

              {/* Footer details */}
              <div className="flex items-center justify-between">
                {partner.isOpen && (
                  <span className="bg-[#EBF7EE] text-[#248A3D] text-[9px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
                    Buka
                  </span>
                )}
                <span className="text-xs font-black text-[#1E7D38]">
                  {partner.rewardCount} Reward
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
