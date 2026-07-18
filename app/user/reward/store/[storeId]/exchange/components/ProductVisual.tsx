import React from "react";

interface ProductVisualProps {
  productName: string;
  imageUrl: string;
  isAvailable: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  productName,
  imageUrl,
  isAvailable,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="relative aspect-square w-full rounded-[32px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover"
        />

        {/* Availability Badge */}
        {isAvailable && (
          <div className="absolute top-4 right-4 bg-[#BCE8F1]/80 backdrop-blur-sm text-[#31708F] text-[10px] font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
            {/* MDI check-circle-outline */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 1,1 20,12A8,8 0 0,1 12,20M16.59,7.58L10,14.17L7.41,11.59L6,13L10,17L18,9L16.59,7.58Z" />
            </svg>
            <span>Tersedia</span>
          </div>
        )}
      </div>
    </div>
  );
};
