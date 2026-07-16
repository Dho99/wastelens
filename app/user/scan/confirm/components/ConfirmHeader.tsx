import React from "react";

interface ConfirmHeaderProps {
  onBackClick: () => void;
  onHelpClick?: () => void;
}

export const ConfirmHeader: React.FC<ConfirmHeaderProps> = ({
  onBackClick,
  onHelpClick,
}) => {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-transparent">
      <div className="flex items-center gap-3">
        <button
          onClick={onBackClick}
          className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
          aria-label="Back"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,11H7.83L13.41,5.41L12,4L4,12L12,20L13.41,18.59L7.83,13H20V11Z" />
          </svg>
        </button>
        <h1 className="text-lg font-black text-[#1E7D38] tracking-tight">
          Konfirmasi Laporan
        </h1>
      </div>

      <button
        onClick={onHelpClick}
        className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
        aria-label="Help info"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,20A8,8 0 1,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M12,5A3,3 0 0,1 15,8C15,9.24 13.9,10 13,10.75C12.3,11.3 12,12 12,13H10C10,11.5 11,10.6 11.85,10C12.5,9.5 13,9 13,8A1,1 0 0,0 12,7A1,1 0 0,0 11,8H9A3,3 0 0,1 12,5M11,16H13V18H11V16Z" />
        </svg>
      </button>
    </div>
  );
};
