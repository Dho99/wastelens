import React, { useState, useEffect } from "react";

interface QrCodeCardProps {
  merchantName: string;
  initialSeconds: number;
}

export const QrCodeCard: React.FC<QrCodeCardProps> = ({
  merchantName,
  initialSeconds,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : initialSeconds));
    }, 1000);
    return () => clearInterval(timer);
  }, [initialSeconds]);

  // Format MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = (seconds / initialSeconds) * 100;

  return (
    <div className="px-4 mb-5 flex flex-col items-center select-none">
      
      {/* 1. Header Labels */}
      <h2 className="text-[15px] font-black text-gray-900 text-center tracking-tight leading-snug max-w-[280px]">
        Tunjukkan kode ini ke kasir {merchantName}
      </h2>
      <p className="text-xs text-gray-400 font-semibold text-center mt-1 mb-6">
        Berlaku untuk penukaran barang pilihan Anda
      </p>

      {/* 2. QR White Container box */}
      <div className="bg-white border border-gray-100 rounded-[36px] p-6 shadow-sm flex flex-col items-center justify-center w-full max-w-[340px] relative">
        
        {/* QR Code Branded SVG representation */}
        <div className="w-64 h-64 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 p-5 flex flex-col items-center justify-center gap-3 mb-5">
          <svg className="w-48 h-48 text-[#287A38]" viewBox="0 0 100 100" fill="currentColor">
            {/* Outer corners square patterns */}
            <path d="M5,5 h25 v25 h-25 z M11,11 h13 v13 h-13 z" />
            <path d="M70,5 h25 v25 h-25 z M76,11 h13 v13 h-13 z" />
            <path d="M5,70 h25 v25 h-25 z M11,76 h13 v13 h-13 z" />
            
            {/* Mock QR-pixel data patterns */}
            <rect x="35" y="5" width="6" height="6" />
            <rect x="45" y="10" width="12" height="6" />
            <rect x="60" y="5" width="6" height="12" />
            <rect x="35" y="20" width="18" height="6" />
            <rect x="50" y="28" width="6" height="6" />
            
            <rect x="5" y="35" width="6" height="18" />
            <rect x="15" y="45" width="12" height="6" />
            <rect x="35" y="35" width="30" height="30" rx="3" fill="#E2ECE4" />
            <circle cx="50" cy="50" r="10" fill="#287A38" />
            <path d="M50,45 c-3,0 -4,3 -4,5 s1,5 4,5 s4,-3 4,-5 s-1,-5 -4,-5 z" fill="white" />
            
            <rect x="70" y="35" width="12" height="6" />
            <rect x="85" y="40" width="6" height="18" />
            <rect x="75" y="50" width="18" height="6" />
            
            <rect x="35" y="70" width="6" height="12" />
            <rect x="45" y="80" width="18" height="6" />
            <rect x="55" y="70" width="6" height="6" />
            <rect x="35" y="88" width="12" height="6" />
            
            <rect x="70" y="70" width="12" height="12" />
            <rect x="88" y="70" width="6" height="6" />
            <rect x="70" y="88" width="6" height="6" />
            <rect x="80" y="85" width="12" height="6" />
          </svg>
          <span className="text-[7.5px] font-black text-[#287A38] tracking-wider uppercase leading-none mt-1">
            SCAN FOR ECO-FRIENDLY LIVING
          </span>
          <span className="text-[5.5px] font-bold text-gray-400 tracking-widest uppercase leading-none -mt-1">
            🌱 WASTELENS SOLUTIONS
          </span>
        </div>

        {/* Ticking Clock Info */}
        <div className="flex items-center gap-1.5 mb-2.5">
          {/* MDI clock-outline */}
          <svg className="w-5 h-5 text-[#287A38] fill-current" viewBox="0 0 24 24">
            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
          </svg>
          <span className="text-xl font-extrabold text-[#287A38] tracking-tight">
            {formatTime(seconds)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[#287A38] transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Bottom indicator text */}
        <span className="text-[8.5px] font-black tracking-widest text-gray-400 leading-none mb-1">
          KODE DIPERBARUI OTOMATIS
        </span>

      </div>
    </div>
  );
};
