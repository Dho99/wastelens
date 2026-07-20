import React from "react";

interface QrActionsProps {
  status: string;
  onGoHome: () => void;
  onCancel: () => void;
  onHelp: () => void;
  cancelling?: boolean;
}

export const QrActions: React.FC<QrActionsProps> = ({
  status,
  onGoHome,
  onCancel,
  onHelp,
  cancelling,
}) => {
  const isActive = status === "PENDING";

  return (
    <div className="px-4 space-y-4 pb-8 flex flex-col items-center">
      {isActive && (
        <button
          onClick={onCancel}
          disabled={cancelling}
          className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          {cancelling ? (
            <span>Membatalkan...</span>
          ) : (
            <>
              <span>Batalkan Penukaran</span>
              <svg className="w-4 h-4 fill-current text-red-200" viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </>
          )}
        </button>
      )}

      <button
        onClick={onGoHome}
        className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-[0.98] text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span>Kembali ke Beranda</span>
        <svg className="w-4 h-4 fill-current text-emerald-200" viewBox="0 0 24 24">
          <path d="M12,5.69L17,10.19V18H15V12H9V18H7V10.19L12,5.69M12,3L2,12H5V20H11V14H13V20H19V12H22L12,3Z" />
        </svg>
      </button>

      <button
        onClick={onHelp}
        className="text-xs font-black text-[#287A38] hover:text-[#20632d] hover:underline flex items-center gap-1.5 transition-all"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A3.75,3.75 0 0,0 8.25,9.75H9.75A2.25,2.25 0 0,1 12,7.5A2.25,2.25 0 0,1 14.25,9.75C14.25,11.25 12,11.25 12,13.5H13.5C13.5,11.63 15.75,11.25 15.75,9.75A3.75,3.75 0 0,0 12,6Z" />
        </svg>
        <span>Butuh Bantuan?</span>
      </button>
    </div>
  );
};
