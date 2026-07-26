"use client";

import Image from "next/image";
import React, { useState } from "react";

export interface LeaderboardEntry {
  rank: number;
  nama: string;
  xp: number;
  badge: string;
  avatar: string;
  rankChange?: number;
}

interface PodiumSectionProps {
  top3: LeaderboardEntry[];
}

const AvatarWithFallback: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const fallbackUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

  return (
    <Image
      src={error ? fallbackUrl : src || fallbackUrl}
      alt={alt}
      width={64}
      height={64}
      onError={() => setError(true)}
      className={className}
    />
  );
};

export const PodiumSection: React.FC<PodiumSectionProps> = ({ top3 }) => {
  // Map podium indices by ranks
  const rank1 = top3.find((e) => e.rank === 1);
  const rank2 = top3.find((e) => e.rank === 2);
  const rank3 = top3.find((e) => e.rank === 3);

  return (
    <div className="px-5 mb-5 pt-2">
      {/* Light green curved card wrapper matching screenshot background container */}
      <div className="bg-[#EBF3EC] rounded-[32px] p-6 shadow-sm relative overflow-hidden flex flex-col justify-end min-h-[260px]">
        
        {/* Podium Avatars Container */}
        <div className="grid grid-cols-3 items-end gap-2 relative z-10 select-none pb-4">
          
          {/* Rank 2 (Left) */}
          {rank2 && (
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {/* Avatar with circle wrapper */}
                <div className="w-16 h-16 rounded-full border-2 border-white p-[1px] bg-white shadow-sm overflow-hidden flex items-center justify-center">
                  <AvatarWithFallback
                    src={rank2.avatar}
                    alt={rank2.nama}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {/* Rank Badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E5EDE7] text-gray-700 text-xs font-black flex items-center justify-center border-2 border-white shadow-sm">
                  2
                </div>
              </div>
              <span className="text-[11px] font-black text-gray-800 mt-2 truncate max-w-[80px] leading-tight">
                {rank2.nama}
              </span>
              <span className="text-[10px] font-bold text-[#287A38] mt-0.5 whitespace-nowrap">
                {rank2.xp.toLocaleString("id-ID")} XP
              </span>
            </div>
          )}

          {/* Rank 1 (Center - Elevated) */}
          {rank1 && (
            <div className="flex flex-col items-center text-center -mt-6">
              {/* Crown/Star Badge Indicator at the very top of Avatar */}
              <div className="w-6 h-6 rounded-full bg-[#8E7044] border-2 border-white flex items-center justify-center shadow-sm text-white mb-1.5 animate-bounce">
                {/* Gold Star Outline */}
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                </svg>
              </div>

              <div className="relative">
                {/* Avatar with thick green circle border */}
                <div className="w-22 h-22 rounded-full border-[3px] border-[#287A38] p-[2px] bg-white shadow-md overflow-hidden flex items-center justify-center">
                  <AvatarWithFallback
                    src={rank1.avatar}
                    alt={rank1.nama}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {/* Rank Badge */}
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1E7D38] text-white text-xs font-black flex items-center justify-center border-[3px] border-white shadow-sm">
                  1
                </div>
              </div>

              <span className="text-sm font-black text-gray-850 mt-2 truncate max-w-[110px] leading-tight">
                {rank1.nama}
              </span>
              <span className="text-[11px] font-black text-[#287A38] mt-0.5 whitespace-nowrap">
                {rank1.xp.toLocaleString("id-ID")} XP
              </span>
              {/* Leaderboard title pill */}
              <span className="bg-[#FAF9F5]/90 border border-gray-150 text-[#1E7D38] text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mt-1.5 shadow-sm max-w-[110px] truncate">
                {rank1.badge}
              </span>
            </div>
          )}

          {/* Rank 3 (Right) */}
          {rank3 && (
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {/* Avatar with circle wrapper */}
                <div className="w-16 h-16 rounded-full border-2 border-white p-[1px] bg-white shadow-sm overflow-hidden flex items-center justify-center">
                  <AvatarWithFallback
                    src={rank3.avatar}
                    alt={rank3.nama}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {/* Rank Badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFF0E6] text-orange-800 text-xs font-black flex items-center justify-center border-2 border-white shadow-sm">
                  3
                </div>
              </div>
              <span className="text-[11px] font-black text-gray-800 mt-2 truncate max-w-[80px] leading-tight">
                {rank3.nama}
              </span>
              <span className="text-[10px] font-bold text-[#287A38] mt-0.5 whitespace-nowrap">
                {rank3.xp.toLocaleString("id-ID")} XP
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
