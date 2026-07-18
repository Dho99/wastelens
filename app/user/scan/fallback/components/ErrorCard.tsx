import React from "react";

interface ErrorCardProps {
  onRetry: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ onRetry }) => {
  return (
    <div className="px-4 mb-6 pt-2">
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm flex flex-col items-center text-center">
        {/* Camera Warning Icon container */}
        <div className="relative w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100/50 flex items-center justify-center text-gray-400 mb-6 shadow-inner">
          {/* MDI camera outline */}
          <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
            <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H20V6H15.93L14.1,4H9.9L8.07,6H4M12,8A4,4 0 1,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 1,0 14,12A2,2 0 0,0 12,10Z" />
          </svg>

          {/* Red Warning Tag Overlay */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#E5F5EB] border border-[#d6ebd9] flex items-center justify-center text-[#D32F2F] shadow-sm">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12,2L1,21H23L12,2M13,16H11V14H13V16M13,12H11V8H13V12Z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-black text-gray-900 tracking-tight mb-3">
          Objek sampah belum terdeteksi
        </h2>

        {/* Description */}
        <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6 px-1.5">
          Ambil ulang foto dengan pencahayaan yang cukup dan pastikan sampah terlihat jelas. Hindari kamera yang goyang atau lensa yang kotor.
        </p>

        {/* Re-take Button with camera icon */}
        <button
          onClick={onRetry}
          className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-95 text-white font-black text-xs py-3.5 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          {/* MDI camera */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,8A4,4 0 1,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 1,0 14,12A2,2 0 0,0 12,10Z" />
          </svg>
          <span>Ambil Foto Lagi</span>
        </button>
      </div>
    </div>
  );
};
