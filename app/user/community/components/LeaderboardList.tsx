"use client";

import React, { useState } from "react";
import { LeaderboardEntry } from "./PodiumSection";

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
}

const AvatarWithFallback: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const fallbackUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={error ? fallbackUrl : src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
    />
  );
};

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  entries,
  loading,
  error,
  hasMore,
  onLoadMore,
  onRetry,
}) => {
  
  if (error) {
    return (
      <div className="px-5 py-8 text-center select-none space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-gray-800">Gagal Memuat Leaderboard</h4>
          <p className="text-[11px] text-gray-400 font-semibold max-w-[240px] mx-auto leading-relaxed">
            Koneksi internet bermasalah atau server sedang sibuk. Silakan coba kembali.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="bg-[#287A38] hover:bg-[#20632d] active:scale-95 text-white font-black text-xs px-6 py-2.5 rounded-full shadow-sm transition-all duration-200"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!loading && entries.length === 0) {
    return (
      <div className="px-5 py-8 text-center select-none space-y-3">
        <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-gray-700">Tidak Ada Rilis Peringkat</h4>
          <p className="text-[11px] text-gray-400 font-semibold max-w-[200px] mx-auto leading-normal">
            Belum ada aktivitas di periode ini. Jadilah yang pertama aktif!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 mb-5 select-none space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.rank + "-" + entry.nama}
          className="bg-white border border-gray-100 rounded-3xl p-4.5 shadow-sm flex items-center justify-between transition-all duration-200 hover:border-gray-200"
        >
          {/* Left: Rank, Avatar, Details */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Rank index */}
            <span className="text-sm font-black text-gray-550 flex-shrink-0 w-6 text-center">
              {entry.rank}
            </span>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
              <AvatarWithFallback
                src={entry.avatar}
                alt={entry.nama}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Profile details */}
            <div className="flex flex-col min-w-0">
              <h4 className="text-xs font-black text-gray-800 truncate">
                {entry.nama}
              </h4>
              <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider truncate mt-0.5">
                {entry.badge}
              </span>
            </div>
          </div>

          {/* Right: XP tally & trend change */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="text-xs font-black text-[#287A38] whitespace-nowrap">
              {entry.xp.toLocaleString("id-ID")} XP
            </span>
            {entry.rankChange !== undefined && (
              <div className="flex items-center gap-0.5 mt-0.5 text-[9px] font-bold">
                {entry.rankChange > 0 ? (
                  <>
                    {/* green arrow up trend */}
                    <svg className="w-3.5 h-3.5 fill-current text-emerald-600" viewBox="0 0 24 24">
                      <path d="M7,14L12,9L17,14H7Z" />
                    </svg>
                    <span className="text-emerald-600">{entry.rankChange}</span>
                  </>
                ) : entry.rankChange < 0 ? (
                  <>
                    {/* red arrow down trend */}
                    <svg className="w-3.5 h-3.5 fill-current text-rose-600" viewBox="0 0 24 24">
                      <path d="M7,10L12,15L17,10H7Z" />
                    </svg>
                    <span className="text-rose-600">{Math.abs(entry.rankChange)}</span>
                  </>
                ) : (
                  <span className="text-gray-300 font-semibold mr-1">•</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Skeletons loader if fetching next page */}
      {loading && (
        <div className="space-y-3 pt-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-4.5 shadow-sm flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-6 h-4 bg-gray-200 rounded" />
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                  <div className="h-2 w-20 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Infinite load pagination triggers */}
      {hasMore && !loading && (
        <div className="pt-2 flex justify-center">
          <button
            onClick={onLoadMore}
            className="border border-gray-200 hover:bg-gray-50 active:scale-95 text-gray-500 font-black text-[11px] py-3 px-8 rounded-full transition-all duration-200 shadow-sm"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
};
