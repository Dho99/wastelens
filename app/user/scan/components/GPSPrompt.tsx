import React from "react";

interface GPSPromptProps {
  onAllowLocation: () => void;
  onChooseManual: () => void;
  onBack: () => void;
  onHelp?: () => void;
}

export const GPSPrompt: React.FC<GPSPromptProps> = ({
  onAllowLocation,
  onChooseManual,
  onBack,
  onHelp,
}) => {
  return (
    <div className="absolute inset-0 z-40 w-full h-full flex flex-col justify-between bg-white overflow-hidden select-none">
      
      {/* 1. Header (WasteLens Navbar overlay) */}
      <header className="flex h-16 items-center justify-between px-5 bg-white border-b border-gray-100 z-50">
        <div className="flex items-center gap-3">
          {/* MDI arrow-left */}
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
            aria-label="Back"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11H7.83L13.41,5.41L12,4L4,12L12,20L13.41,18.59L7.83,13H20V11Z" />
            </svg>
          </button>
          <span className="text-xl font-extrabold text-[#1E7D38] tracking-tight">
            WasteLens
          </span>
        </div>

        {/* MDI help-circle-outline */}
        <button
          onClick={onHelp}
          className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
          aria-label="Help"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,20A8,8 0 1,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M12,5A3,3 0 0,1 15,8C15,9.24 13.9,10 13,10.75C12.3,11.3 12,12 12,13H10C10,11.5 11,10.6 11.85,10C12.5,9.5 13,9 13,8A1,1 0 0,0 12,7A1,1 0 0,0 11,8H9A3,3 0 0,1 12,5M11,16H13V18H11V16Z" />
          </svg>
        </button>
      </header>

      {/* 2. Map Background with Blur Overlay */}
      <div className="relative flex-1 w-full bg-gray-50 flex items-center justify-center p-5">
        {/* Mock Map Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80"
          alt="Map Background"
          className="absolute inset-0 w-full h-full object-cover blur-[2px] opacity-40 select-none pointer-events-none"
        />

        {/* 3. Popup Location Modal Dialog */}
        <div className="relative w-full max-w-[340px] bg-[#FAF9F5] border border-gray-100 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col items-center text-center z-10">
          
          {/* Target Location Icon Box */}
          <div className="w-14 h-14 rounded-2xl bg-[#E2ECE4] border border-[#d6ebd9] flex items-center justify-center text-[#1E7D38] shadow-sm mb-5">
            {/* MDI crosshairs-gps */}
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-3">
            Aktifkan Lokasi
          </h2>

          {/* Description */}
          <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-5 px-1">
            Lokasi digunakan untuk memastikan laporan dikirim kepada pihak yang tepat. Ini membantu tim kebersihan menemukan titik sampah dengan akurasi tinggi.
          </p>

          {/* Data Safety Pill Banner */}
          <div className="w-full bg-[#EFEFEA] border border-gray-200/50 rounded-2xl py-3 px-4 flex items-start gap-2.5 mb-6 text-left">
            {/* MDI shield-check-outline */}
            <svg className="w-5 h-5 text-[#287A38] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,15L17.5,8.5L16.08,7.08L11,12.17L8.92,10.08L7.5,11.5L11,15M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <span className="text-[10px] font-bold text-gray-500 leading-normal">
              Data lokasi kamu aman dan hanya digunakan untuk verifikasi.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            {/* Button 1: Allow location access */}
            <button
              onClick={onAllowLocation}
              className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-95 text-white font-black text-xs py-3.5 rounded-2xl shadow-sm transition-all duration-200"
            >
              Izinkan Akses Lokasi
            </button>

            {/* Button 2: Choose location manually */}
            <button
              onClick={onChooseManual}
              className="w-full bg-[#EFEFEA] hover:bg-[#e4e4dd] active:scale-95 text-gray-700 font-black text-xs py-3.5 rounded-2xl transition-all duration-200"
            >
              Pilih Lokasi Secara Manual
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
