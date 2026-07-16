import React from "react";

interface SuccessActionsProps {
  onCheckStatus: () => void;
  onGoHome: () => void;
}

export const SuccessActions: React.FC<SuccessActionsProps> = ({
  onCheckStatus,
  onGoHome,
}) => {
  return (
    <div className="px-4 space-y-3 pb-8">
      {/* 1. Lihat Status Laporan */}
      <button
        onClick={onCheckStatus}
        className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-[0.98] text-white font-black text-xs py-4 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
      >
        <span>Lihat Status Laporan</span>
        {/* MDI arrow-right */}
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M4,11H16.17L11.58,6.41L13,5L20,12L13,19L11.58,17.59L16.17,13H4V11Z" />
        </svg>
      </button>

      {/* 2. Kembali ke Beranda */}
      <button
        onClick={onGoHome}
        className="w-full bg-white border border-gray-200 hover:bg-gray-50/50 active:scale-[0.98] text-gray-700 font-black text-xs py-4 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
      >
        {/* MDI home-outline */}
        <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 24 24">
          <path d="M12,5.69L17,10.19V18H15V12H9V18H7V10.19L12,5.69M12,3L2,12H5V20H11V14H13V20H19V12H22L12,3Z" />
        </svg>
        <span>Kembali ke Beranda</span>
      </button>
    </div>
  );
};
