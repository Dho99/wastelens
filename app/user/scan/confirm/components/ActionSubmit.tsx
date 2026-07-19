import React, { useState } from "react";

interface ActionSubmitProps {
  rewardPoints: number;
  onSubmit: () => void;
  onEdit: () => void;
  submitting?: boolean;
}

export const ActionSubmit: React.FC<ActionSubmitProps> = ({
  rewardPoints,
  onSubmit,
  onEdit,
  submitting = false,
}) => {
  const [declared, setDeclared] = useState(false);

  return (
    <div className="px-4 mb-6">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-5">
        
        {/* Declaration Checkbox */}
        <label className="flex gap-3 items-start cursor-pointer select-none">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            className="w-5 h-5 accent-[#287A38] rounded-md border-gray-300 focus:ring-emerald-500 mt-0.5 cursor-pointer flex-shrink-0"
          />
          <span className="text-xs text-gray-500 font-semibold leading-relaxed">
            Saya menyatakan bahwa laporan ini benar dan akurat sesuai dengan kondisi di lapangan.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Kirim Laporan Button */}
          <button
            onClick={onSubmit}
            disabled={!declared || submitting}
            className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all duration-250 active:scale-95 shadow-sm flex items-center justify-center gap-2 ${
              declared && !submitting
                ? "bg-[#287A38] hover:bg-[#20632d] text-white shadow-emerald-700/10"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Mengirim Laporan...</span>
              </>
            ) : (
              "Kirim Laporan"
            )}
          </button>

          {/* Edit Data Button */}
          <button
            onClick={onEdit}
            className="w-full border border-gray-200 hover:bg-gray-50/50 active:scale-95 text-gray-600 font-black text-xs py-3.5 rounded-2xl transition-all duration-200"
          >
            Edit Data
          </button>
        </div>

        {/* Orange Warning Reward Tag */}
        <div className="bg-[#FFF0E6] border border-[#ffdfcc] text-[#C55D2D] rounded-2xl py-3.5 px-4 flex items-center gap-3">
          {/* MDI Gift Icon */}
          <svg className="w-5 h-5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
            <path d="M17,10V21H7V10H17M12,4.88c0.75,0 1.38,0.61 1.38,1.37a1.37,1.37 0 0,1 -1.38,1.38C11.25,7.63 10.63,7 10.63,6.25c0-.76.62-1.37 1.37-1.37M20,10v1.5a1.5,1.5 0 0,1 -1.5,1.5h-13A1.5,1.5 0 0,1 4,11.5V10c0-.83.67-1.5 1.5-1.5h13a1.5,1.5 0 0,1 1.5,1.5Z" />
          </svg>
          <span className="text-[10px] font-black leading-none">
            Selesaikan laporan ini untuk mendapatkan +{rewardPoints} Poin
          </span>
        </div>

      </div>
    </div>
  );
};
