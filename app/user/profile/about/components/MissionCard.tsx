import React from "react";

interface MissionCardProps {
  description: string;
}

export const MissionCard: React.FC<MissionCardProps> = ({ description }) => {
  return (
    <div className="px-4 mb-5">
      <div className="bg-[#FAF9F5] border border-gray-150/40 rounded-3xl p-5 shadow-sm space-y-3.5 select-none">
        
        {/* Header (Leaf icon + Misi Kami) */}
        <div className="flex items-center gap-2.5 text-[#1E7D38]">
          {/* MDI leaf */}
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M17,8C8,10 5.9,16.17 5.9,16.17C5.9,16.17 7,14 11,13C12,13 14,13 14,13C14,13 11,16 9,18C8,19 7.22,20.24 7.22,20.24C7.22,20.24 9.1,19.66 10.3,19C12.3,18 15.3,15 15.3,15C15.3,15 15,17 14,19C13.6,19.8 13.5,21 13.5,21C13.5,21 16.5,19 19,16C22,12 21,5 21,5C21,5 19.3,6.2 17,8Z" />
          </svg>
          <span className="text-sm font-black tracking-tight">
            Misi Kami
          </span>
        </div>

        {/* Description body */}
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          {description}
        </p>

      </div>
    </div>
  );
};
