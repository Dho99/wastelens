import React from "react";

interface TxDetailsCardProps {
  merchantName: string;
  timestamp: string;
  transactionId: string;
  onCopyId: () => void;
}

export const TxDetailsCard: React.FC<TxDetailsCardProps> = ({
  merchantName,
  timestamp,
  transactionId,
  onCopyId,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Merchant Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Merchant</span>
          <span className="font-black text-gray-800">{merchantName}</span>
        </div>

        {/* Waktu Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Waktu</span>
          <span className="font-black text-gray-700">{timestamp}</span>
        </div>

        {/* Transaction ID Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">ID Transaksi</span>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-gray-700">{transactionId}</span>
            {/* Copy button */}
            <button
              onClick={onCopyId}
              className="text-[#287A38] hover:text-[#20632d] active:scale-90 p-0.5 rounded transition-all"
              aria-label="Copy Transaction ID"
            >
              {/* MDI content-copy */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
