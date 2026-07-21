import React from "react";

interface OtherInfoCardProps {
  storeLocation: string;
  validUntil: string;
}

export const OtherInfoCard: React.FC<OtherInfoCardProps> = ({
  storeLocation,
  validUntil,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-gray-800 tracking-tight pb-1 border-b border-gray-100">
          Informasi Lainnya
        </h3>

        {/* Store Location */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Lokasi Toko</span>
          <span className="font-black text-gray-800">{storeLocation}</span>
        </div>

        {/* Valid Until */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-400">Masa Berlaku</span>
          <span className="font-black text-gray-850">{validUntil}</span>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-100" />

        {/* Notice Info Row */}
        <div className="flex gap-3 items-start select-none">
          {/* MDI information-outline */}
          <div className="text-[#287A38] flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
          </div>
          <p className="text-[10px] font-bold text-gray-500 leading-relaxed text-left">
            Tunjukkan kode QR di halaman &apos;Kupon Saya&apos; kepada kasir untuk pengambilan barang.
          </p>
        </div>

      </div>
    </div>
  );
};
