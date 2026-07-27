import { Package } from "lucide-react";
import Image from "next/image";
import React from "react";

interface RedemptionCardProps {
  itemName: string;
  itemPrice: number;
  imageUrl: string;
  status: string;
  merchantName: string;
  timestampText: string;
  transactionId: string;
  onCopyId: () => void;
}

export const RedemptionCard: React.FC<RedemptionCardProps> = ({
  itemName,
  itemPrice,
  imageUrl,
  status,
  merchantName,
  timestampText,
  transactionId,
  onCopyId,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
        
        {/* Item Top Info */}
        <div className="flex gap-4 items-center">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
            {imageUrl ? (
              <Image src={imageUrl} alt={itemName} fill className="object-cover" sizes="64px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <h3 className="text-sm font-black text-gray-805 truncate">{itemName}</h3>
            <span className="text-xs font-black text-[#31708F]">
              {itemPrice.toLocaleString("id-ID")} Poin
            </span>
          </div>

          {/* Status Badge */}
          <span className="bg-[#E2F7F9] text-[#31708F] text-[10px] font-black px-3.5 py-1.5 rounded-full flex-shrink-0">
            {status}
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-100" />

        {/* Merchant Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Merchant</span>
          <span className="font-black text-gray-800">{merchantName}</span>
        </div>

        {/* Waktu Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Waktu</span>
          <span className="font-black text-gray-700">{timestampText}</span>
        </div>

        {/* ID Transaksi Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">ID Transaksi</span>
          <div className="flex items-center gap-1.5 font-black text-[#287A38]">
            <span>{transactionId}</span>
            <button
              onClick={onCopyId}
              className="text-gray-400 hover:text-gray-600 active:scale-90 p-0.5 rounded transition-all"
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
