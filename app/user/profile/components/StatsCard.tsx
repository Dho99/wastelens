import React from "react";

interface StatsCardProps {
  totalPoints: number;
  rankIndex: number;
  rankCity: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  totalPoints,
  rankIndex,
  rankCity,
}) => {
  return (
    <div className="px-4 mb-5">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm grid grid-cols-2 gap-4 divide-x divide-gray-100 select-none">
        
        {/* Left Column (Total Points) */}
        <div className="flex flex-col gap-1 items-start pl-2">
          <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
            TOTAL POIN
          </span>
          <p className="text-xl font-extrabold text-[#1E7D38] leading-none tracking-tight">
            {totalPoints.toLocaleString("id-ID")}{" "}
            <span className="text-[11px] font-bold text-gray-400 tracking-normal ml-0.5">XP</span>
          </p>
        </div>

        {/* Right Column (Ranking Index) */}
        <div className="flex flex-col gap-1 items-start pl-5">
          <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
            PERINGKAT
          </span>
          <p className="text-xl font-extrabold text-gray-800 leading-none tracking-tight">
            #{rankIndex}{" "}
            <span className="text-[11px] font-bold text-gray-400 tracking-normal ml-0.5 font-semibold">
              di {rankCity}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};
