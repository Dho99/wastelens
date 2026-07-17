import React from "react";

interface InsufficientCoinsProps {
  neededCoins: number;
  onRetryScan: () => void;
  onBack: () => void;
}

export const InsufficientCoins: React.FC<InsufficientCoinsProps> = ({
  neededCoins,
  onRetryScan,
  onBack,
}) => {
  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32 flex flex-col justify-between select-none">
      
      {/* 1. Header (Navbar back arrow) */}
      <div>
        <div className="px-5 pt-6 pb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
            aria-label="Back"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11H7.83L13.41,5.41L12,4L4,12L12,20L13.41,18.59L7.83,13H20V11Z" />
            </svg>
          </button>
        </div>

        {/* 2. Error Orange Alert Banner */}
        <div className="px-4 mb-6">
          <div className="bg-[#FFF3E0] border border-[#ffe0b2] rounded-2xl p-4 flex gap-3.5 items-start shadow-sm">
            {/* Orange warning triangle icon */}
            <div className="text-[#E65100] flex-shrink-0 mt-0.5">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12,2L1,21H23L12,2M13,16H11V14H13V16M13,12H11V8H13V12Z" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xs font-black text-[#E65100] tracking-tight">
                Saldo koin Anda tidak cukup
              </h3>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Anda membutuhkan <span className="font-extrabold text-[#E65100]">{neededCoins} koin lagi</span> untuk menukarkan voucher ini.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Cara Cepat Kumpulkan Koin list */}
        <div className="px-5">
          <h3 className="text-sm font-extrabold text-gray-900 tracking-wide mb-3 px-1">
            Cara Cepat Kumpulkan Koin:
          </h3>

          <div className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5 flex-grow min-w-0">
              {/* Light Green Scanner Icon wrapper */}
              <div className="w-11 h-11 rounded-2xl bg-[#E2ECE4] border border-[#d6ebd9] flex items-center justify-center text-[#1E7D38] shadow-sm flex-shrink-0">
                {/* MDI qrcode-scan */}
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M4,4H10V10H4V4M20,4H14V10H20V4M14,20H20V14H14V20M4,20H10V14H4V20M6,6H8V8H6V6M16,6H18V8H16V6M16,16H18V18H16V16M6,16H8V18H6V16M2,2H11V11H2V2M22,2H13V11H22V2M22,22H13V13H22V22M2,22H11V13H2V22Z" />
                </svg>
              </div>

              {/* Details labels */}
              <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                <h4 className="text-xs font-black text-gray-800">Scan Sampah</h4>
                <p className="text-[10px] text-gray-400 font-semibold truncate">
                  Identifikasi &amp; pilah sampah
                </p>
              </div>
            </div>

            {/* Reward Pill Tag */}
            <span className="bg-[#287A38] text-white text-[10px] font-black px-3.5 py-2 rounded-full flex-shrink-0 shadow-sm shadow-emerald-700/10">
              +50 Koin
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Checkout Action footer */}
      <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 flex flex-col gap-3 shadow-lg items-center">
        {/* Button 1: Kumpulkan Poin */}
        <button
          onClick={onRetryScan}
          className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-95 text-white font-black text-xs py-4 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          {/* MDI shield-check-outline */}
          <svg className="w-4 h-4 fill-current text-emerald-200" viewBox="0 0 24 24">
            <path d="M11,15L17.5,8.5L16.08,7.08L11,12.17L8.92,10.08L7.5,11.5L11,15M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
          <span>Kumpulkan Poin</span>
        </button>

        {/* Button 2: Cari Sampah Lagi */}
        <button
          onClick={onRetryScan}
          className="text-xs font-black text-[#287A38] hover:text-[#20632d] hover:underline py-1 transition-all"
        >
          Cari Sampah Lagi
        </button>
      </div>

    </div>
  );
};
