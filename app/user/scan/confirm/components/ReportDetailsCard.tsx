import React from "react";

interface ReportDetailsCardProps {
  reportTime: string;
  aiClassification: string;
  aiAccuracy: number;
  wasteCategories: string[];
}

export const ReportDetailsCard: React.FC<ReportDetailsCardProps> = ({
  reportTime,
  aiClassification,
  aiAccuracy,
  wasteCategories,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Title & AI verification stamp */}
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-base font-black text-gray-800 tracking-tight">
            Detail Laporan
          </h3>
          <span className="bg-[#EBF7EE] text-[#287A38] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-[#d3eed9]">
            AI Terverifikasi
          </span>
        </div>

        {/* 1. Waktu Laporan */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-gray-100 flex items-center justify-center text-[#1E7D38] flex-shrink-0">
            {/* mdi-clock-outline */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              WAKTU LAPORAN
            </span>
            <p className="text-xs font-extrabold text-gray-700">{reportTime}</p>
          </div>
        </div>

        {/* 2. Analisis AI */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-gray-100 flex items-center justify-center text-[#1E7D38] flex-shrink-0">
            {/* mdi-brain */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19M13,10.75V7H11V10.75L7.96,12.5L8.96,14.23L12,12.5L15.04,14.23L16.04,12.5L13,10.75Z" />
            </svg>
          </div>
          <div className="flex-1 flex justify-between items-end min-w-0 pr-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
                ANALISIS AI
              </span>
              <p className="text-xs font-extrabold text-gray-700 truncate">{aiClassification}</p>
            </div>
            <span className="text-xs font-black text-[#287A38] whitespace-nowrap">
              {aiAccuracy}% Akurasi
            </span>
          </div>
        </div>

        {/* 3. Kategori Sampah */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-gray-100 flex items-center justify-center text-[#1E7D38] flex-shrink-0">
            {/* mdi-buffer */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12,2L1,7L12,12L23,7L12,2M1,12L12,17L23,12M1,17L12,22L23,17" />
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              KATEGORI SAMPAH
            </span>
            <div className="flex flex-wrap gap-2">
              {wasteCategories.map((cat) => (
                <span
                  key={cat}
                  className="bg-[#EFEFEA] text-gray-600 text-[10px] font-black px-3.5 py-1.5 rounded-full border border-gray-200/50"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
