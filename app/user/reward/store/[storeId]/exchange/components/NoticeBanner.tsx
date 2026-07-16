import React from "react";

export const NoticeBanner: React.FC = () => {
  return (
    <div className="px-4 mb-5">
      <div className="bg-[#FFF8EC] border border-[#ffecd6] rounded-2xl p-4 flex gap-3 shadow-sm">
        {/* MDI information-outline */}
        <div className="text-[#F39E1F] flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
          </svg>
        </div>
        <p className="text-[10px] font-bold text-amber-800/80 leading-normal tracking-wide text-left">
          Klik tombol di bawah untuk menukar koin Anda. Anda akan mendapatkan QR Code untuk ditunjukkan kepada merchant saat pengambilan barang.
        </p>
      </div>
    </div>
  );
};
