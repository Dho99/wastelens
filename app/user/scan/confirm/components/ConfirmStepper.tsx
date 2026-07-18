import React from "react";

export const ConfirmStepper: React.FC = () => {
  return (
    <div className="px-5 mb-6">
      <div className="flex items-center justify-between max-w-[340px] mx-auto">
        {/* Step 1: Foto */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#287A38] text-white flex items-center justify-center shadow-sm z-10">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-[#287A38] mt-1.5">Foto</span>
        </div>

        {/* Line 1-2 */}
        <div className="flex-1 h-[2px] bg-[#287A38] -mt-5" />

        {/* Step 2: Lokasi */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#287A38] text-white flex items-center justify-center shadow-sm z-10">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-[#287A38] mt-1.5">Lokasi</span>
        </div>

        {/* Line 2-3 */}
        <div className="flex-1 h-[2px] bg-[#287A38] -mt-5" />

        {/* Step 3: Konfirmasi */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#287A38] text-white flex items-center justify-center shadow-md z-10 border-2 border-white">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12,17L17.5,11.5L16.08,10.08L12,14.17L9.92,12.08L8.5,13.5L12,17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-[#287A38] mt-1.5">Konfirmasi</span>
        </div>

        {/* Line 3-4 */}
        <div className="flex-1 h-[2px] bg-gray-200 -mt-5" />

        {/* Step 4: Selesai */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center z-10 border border-gray-200">
            {/* mdi-flag-outline */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.4,5H18V14H14.6L14.2,12H9V19H7V5H12.4M14,7H9V10H14.2L14.6,12H16V9H12.8L12.4,7Z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-gray-400 mt-1.5">Selesai</span>
        </div>
      </div>
    </div>
  );
};
