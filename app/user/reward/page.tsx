"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useReward } from "./hooks/useReward";

// Slices
import { RewardBalance } from "./components/RewardBalance";
import { SearchBar } from "./components/SearchBar";
import { NearestPartners } from "./components/NearestPartners";
import { RedemptionHistory } from "./components/RedemptionHistory";

export default function RewardPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const { data, isLoading } = useReward();

    if (isLoading) {
        return (
            <div className="space-y-4 p-4 animate-pulse">
                <div className="h-28 bg-gray-200 rounded-3xl" />
                <div className="h-12 bg-gray-200 rounded-2xl" />
                <div className="h-40 bg-gray-200 rounded-3xl" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-gray-500">
                Gagal memuat reward dan penukaran koin.
            </div>
        );
    }

    // Filter partners based on search query
    const filteredPartners = data.partners.filter((partner) =>
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-12">
            {/* 1. Header (Navbar is automatically wrapper by user layout, so we don't duplicate it) */}
            <div className="pt-4" />

            {/* 2. Coin Balance Green Card */}
            <RewardBalance
                coins={data.coins}
                growth={data.growthThisWeek}
                onRedeemClick={() => console.log("Redeem coins clicked...")}
            />

            {/* 3. Search Bar for Partners or Coupons */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* 4. Nearest Partners Horizontal Slider */}
            <NearestPartners
                partners={filteredPartners}
                onViewAll={() => console.log("View all partners...")}
                onPartnerClick={(id) => router.push(`/user/reward/store/${id}`)}
            />

            {/* 5. Redemption Recent History */}
            <RedemptionHistory
                history={data.history}
                onViewAll={() => router.push("/user/reward/history")}
            />
        </div>
    );
}
