import React from "react";

interface ReportIdCardProps {
  reportId: string;
  reportTime: string;
}

export const ReportIdCard: React.FC<ReportIdCardProps> = ({
  reportId,
  reportTime,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
        {/* Left icon wrapper */}
        <div className="w-11 h-11 rounded-2xl bg-[#E2ECE4] border border-[#d6ebd9] flex items-center justify-center text-[#1E7D38] shadow-sm flex-shrink-0">
          {/* MDI file-document-outline */}
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M6,20V4H13V9H18V20H6Z" />
          </svg>
        </div>

        {/* Info detail labels */}
        <div className="flex-1 flex justify-between items-center pr-1 min-w-0">
          <div className="flex flex-col gap-0.5 min-w-0 pr-2">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              REPORT ID
            </span>
            <p className="text-sm font-extrabold text-gray-800 truncate">
              {reportId}
            </p>
          </div>

          <div className="flex flex-col gap-0.5 text-right flex-shrink-0">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              WAKTU
            </span>
            <p className="text-sm font-extrabold text-gray-700">
              {reportTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
