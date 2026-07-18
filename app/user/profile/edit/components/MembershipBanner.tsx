import React from "react";

interface MembershipBannerProps {
  level: string;
}

export const MembershipBanner: React.FC<MembershipBannerProps> = ({ level }) => {
  return (
    <div className="px-4 mb-8">
      <div className="bg-[#2E7D32] text-white rounded-3xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden select-none">
        
        {/* Faint leaf watermarks */}
        <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none text-emerald-100">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 5.9,16.17C5.9,16.17 7,14 11,13C12,13 14,13 14,13C14,13 11,16 9,18C8,19 7.22,20.24 7.22,20.24C7.22,20.24 9.1,19.66 10.3,19C12.3,18 15.3,15 15.3,15C15.3,15 15,17 14,19C13.6,19.8 13.5,21 13.5,21C13.5,21 16.5,19 19,16C22,12 21,5 21,5C21,5 19.3,6.2 17,8Z" />
          </svg>
        </div>

        {/* Left Side labels */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black text-emerald-200/90 tracking-wider uppercase">
            Status Keanggotaan
          </span>
          <p className="text-sm font-black text-white">
            {level}
          </p>
        </div>

        {/* Right Side circle leaf logo */}
        <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center shadow-sm flex-shrink-0 z-10">
          {/* MDI leaf */}
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M17,8C8,10 5.9,16.17 5.9,16.17C5.9,16.17 7,14 11,13C12,13 14,13 14,13C14,13 11,16 9,18C8,19 7.22,20.24 7.22,20.24C7.22,20.24 9.1,19.66 10.3,19C12.3,18 15.3,15 15.3,15C15.3,15 15,17 14,19C13.6,19.8 13.5,21 13.5,21C13.5,21 16.5,19 19,16C22,12 21,5 21,5C21,5 19.3,6.2 17,8Z" />
          </svg>
        </div>

      </div>
    </div>
  );
};
