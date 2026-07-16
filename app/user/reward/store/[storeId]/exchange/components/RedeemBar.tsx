import React from "react";

interface RedeemBarProps {
  remainingCoins: number;
  onRedeem: () => void;
}

export const RedeemBar: React.FC<RedeemBarProps> = ({
  remainingCoins,
  onRedeem,
}) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 space-y-3.5 shadow-lg">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-gray-400">Sisa Saldo</span>
        <span className="text-base font-black text-gray-850">
          {remainingCoins.toLocaleString("id-ID")} Koin
        </span>
      </div>

      <button
        onClick={onRedeem}
        className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-95 text-white font-black text-xs py-4 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
      >
        <span>Tukar Sekarang</span>
        {/* MDI arrow-right */}
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M4,11H16.17L11.58,6.41L13,5L20,12L13,19L11.58,17.59L16.17,13H4V11Z" />
        </svg>
      </button>
    </div>
  );
};
