import React from "react";

interface StatsCardProps {
  totalReports: number;
  totalCoins: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ totalReports, totalCoins }) => {
  return (
    <div className="px-4 mb-5">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex items-center justify-between">
        {/* Total Laporan */}
        <div className="flex-1 text-center pr-3 border-r border-gray-100">
          <p className="text-xs font-semibold text-gray-500 tracking-wide">
            Total Laporan
          </p>
          <p className="text-3xl font-black text-[#1E7D38] mt-1.5 leading-none">
            {totalReports}
          </p>
        </div>

        {/* Koin Terkumpul */}
        <div className="flex-1 text-center pl-3">
          <p className="text-xs font-semibold text-gray-500 tracking-wide">
            Koin Terkumpul
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            {/* Dollar coin icon in pink/red circle */}
            <div className="w-6 h-6 rounded-full bg-[#B3386D] text-white flex items-center justify-center shadow-sm font-black text-xs leading-none">
              $
            </div>
            <span className="text-2xl font-black text-gray-900 leading-none">
              {totalCoins.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
