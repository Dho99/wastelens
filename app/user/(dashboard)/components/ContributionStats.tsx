import React from "react";

interface ContributionStatsProps {
  sent: number;
  completed: number;
  processed: number;
  needsReview: number;
}

export const ContributionStats: React.FC<ContributionStatsProps> = ({
  sent,
  completed,
  processed,
  needsReview,
}) => {
  return (
    <div className="px-5 mb-6">
      <h2 className="text-sm font-extrabold text-gray-900 tracking-wide mb-3">
        Kontribusi Anda
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {/* Laporan Dikirim */}
        <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
          <div className="flex items-center justify-between">
            <span className="text-[#207235]">
              <svg
                className="w-5 h-5 fill-current transform rotate-45"
                viewBox="0 0 24 24"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </span>
            <span className="text-2xl font-black text-gray-900 leading-none">{sent}</span>
          </div>
          <p className="text-[11px] font-semibold text-gray-500 mt-2">
            Laporan dikirim
          </p>
        </div>

        {/* Laporan Selesai */}
        <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
          <div className="flex items-center justify-between">
            <span className="text-[#845E44]">
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </span>
            <span className="text-2xl font-black text-gray-900 leading-none">{completed}</span>
          </div>
          <p className="text-[11px] font-semibold text-gray-500 mt-2">
            Laporan selesai
          </p>
        </div>

        {/* Diproses */}
        <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
          <div className="flex items-center justify-between">
            <span className="text-[#B54A78]">
              <svg
                className="w-5 h-5 fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" />
              </svg>
            </span>
            <span className="text-2xl font-black text-gray-900 leading-none">{processed}</span>
          </div>
          <p className="text-[11px] font-semibold text-gray-500 mt-2">
            Diproses
          </p>
        </div>

        {/* Perlu Diperiksa */}
        <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[96px]">
          <div className="flex items-center justify-between">
            <span className="text-[#D32F2F]">
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </span>
            <span className="text-2xl font-black text-gray-900 leading-none">{needsReview}</span>
          </div>
          <p className="text-[11px] font-semibold text-gray-500 mt-2">
            Perlu diperiksa
          </p>
        </div>
      </div>
    </div>
  );
};
