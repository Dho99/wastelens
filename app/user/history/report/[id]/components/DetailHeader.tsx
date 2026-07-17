import React from "react";

interface DetailHeaderProps {
  onBackClick: () => void;
  onShareClick?: () => void;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  onBackClick,
  onShareClick,
}) => {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-transparent">
      <button
        onClick={onBackClick}
        className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
        aria-label="Back"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,11H7.83L13.41,5.41L12,4L4,12L12,20L13.41,18.59L7.83,13H20V11Z" />
        </svg>
      </button>

      <h1 className="text-xl font-black text-[#1E7D38] tracking-tight">
        Detail Laporan
      </h1>

      <button
        onClick={onShareClick}
        className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
        aria-label="Share"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.13,18.77 15.13,19A3,3 0 0,0 18.13,22A3,3 0 0,0 21.13,19A3,3 0 0,0 18.13,16.08Z" />
        </svg>
      </button>
    </div>
  );
};
