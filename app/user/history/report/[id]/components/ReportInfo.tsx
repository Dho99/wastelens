import React from "react";

interface ReportInfoProps {
  reportCode: string;
  status: 'SELESAI' | 'PROSES' | 'PERLU_DIPERIKSA';
  statusUpdatedText: string;
}

export const ReportInfo: React.FC<ReportInfoProps> = ({
  reportCode,
  status,
  statusUpdatedText,
}) => {
  // Determine badge styling matching design
  let badgeStyles = "border border-gray-300 text-gray-500 bg-gray-50";
  let showCheck = false;

  if (status === "SELESAI") {
    badgeStyles = "border border-[#287A38] text-[#287A38] bg-[#EBF7EE]";
    showCheck = true;
  } else if (status === "PROSES") {
    badgeStyles = "border border-[#C53C2D] text-[#C53C2D] bg-[#FCEAE8]";
  } else if (status === "PERLU_DIPERIKSA") {
    badgeStyles = "border border-[#A05C2C] text-[#A05C2C] bg-[#FDF3EA]";
  }

  return (
    <div className="px-4 mb-5">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mb-0.5">
              ID LAPORAN
            </p>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {reportCode}
            </h2>
          </div>

          {/* Status Badge Pill */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${badgeStyles}`}
          >
            {showCheck && (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
            {status}
          </span>
        </div>

        {/* Status update note with MDI history icon */}
        <div className="flex items-start gap-2.5 text-xs text-gray-500 font-semibold leading-relaxed">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" />
          </svg>
          <span>{statusUpdatedText}</span>
        </div>
      </div>
    </div>
  );
};
