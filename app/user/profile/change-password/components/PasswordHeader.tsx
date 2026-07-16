import React from "react";

interface PasswordHeaderProps {
  onBackClick: () => void;
}

export const PasswordHeader: React.FC<PasswordHeaderProps> = ({
  onBackClick,
}) => {
  return (
    <div className="flex items-center gap-3 px-5 pt-6 pb-4 bg-transparent select-none">
      {/* MDI arrow-left */}
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
        Ubah Kata Sandi
      </h1>
    </div>
  );
};
