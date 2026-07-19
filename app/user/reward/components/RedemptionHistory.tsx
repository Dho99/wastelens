import React from "react";
import { RedemptionRecord } from "../services/rewardService";

interface RedemptionHistoryProps {
  history: RedemptionRecord[];
  onViewAll?: () => void;
}

export const RedemptionHistory: React.FC<RedemptionHistoryProps> = ({
  history,
  onViewAll,
}) => {
  return (
    <div className="px-5 mb-6">
      {/* Header section */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">
          Riwayat Penukaran Terbaru
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#1E7D38] hover:text-[#165D29] hover:underline transition-all"
        >
          Lihat Semua
        </button>
      </div>

      {/* History cards list */}
      <div className="space-y-3">
        {history.map((record) => {
          let statusBg = "bg-gray-100 text-gray-500";
          if (record.status === "BERHASIL") {
            statusBg = "bg-[#EBF7EE] text-[#248A3D]";
          } else if (record.status === "PROSES") {
            statusBg = "bg-[#FFF0E6] text-[#C55D2D]";
          } else if (record.status === "GAGAL") {
            statusBg = "bg-[#FCEAE8] text-[#C53C2D]";
          }

          return (
            <div
              key={record.id}
              className="bg-white border border-gray-100/80 rounded-3xl p-3.5 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Product Thumbnail */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={record.imageUrl}
                    alt={record.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                  <h4 className="text-xs font-black text-gray-800 truncate">
                    {record.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold">
                    {record.dateText}
                  </p>
                </div>
              </div>

              {/* Status Badge & Coins Spent */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span
                  className={`inline-block text-[8px] font-black px-2 py-0.5 rounded-full tracking-wide uppercase ${statusBg}`}
                >
                  {record.status}
                </span>
                
                {/* Coins spent info */}
                <div className="flex items-center gap-1">
                  {/* Green coin circle icon */}
                  <div className="w-4.5 h-4.5 rounded-full bg-[#248A3D] text-white flex items-center justify-center font-black text-[9px] shadow-sm leading-none pb-[1px]">
                    $
                  </div>
                  <span className="text-xs font-black text-gray-800">
                    {record.coinsSpent.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
