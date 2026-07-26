"use client";

import Image from "next/image";
import React, { useState } from "react";
import { LeaderboardEntry } from "./PodiumSection";

interface CurrentUserRankCardProps {
  currentUser: LeaderboardEntry | null;
}

const AvatarWithFallback: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const fallbackUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

  return (
    <Image
      src={error ? fallbackUrl : src || fallbackUrl}
      alt={alt}
      width={44}
      height={44}
      onError={() => setError(true)}
      className={className}
    />
  );
};

export const CurrentUserRankCard: React.FC<CurrentUserRankCardProps> = ({ currentUser }) => {
  if (!currentUser) return null;

  return (
    <div className="px-5 mb-5 select-none">
      {/* Prominent dark green card layout */}
      <div className="bg-[#287A38] border border-emerald-700/10 rounded-3xl p-4.5 shadow-md flex items-center justify-between text-white transition-all duration-300">
        
        {/* Left: Rank & profile details */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Rank number */}
          <span className="text-lg font-black tracking-tight flex-shrink-0 w-8">
            #{currentUser.rank}
          </span>

          {/* Profile Avatar */}
          <div className="w-11 h-11 rounded-full border border-emerald-500/30 p-[1px] bg-emerald-600/20 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
            <AvatarWithFallback
              src={currentUser.avatar}
              alt={currentUser.nama}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Name & details */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-extrabold truncate">
              {currentUser.nama}
            </span>
            <span className="text-[10px] text-emerald-100/90 font-bold truncate mt-0.5">
              {currentUser.badge} • {currentUser.xp.toLocaleString("id-ID")} XP
            </span>
          </div>
        </div>

        {/* Right: Trend badge / status indicator if any */}
        {currentUser.rankChange !== undefined && currentUser.rankChange !== 0 && (
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] font-black border border-white/10 flex-shrink-0">
            {currentUser.rankChange > 0 ? (
              <>
                {/* Arrow Up Trend */}
                <svg className="w-3.5 h-3.5 fill-current text-emerald-300" viewBox="0 0 24 24">
                  <path d="M7,14L12,9L17,14H7Z" />
                </svg>
                <span className="text-emerald-300">+{currentUser.rankChange}</span>
              </>
            ) : (
              <>
                {/* Arrow Down Trend */}
                <svg className="w-3.5 h-3.5 fill-current text-rose-300" viewBox="0 0 24 24">
                  <path d="M7,10L12,15L17,10H7Z" />
                </svg>
                <span className="text-rose-300">{currentUser.rankChange}</span>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
