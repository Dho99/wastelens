import React from "react";

export const HeaderText: React.FC = () => {
  return (
    <div className="px-6 py-6 text-center">
      <h2 className="text-lg font-black text-gray-900 leading-snug tracking-tight mb-2 max-w-[300px] mx-auto">
        WasteLens sedang memeriksa foto dan lokasi laporanmu.
      </h2>
      <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-[320px] mx-auto mb-4">
        Kecerdasan buatan kami sedang melakukan verifikasi data untuk memastikan laporanmu valid dan akurat.
      </p>

      {/* Triple Dot Loader */}
      <div className="flex items-center justify-center gap-1.5 py-1">
        <span className="w-2.5 h-2.5 rounded-full bg-[#287A38] animate-[bounce_1s_infinite_100ms]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#287A38] animate-[bounce_1s_infinite_200ms]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#287A38] animate-[bounce_1s_infinite_300ms]" />
      </div>
    </div>
  );
};
