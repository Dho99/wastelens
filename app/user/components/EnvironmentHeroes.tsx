import React from "react";
import { EnvironmentHero } from "../services/dashboardService";

interface EnvironmentHeroesProps {
  heroes: EnvironmentHero[];
  onViewFullLeaderboard?: () => void;
}

export const EnvironmentHeroes: React.FC<EnvironmentHeroesProps> = ({
  heroes,
  onViewFullLeaderboard,
}) => {
  // Sort heroes by rank to place them correctly in podium (2nd, 1st, 3rd)
  const first = heroes.find((h) => h.rank === 1);
  const second = heroes.find((h) => h.rank === 2);
  const third = heroes.find((h) => h.rank === 3);

  return (
    <div className="px-5 mb-6">
      <div className="bg-white border border-gray-100/80 rounded-3xl p-5 shadow-sm">
        <h2 className="text-sm font-extrabold text-gray-900 tracking-wide mb-6">
          Pahlawan Lingkungan
        </h2>

        {/* Podium Layout */}
        <div className="flex items-end justify-center gap-2 mb-6">
          {/* #2 Rank */}
          {second && (
            <div className="flex flex-col items-center flex-1">
              <div className="relative mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={second.avatarUrl}
                    alt={second.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full bg-[#ECF3ED] rounded-xl pt-3 pb-2 text-center shadow-sm">
                <p className="text-xs font-black text-[#287A38]">#2</p>
                <p className="text-[10px] font-semibold text-gray-500 truncate px-1 mt-0.5">
                  {second.name}
                </p>
              </div>
            </div>
          )}

          {/* #1 Rank (Center, Tallest) */}
          {first && (
            <div className="flex flex-col items-center flex-1 z-10 -translate-y-2">
              <div className="relative mb-2 flex flex-col items-center">
                {/* Yellow "TOP" tag */}
                <div className="bg-[#E69300] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 z-20 shadow-sm">
                  TOP
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 -mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={first.avatarUrl}
                    alt={first.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full bg-[#E5ECE7] rounded-xl pt-4 pb-3 text-center shadow-md">
                <p className="text-sm font-black text-[#1E7D38]">#1</p>
                <p className="text-xs font-bold text-gray-800 truncate px-1 mt-0.5">
                  {first.name}
                </p>
              </div>
            </div>
          )}

          {/* #3 Rank */}
          {third && (
            <div className="flex flex-col items-center flex-1">
              <div className="relative mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={third.avatarUrl}
                    alt={third.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full bg-[#ECF3ED] rounded-xl pt-3 pb-2 text-center shadow-sm">
                <p className="text-xs font-black text-[#287A38]">#3</p>
                <p className="text-[10px] font-semibold text-gray-500 truncate px-1 mt-0.5">
                  {third.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View full leaderboard button */}
        <button
          onClick={onViewFullLeaderboard}
          className="w-full bg-[#FAF9F5] hover:bg-[#F2F1EC] text-gray-700 font-bold text-xs py-3 rounded-2xl border border-gray-100 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-1"
        >
          Lihat Leaderboard Penuh
        </button>
      </div>
    </div>
  );
};
