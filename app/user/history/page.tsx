"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHistory } from "./hooks/useHistory";
import { useDashboard } from "../(dashboard)/hooks/useDashboard";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";

type FilterType = "semua" | "proses" | "selesai" | "perlu_diperiksa";

export default function HistoryPage() {
    const router = useRouter();
    const {
        data: historyData,
        isLoading: historyLoading,
        error: historyError,
    } = useHistory();
    const { data: dashboardData } = useDashboard();

    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterType>("semua");

    useEffect(() => {
        if (historyError) {
            toast.error(
                historyError.message || "Gagal memuat riwayat pelaporan",
            );
        }
    }, [historyError]);

    // Loading Skeleton screen
    if (historyLoading) {
        return (
            <div className="bg-[#FAF9F5] min-h-screen p-4 space-y-4 select-none">
                <div className="h-28 bg-gray-100 rounded-3xl animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
                <div className="flex gap-2.5">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-10 w-20 bg-gray-100 rounded-full animate-pulse"
                        />
                    ))}
                </div>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-24 bg-gray-100 rounded-3xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    // Fallback if no history elements
    const allReports = historyData || [];
    const totalReportsCount = allReports.length;
    const totalCoinsBalance = dashboardData?.user?.coins ?? 1250;

    // Filter list helper
    const filteredReports = allReports.filter((report) => {
        // 1. Search Query Filter
        const landmark = report.city;
        const statusText = report.status.toLowerCase();
        const matchesSearch =
            landmark?.includes(searchQuery.toLowerCase()) ||
            statusText.includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // 2. Active Tab Filter
        if (activeFilter === "semua") return true;
        if (activeFilter === "proses") {
            return (
                report.status === "DIPROSES" ||
                report.status === "PENDING" ||
                report.status === "PROSES"
            );
        }
        if (activeFilter === "selesai") {
            return report.status === "SELESAI";
        }
        if (activeFilter === "perlu_diperiksa") {
            return (
                report.status === "PERLU_DIPERIKSA" ||
                report.status === "PERLU DIPERIKSA" ||
                report.status === "NEEDS_REVIEW"
            );
        }
        return true;
    });

    return (
        <ErrorBoundary>
            <div className="bg-[#FAF9F5] min-h-screen px-4 py-4 space-y-4 max-w-screen-sm mx-auto w-full select-none pb-12">
                {/* 1. Dynamic Statistics Card */}
                <div className="bg-white border border-gray-100/80 rounded-3xl p-5 shadow-sm flex items-center justify-between">
                    {/* Total Laporan stats */}
                    <div className="flex-1 text-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            Total Laporan
                        </span>
                        <p className="text-3xl font-black text-[#1E7D38] mt-1">
                            {totalReportsCount}
                        </p>
                    </div>

                    {/* Vertical divider */}
                    <div className="h-10 w-[1px] bg-gray-100" />

                    {/* Koin Terkumpul stats */}
                    <div className="flex-1 text-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            Koin Terkumpul
                        </span>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                            {/* Pink currency coin badge */}
                            <div className="w-5 h-5 rounded-full bg-[#E31E53] text-white flex items-center justify-center text-[11px] font-black shadow-sm">
                                S
                            </div>
                            <p className="text-2xl font-black text-gray-805">
                                {totalCoinsBalance.toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Search Input box */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari voucher atau mitra..."
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-semibold text-gray-805 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                    />
                    {/* Magnifying search icon */}
                    <svg
                        className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 fill-current"
                        viewBox="0 0 24 24"
                    >
                        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                    </svg>
                </div>

                {/* 3. Status Filters (Pill Tabs list) */}
                <div className="flex gap-2 select-none overflow-x-auto no-scrollbar py-0.5">
                    <button
                        onClick={() => setActiveFilter("semua")}
                        className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-200 ${
                            activeFilter === "semua"
                                ? "bg-[#1E7D38] text-white shadow-sm"
                                : "bg-[#EFEFEA] text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        Semua
                    </button>

                    <button
                        onClick={() => setActiveFilter("proses")}
                        className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-200 ${
                            activeFilter === "proses"
                                ? "bg-[#1E7D38] text-white shadow-sm"
                                : "bg-[#EFEFEA] text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        Proses
                    </button>

                    <button
                        onClick={() => setActiveFilter("selesai")}
                        className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-200 ${
                            activeFilter === "selesai"
                                ? "bg-[#1E7D38] text-white shadow-sm"
                                : "bg-[#EFEFEA] text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        Selesai
                    </button>

                    <button
                        onClick={() => setActiveFilter("perlu_diperiksa")}
                        className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-200 whitespace-nowrap ${
                            activeFilter === "perlu_diperiksa"
                                ? "bg-[#1E7D38] text-white shadow-sm"
                                : "bg-[#EFEFEA] text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        Perlu Diperiksa
                    </button>
                </div>

                {/* 4. Filtered list cards */}
                <div className="space-y-3.5">
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-10 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-gray-55 text-gray-400 flex items-center justify-center mx-auto shadow-sm mb-3">
                                <svg
                                    className="w-6 h-6 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                </svg>
                            </div>
                            <h4 className="text-sm font-black text-gray-800">
                                Laporan Tidak Ditemukan
                            </h4>
                            <p className="text-[11px] text-gray-400 font-semibold max-w-[220px] mx-auto mt-1 leading-relaxed">
                                Tidak ada riwayat laporan yang cocok dengan
                                filter atau kata kunci pencarian saat ini.
                            </p>
                        </div>
                    ) : (
                        filteredReports.map((item) => {
                            const landmarkName = item.city;
                            const formattedDate = new Date(
                                item.createdAt,
                            ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            });

                            // Status styling resolver
                            let statusLabel = item.status;
                            let badgeStyle = "";
                            let detailNode = null;

                            if (item.status === "SELESAI") {
                                statusLabel = "SELESAI";
                                badgeStyle =
                                    "bg-[#EAF5EC] text-[#287A38] border border-[#d2ebd7]";
                                const points =
                                    item.transaksi_koin?.[0]?.jumlah ?? 50;
                                detailNode = (
                                    <span className="text-xs font-black text-[#287A38]">
                                        +{points} Poin
                                    </span>
                                );
                            } else if (
                                item.status === "DIPROSES" ||
                                item.status === "PENDING" ||
                                item.status === "PROSES"
                            ) {
                                statusLabel = "PROSES";
                                badgeStyle =
                                    "bg-[#FCEEF2] text-[#C23C5E] border border-[#f9d6df]";
                                detailNode = (
                                    <span className="text-xs text-gray-500 font-semibold">
                                        Menunggu Verifikasi
                                    </span>
                                );
                            } else {
                                // PERLU_DIPERIKSA
                                statusLabel = "PERLU DIPERIKSA";
                                badgeStyle =
                                    "bg-[#FFF0E6] text-[#C55D2D] border border-[#ffdfcc]";
                                detailNode = (
                                    <span className="text-xs text-[#C55D2D] font-black">
                                        Butuh Detail Foto
                                    </span>
                                );
                            }

                            return (
                                <div
                                    key={item.id}
                                    onClick={() =>
                                        router.push(
                                            `/user/history/report/${item.id}`,
                                        )
                                    }
                                    className="bg-white border border-gray-100 rounded-3xl p-4.5 shadow-sm flex gap-4 items-center justify-between cursor-pointer hover:border-gray-200 transition-all duration-200"
                                >
                                    {/* Left: image & content */}
                                    <div className="flex gap-4 items-center min-w-0 flex-1">
                                        {/* Image frame wrapper */}
                                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#EBEFFB] border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                                            {item.foto?.[0]?.url ? (
                                                <Image
                                                    src={item.foto[0].url}
                                                    alt="Laporan Sampah"
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            ) : (
                                                // Blue picture icon placeholder
                                                <svg
                                                    className="w-6 h-6 text-indigo-500 fill-current"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Middle details */}
                                        <div className="flex-1 min-w-0 pr-1 space-y-1">
                                            <div className="flex items-center gap-2.5">
                                                <h4 className="text-sm font-black text-gray-805 truncate">
                                                    {landmarkName}
                                                </h4>
                                                <span
                                                    className={`text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider select-none ${badgeStyle}`}
                                                >
                                                    {statusLabel}
                                                </span>
                                            </div>

                                            {/* Time stamp */}
                                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                                {formattedDate}
                                            </p>

                                            {/* Bottom detail text */}
                                            <div className="pt-0.5">
                                                {detailNode}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Chevron arrow */}
                                    <div className="text-gray-300 flex-shrink-0 pr-1">
                                        <svg
                                            className="w-5 h-5 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
}
