"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Services
import {
    getHistoryDummyData,
    HistoryReport,
    HistoryStats,
} from "./services/historyService";

// Sliced Components
import { HistoryHeader } from "./components/HistoryHeader";
import { StatsCard } from "./components/StatsCard";
import { FilterPills, FilterStatus } from "./components/FilterPills";
import { HistoryList } from "./components/HistoryList";

export default function HistoryPage() {
    const [stats, setStats] = useState<HistoryStats | null>(null);
    const [reports, setReports] = useState<HistoryReport[]>([]);
    const [filteredReports, setFilteredReports] = useState<HistoryReport[]>([]);
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load mock dataset from dashboard service layer
        const data = getHistoryDummyData();
        setStats(data.stats);
        setReports(data.reports);
        setFilteredReports(data.reports);
        setLoading(false);
    }, []);

    // Filter handler
    const handleFilterChange = (filter: FilterStatus) => {
        setActiveFilter(filter);
        if (filter === "ALL") {
            setFilteredReports(reports);
        } else {
            setFilteredReports(reports.filter((r) => r.status === filter));
        }
    };

    if (loading) {
        return (
            <div className="space-y-4 p-4 animate-pulse">
                <div className="h-8 w-44 bg-gray-200 rounded-md" />
                <div className="h-28 bg-gray-200 rounded-3xl" />
                <div className="h-10 bg-gray-200 rounded-full" />
                <div className="space-y-3">
                    <div className="h-24 bg-gray-200 rounded-3xl" />
                    <div className="h-24 bg-gray-200 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-12">
            {/* 1. Header (Riwayat Laporan + Search Icon) */}
            <HistoryHeader
                onSearchClick={() => console.log("Search reports...")}
            />

            {/* 2. Stats Card (Total Laporan & Koin Terkumpul) */}
            {stats && (
                <StatsCard
                    totalReports={stats.totalReports}
                    totalCoins={stats.totalCoins}
                />
            )}

            {/* 3. Filter Pills (Semua, Proses, Selesai, Perlu Diperiksa) */}
            <FilterPills
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
            />

            {/* 4. History List Cards */}
            <HistoryList
                reports={filteredReports}
                onReportClick={(id) =>
                    router.push(`/user/history/report/${id}`)
                }
            />
        </div>
    );
}
