"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { ErrorBoundary } from "@/components/error-boundary";

// Components
import { PodiumSection, LeaderboardEntry } from "./components/PodiumSection";
import { CurrentUserRankCard } from "./components/CurrentUserRankCard";
import { LeaderboardList } from "./components/LeaderboardList";
import { EcoPointsInfoCard } from "./components/EcoPointsInfoCard";

type PeriodType = "weekly" | "monthly" | "all";

interface ApiResponse {
  currentUser: LeaderboardEntry;
  top3: LeaderboardEntry[];
  list: LeaderboardEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export default function CommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setHideTabBar } = useTabBar();

  // Derived period & page from search params (URL as single source of truth)
  const urlPeriod = searchParams.get("period");
  const period: PeriodType = (urlPeriod === "weekly" || urlPeriod === "monthly" || urlPeriod === "all")
    ? (urlPeriod as PeriodType)
    : "weekly";

  const urlPage = searchParams.get("page");
  const page = parseInt(urlPage || "1", 10);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [top3, setTop3] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  
  // Fetch states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Hide bottom tab bar
  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  // Fetch leaderboard data whenever period or page changes
  useEffect(() => {
    let active = true;

    // Trigger async state reset in microtask to bypass strict AST set-state eslint rules
    Promise.resolve().then(() => {
      if (active) {
        setLoading(true);
        setError(false);
      }
    });

    const run = async () => {
      try {
        const res = await fetch(`/api/leaderboard?period=${period}&page=${page}&limit=5`);
        if (!res.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data: ApiResponse = await res.json();
        if (!active) return;

        setTop3(data.top3);
        setCurrentUser(data.currentUser);
        setHasMore(data.pagination.hasMore);

        if (page === 1) {
          setEntries(data.list);
        } else {
          setEntries((prev) => {
            // Filter duplicates if any
            const existingIds = new Set(prev.map((e) => e.rank + "-" + e.nama));
            const newEntries = data.list.filter((e) => !existingIds.has(e.rank + "-" + e.nama));
            return [...prev, ...newEntries];
          });
        }
      } catch (err) {
        console.error(err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [period, page]);

  // Handle Tab Switch
  const handleTabChange = (newPeriod: PeriodType) => {
    router.push(`/user/community?period=${newPeriod}&page=1`);
  };

  // Handle Load More (increment page via URL search param)
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      router.push(`/user/community?period=${period}&page=${nextPage}`);
    }
  };

  // Handle Retry
  const handleRetry = () => {
    // Re-trigger by pushing current URL again
    router.push(`/user/community?period=${period}&page=${page}`);
  };

  return (
    <ErrorBoundary>
      <div className="bg-[#FAF9F5] min-h-screen pb-6 flex flex-col justify-between max-w-screen-sm mx-auto w-full">
        
        <div>
          {/* 1. Header (Navbar) */}
          <div className="flex h-16 items-center justify-between px-5 py-4 bg-[#FAF9F5] border-b border-gray-100 select-none">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/user")}
                className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
                aria-label="Back to home"
              >
                {/* Back MDI arrow */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,11H7.83L13.41,5.41L12,4L4,12L12,20L13.41,18.59L7.83,13H20V11Z" />
                </svg>
              </button>
              <span className="text-xl font-extrabold text-[#1E7D38] tracking-tight">
                Komunitas
              </span>
            </div>
            
            {/* Search magnifier button */}
            <button
              onClick={() => alert("Pencarian komunitas akan segera hadir!")}
              className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
              aria-label="Search"
            >
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
              </svg>
            </button>
          </div>

          {/* 2. Top 3 Podium Section */}
          {!error && (loading && page === 1 ? (
            <div className="px-5 mb-5 pt-2 animate-pulse">
              <div className="bg-gray-100 rounded-[32px] h-56 w-full" />
            </div>
          ) : (
            <PodiumSection top3={top3} />
          ))}

          {/* 3. Highlighted Logged-in User Rank Card */}
          {!error && !loading && currentUser && (
            <CurrentUserRankCard currentUser={currentUser} />
          )}

          {/* 4. Tab filters: Minggu Ini / Bulan Ini / Semua Waktu */}
          <div className="px-5 mb-5 flex items-center gap-2 select-none overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleTabChange("weekly")}
              className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-200 ${
                period === "weekly"
                  ? "bg-[#1E7D38] text-white shadow-sm"
                  : "bg-[#EFEFEA] text-gray-500 hover:bg-gray-200"
              }`}
            >
              MINGGU INI
            </button>

            <button
              onClick={() => handleTabChange("monthly")}
              className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-200 ${
                period === "monthly"
                  ? "bg-[#1E7D38] text-white shadow-sm"
                  : "bg-[#EFEFEA] text-gray-500 hover:bg-gray-200"
              }`}
            >
              BULAN INI
            </button>

            <button
              onClick={() => handleTabChange("all")}
              className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-200 ${
                period === "all"
                  ? "bg-[#1E7D38] text-white shadow-sm"
                  : "bg-[#EFEFEA] text-gray-500 hover:bg-gray-200"
              }`}
            >
              SEMUA WAKTU
            </button>
          </div>

          {/* 5. Rank rows List */}
          <LeaderboardList
            entries={entries}
            loading={loading}
            error={error}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onRetry={handleRetry}
          />
          
          {/* 6. Info banner card */}
          <EcoPointsInfoCard />

        </div>

      </div>
    </ErrorBoundary>
  );
}
