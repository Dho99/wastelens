import React from "react";
import { HistoryReport } from "../services/historyService";

interface HistoryListProps {
    reports: HistoryReport[];
    onReportClick?: (reportId: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
    reports,
    onReportClick,
}) => {
    if (reports.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                Belum ada riwayat laporan untuk kategori ini.
            </div>
        );
    }

    return (
        <div className="px-4 space-y-3">
            {reports.map((report) => {
                // Status Badge Style
                let badgeBg = "bg-gray-100 text-gray-600";
                let badgeLabel = report.status;
                if (report.status === "SELESAI") {
                    badgeBg = "bg-[#EBF7EE] text-[#248A3D]";
                    badgeLabel = "SELESAI";
                } else if (report.status === "PROSES") {
                    badgeBg = "bg-[#FCEAE8] text-[#C53C2D]";
                    badgeLabel = "PROSES";
                } else if (report.status === "PERLU_DIPERIKSA") {
                    badgeBg = "bg-[#FDF3EA] text-[#A05C2C]";
                    badgeLabel = "PERLU_DIPERIKSA";
                }

                return (
                    <div
                        key={report.id}
                        onClick={() => onReportClick?.(report.id)}
                        className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            {/* Image Placeholder with MDI Image icon */}
                            <div className="w-16 h-16 rounded-2xl bg-[#E6E8FC] flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-5 h-5 text-[#5F65E8]"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                                </svg>
                            </div>

                            {/* Text details */}
                            <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h3 className="font-extrabold text-sm text-gray-900 truncate">
                                        {report.location}
                                    </h3>
                                    <span
                                        className={`inline-block text-[8px] font-black px-2 py-0.5 rounded tracking-wide ${badgeBg}`}
                                    >
                                        {badgeLabel}
                                    </span>
                                </div>

                                {/* Date & Time with MDI Clock icon */}
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mb-1">
                                    <svg
                                        className="w-3.5 h-3.5"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                                    </svg>
                                    <span>
                                        {report.date}, {report.time}
                                    </span>
                                </div>

                                {/* Reward/Status Message */}
                                {report.status === "SELESAI" &&
                                    report.points && (
                                        <p className="text-xs font-black text-[#1E7D38]">
                                            +{report.points} Poin
                                        </p>
                                    )}
                                {report.status === "PROSES" &&
                                    report.message && (
                                        <p className="text-xs font-mono text-gray-500 tracking-tight">
                                            {report.message}
                                        </p>
                                    )}
                                {report.status === "PERLU_DIPERIKSA" &&
                                    report.message && (
                                        <p className="text-xs font-semibold text-[#A05C2C]">
                                            {report.message}
                                        </p>
                                    )}
                            </div>
                        </div>

                        {/* MDI Chevron Right */}
                        <div className="text-gray-300">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                            </svg>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
