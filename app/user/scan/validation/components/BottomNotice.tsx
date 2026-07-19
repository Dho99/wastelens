import React from "react";

export const BottomNotice: React.FC = () => {
  return (
    <div className="px-6 pb-8 text-center flex justify-center">
      <div className="bg-[#EBF7EE] border border-[#d3eed9] text-[#287A38] text-[10px] font-black py-2 px-5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
        {/* MDI shield-check-outline */}
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M11,15L17.5,8.5L16.08,7.08L11,12.17L8.92,10.08L7.5,11.5L11,15M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
        <span>Proses ini memakan waktu kurang dari 10 detik.</span>
      </div>
    </div>
  );
};
