import React from "react";

interface SuccessActionsProps {
  onGoHome: () => void;
  onViewHistory: () => void;
}

export const SuccessActions: React.FC<SuccessActionsProps> = ({
  onGoHome,
  onViewHistory,
}) => {
  return (
    <div className="px-4 space-y-4 pb-8 flex flex-col items-center">
      {/* 1. Kembali ke Beranda */}
      <button
        onClick={onGoHome}
        className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-[0.98] text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span>Kembali ke Beranda</span>
        {/* MDI home-outline */}
        <svg className="w-4 h-4 fill-current text-emerald-200" viewBox="0 0 24 24">
          <path d="M12,5.69L17,10.19V18H15V12H9V18H7V10.19L12,5.69M12,3L2,12H5V20H11V14H13V20H19V12H22L12,3Z" />
        </svg>
      </button>

      {/* 2. Lihat Riwayat Link */}
      <button
        onClick={onViewHistory}
        className="text-xs font-black text-[#287A38] hover:text-[#20632d] hover:underline py-1 transition-all"
      >
        Lihat Riwayat
      </button>
    </div>
  );
};
