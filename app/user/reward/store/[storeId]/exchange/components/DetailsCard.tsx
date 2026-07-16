import React from "react";

interface DetailsCardProps {
  userBalance: number;
  productPrice: number;
  merchantName: string;
  method: string;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({
  userBalance,
  productPrice,
  merchantName,
  method,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-gray-800 tracking-tight pb-1 border-b border-gray-100">
          Detail Penukaran
        </h3>

        {/* Balance Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Saldo Saat Ini</span>
          <span className="font-black text-[#287A38]">
            {userBalance.toLocaleString("id-ID")} Koin
          </span>
        </div>

        {/* Cost Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Harga Barang</span>
          <span className="font-black text-[#287A38]">
            {productPrice.toLocaleString("id-ID")} Koin
          </span>
        </div>

        {/* Thin Divider */}
        <div className="w-full h-[1px] bg-gray-100" />

        {/* Merchant Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Merchant</span>
          <span className="font-black text-gray-800">{merchantName}</span>
        </div>

        {/* Method Row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Metode</span>
          <div className="flex items-center gap-1.5 font-black text-gray-800">
            {/* MDI storefront-outline */}
            <svg className="w-4 h-4 text-gray-500 fill-current" viewBox="0 0 24 24">
              <path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z" />
            </svg>
            <span>{method}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
