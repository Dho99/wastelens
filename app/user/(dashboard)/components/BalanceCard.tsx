import React from "react";

interface BalanceCardProps {
  coins: number;
  onTukarReward?: () => void;
  onRiwayat?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  coins,
  onTukarReward,
  onRiwayat,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="relative overflow-hidden rounded-[24px] bg-[#1E7D38] p-6 text-white shadow-md">
        {/* Subtle background gift illustration matching UI design */}
        <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none select-none">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12m16-4v4H4V8m16 0a3 3 0 00-3-3h-3m0 0V3h-2v2m2 0H10m0 0a3 3 0 00-3 3m0 0H4" />
            <rect x="2" y="8" width="20" height="4" rx="1" />
            <path d="M12 8v14M10 5a2 2 0 114 0" />
          </svg>
        </div>

        {/* Header Label */}
        <p className="text-[10px] font-semibold tracking-wider text-emerald-100 uppercase opacity-90">
          SALDO TERKUMPUL
        </p>

        {/* Coin Amount */}
        <div className="flex items-center gap-2 mt-1 mb-5">
          <div className="flex items-center justify-center bg-amber-400 text-[#1E7D38] rounded-full p-1 w-6 h-6">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
            </svg>
          </div>
          <span className="text-3xl font-extrabold text-amber-400 tracking-tight">
            {coins.toLocaleString("id-ID")} Koin
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={onTukarReward}
            className="flex items-center gap-2 bg-[#E38A00] hover:bg-[#c97b00] active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Tukar Reward
          </button>
          <button
            onClick={onRiwayat}
            className="flex items-center gap-2 bg-emerald-800/40 hover:bg-emerald-800/60 active:scale-95 text-emerald-100 border border-emerald-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Riwayat
          </button>
        </div>
      </div>
    </div>
  );
};
