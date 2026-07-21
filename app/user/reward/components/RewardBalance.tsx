import React from "react";

interface RewardBalanceProps {
  coins: number;
  growth: number;
  onRedeemClick?: () => void;
}

export const RewardBalance: React.FC<RewardBalanceProps> = ({
  coins,
  growth,
  onRedeemClick,
}) => {
  return (
    <div className="px-4 mb-5">
      <div className="bg-[#1E7D38] rounded-3xl p-5 text-white flex items-center justify-between shadow-sm relative overflow-hidden">
        {/* Faint Background Illustration */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none select-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,10V21H7V10H17M12,4.88c0.75,0 1.38,0.61 1.38,1.37a1.37,1.37 0 0,1 -1.38,1.38C11.25,7.63 10.63,7 10.63,6.25c0-.76.62-1.37 1.37-1.37M20,10v1.5a1.5,1.5 0 0,1 -1.5,1.5h-13A1.5,1.5 0 0,1 4,11.5V10c0-.83.67-1.5 1.5-1.5h13a1.5,1.5 0 0,1 1.5,1.5Z" />
          </svg>
        </div>

        <div className="flex flex-col gap-1 z-10">
          <p className="text-[10px] font-black text-emerald-100 tracking-wider uppercase opacity-95">
            SALDO ANDA
          </p>
          <h2 className="text-2xl font-black text-white leading-none tracking-tight">
            {coins.toLocaleString("id-ID")} Koin
          </h2>

          {/* Growth Tag overlay */}
          <div className="mt-2.5 bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 w-fit border border-white/5">
            {/* MDI trending-up */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
            </svg>
            <span>+{growth} minggu ini</span>
          </div>
        </div>

        {/* Orange Tukar Button */}
        <button
          onClick={onRedeemClick}
          className="bg-[#F59E0B] hover:bg-[#d98918] active:scale-95 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-sm transition-all duration-200 z-10"
        >
          Tukar
        </button>
      </div>
    </div>
  );
};
