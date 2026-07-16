"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getHistoryListDummyData, HistoryGroup } from "./services/historyListService";

// Slices
import { HistoryHeader } from "./components/HistoryHeader";
import { HistorySearch } from "./components/HistorySearch";
import { HistoryList } from "./components/HistoryList";

function HistoryListPageContent() {
  const router = useRouter();
  const [groups, setGroups] = useState<HistoryGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    // Fetch mock history transactions grouped by month from service
    const data = getHistoryListDummyData();
    setGroups(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-12 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-3xl" />
        <div className="h-20 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  // Filter groups and items based on search query
  const filteredGroups = groups
    .map((g) => {
      const filteredItems = g.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.merchantName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...g,
        items: filteredItems
      };
    })
    .filter((g) => g.items.length > 0);

  const handleItemClick = (itemId: string) => {
    console.log(`Navigating to history detail of: ${itemId}`);
    // Redirect user to reward history detail page /user/reward/history/[itemId]
    router.push(`/user/reward/history/${itemId}`);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12">
      {/* 1. Header back arrow */}
      <HistoryHeader onBackClick={() => router.push("/user/reward")} />

      {/* 2. Search & Filter Input Bar */}
      <HistorySearch
        value={searchQuery}
        onChange={setSearchQuery}
        onFilterClick={() => console.log("Open filter bottom sheet modal...")}
      />

      {/* 3. History Month Groups lists */}
      {filteredGroups.length > 0 ? (
        <HistoryList groups={filteredGroups} onItemClick={handleItemClick} />
      ) : (
        <div className="p-8 text-center text-gray-400 font-semibold text-xs mt-12">
          Tidak ada riwayat penukaran yang sesuai.
        </div>
      )}
    </div>
  );
}

export default function HistoryListPage() {
  return (
    <ErrorBoundary>
      <HistoryListPageContent />
    </ErrorBoundary>
  );
}
