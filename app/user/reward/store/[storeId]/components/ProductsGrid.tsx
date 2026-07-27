import { Package } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ProductItem } from "../services/storeDetailService";

interface ProductsGridProps {
  products: ProductItem[];
  onExchange: (productId: string) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  onExchange,
}) => {
  return (
    <div className="px-4 mb-6">
      {/* Header title */}
      <div className="flex items-center justify-between px-1 mb-4">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">
          Produk Tersedia
        </h3>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((prod) => {
          const outOfStock = prod.stock <= 0;
          const disabled = outOfStock || !prod.isActive;

          return (
            <div
              key={prod.id}
              className={`bg-white border rounded-[28px] p-3 flex flex-col justify-between shadow-sm ${
                disabled ? "border-gray-100 opacity-60" : "border-gray-100"
              }`}
            >
              {/* Image box */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                {prod.imageUrl ? (
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-0.5 mt-2 mb-3 px-0.5">
                <span className="text-[9px] font-black text-[#A05C2C] tracking-wider uppercase">
                  {prod.category}
                </span>
                <h4 className="text-xs font-black text-gray-800 tracking-tight truncate">
                  {prod.name}
                </h4>
                <span className="text-[9px] font-bold text-gray-400">
                  Stok: {prod.stock}
                </span>
              </div>

              {/* Price & Action row */}
              <div className="flex items-center justify-between px-0.5">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-800 leading-none">
                    {prod.coinsPrice}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 mt-0.5">
                    Koin
                  </span>
                </div>

                <button
                  onClick={() => onExchange(prod.id)}
                  disabled={disabled}
                  className="bg-[#287A38] hover:bg-[#20632d] active:scale-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-[10px] px-3.5 py-2 rounded-full transition-all"
                >
                  {outOfStock ? "Habis" : "Tukar"}
                </button>
              </div>
            </div>
          );
        })}

        {/* Segera Hadir placeholder */}
        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[28px] p-6 flex flex-col items-center justify-center min-h-[190px]">
          <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 shadow-sm mb-3">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.58C12.21,21.77 11.79,21.77 11.43,21.58L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.42C11.79,2.23 12.21,2.23 12.57,2.42L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5.3,7.7L12,11.25L18.7,7.7L12,4.15M19.75,9L12.75,12.7V20.2L19.75,16.5V9M4.25,9V16.5L11.25,20.2V12.7L4.25,9Z" />
            </svg>
          </div>
          <span className="text-[10px] font-extrabold text-gray-400 tracking-wide uppercase">
            Segera Hadir
          </span>
        </div>
      </div>
    </div>
  );
};
