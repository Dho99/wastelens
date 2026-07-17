import React from "react";

interface TransactionDetailsProps {
  itemName: string;
  transactionId: string;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  itemName,
  transactionId,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Item Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 tracking-wide uppercase">
            Item
          </span>
          <p className="text-xs font-black text-[#287A38] mt-1 truncate">
            {itemName}
          </p>
        </div>

        {/* Transaction ID */}
        <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 tracking-wide uppercase">
            ID Transaksi
          </span>
          <p className="text-xs font-black text-gray-800 mt-1 truncate">
            {transactionId}
          </p>
        </div>
      </div>
    </div>
  );
};
