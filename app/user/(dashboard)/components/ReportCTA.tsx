import React from "react";

interface ReportCTAProps {
  onReportClick?: () => void;
}

export const ReportCTA: React.FC<ReportCTAProps> = ({ onReportClick }) => {
  return (
    <div className="px-4 mb-5">
      <button
        onClick={onReportClick}
        className="w-full flex items-center justify-between bg-[#287A38] hover:bg-[#20632d] text-white p-4 rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.99] text-left"
      >
        <div className="flex items-center gap-3">
          {/* Circular/Rounded icon container */}
          <div className="flex items-center justify-center bg-white/10 rounded-xl p-2.5">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">
              Laporkan Sampah Sekarang
            </h3>
            <p className="text-xs text-emerald-100 opacity-90 mt-0.5 font-light">
              Ambil foto &amp; bersihkan lingkungan
            </p>
          </div>
        </div>
        <div>
          <svg
            className="w-5 h-5 text-emerald-100 opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  );
};
