import React from "react";

interface SuccessHeaderProps {
  onBackClick: () => void;
}

export const SuccessHeader: React.FC<SuccessHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="px-5 pt-6 pb-4 bg-transparent">
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
    </div>
  );
};
