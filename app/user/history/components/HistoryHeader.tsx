import React from "react";

interface HistoryHeaderProps {
  onSearchClick?: () => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ onSearchClick }) => {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-4">
      <h1 className="text-2xl font-black text-[#1E7D38] tracking-tight">
        Riwayat Laporan
      </h1>
      <button
        onClick={onSearchClick}
        className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-100/50 active:scale-95 rounded-full transition-all duration-200"
        aria-label="Search"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
        </svg>
      </button>
    </div>
  );
};
