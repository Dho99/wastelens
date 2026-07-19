import React from "react";

export const AlertBanner: React.FC = () => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-[#EBF7EE] border border-[#d3eed9] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
        {/* MDI check-circle */}
        <div className="text-[#248A3D] flex-shrink-0">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <span className="text-xs font-black text-gray-800 leading-normal">
          Saldo koin Anda mencukupi untuk penukaran ini
        </span>
      </div>
    </div>
  );
};
