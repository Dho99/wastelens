import React from "react";

export const SuccessBadge: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-12 pb-6">
      {/* Large check badge */}
      <div className="w-24 h-24 rounded-full bg-[#287A38] text-white flex items-center justify-center shadow-md animate-[pulse_2s_infinite] mb-6">
        <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>

      {/* Header labels */}
      <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
        Laporan berhasil dikirim
      </h1>
      <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-[280px]">
        Terima kasih. Kontribusimu membantu menjaga lingkungan tetap bersih.
      </p>
    </div>
  );
};
