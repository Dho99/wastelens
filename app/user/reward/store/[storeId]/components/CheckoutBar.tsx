import React from "react";

interface CheckoutBarProps {
    totalItems: number;
    totalCoins: number;
    onCheckout: () => void;
}

export const CheckoutBar: React.FC<CheckoutBarProps> = ({
    totalItems,
    totalCoins,
    onCheckout,
}) => {
    if (totalItems === 0) return null;

    return (
        <div className="fixed inset-x-0 bottom-5 z-30 max-w-screen-sm mx-auto w-full px-4 pointer-events-none mb-3">
            <div className="bg-[#287A38] rounded-3xl p-4 flex items-center justify-between shadow-lg pointer-events-auto border border-white/10 shadow-emerald-950/20">
                {/* Left shopping status info */}
                <div className="flex items-center gap-3.5 pl-1.5">
                    {/* Cart Icon in Circle */}
                    <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center shadow-sm">
                        {/* mdi-cart-outline */}
                        <svg
                            className="w-5.5 h-5.5 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M11,18C10.45,18 10,18.45 10,19C10,19.55 10.45,20 11,20C11.55,20 12,19.55 12,19C12,18.45 11.55,18 11,18M2,2H5.27L6.62,4.86L18.88,4.86C19.78,4.86 20.5,5.5 20.5,6.37C20.5,6.67 20.4,6.96 20.25,7.21L16.73,13.62C16.36,14.3 15.65,14.73 14.88,14.73H8.1L7.02,16.7L7,16.89C7,17.17 7.22,17.39 7.5,17.39H19V19.39H7.5C6.12,19.39 5,18.27 5,16.89C5,16.4 5.12,15.94 5.33,15.54L6.75,12.96L3,5H2V2M17,18C16.45,18 16,18.45 16,19C16,19.55 16.45,20 17,20C17.55,20 18,19.55 18,19C18,18.45 17.55,18 17,18Z" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-white leading-none">
                            {totalItems} Produk
                        </span>
                        <span className="text-[11px] font-bold text-emerald-200">
                            {totalCoins.toLocaleString("id-ID")} Koin
                        </span>
                    </div>
                </div>

                {/* Right checkout action button */}
                <button
                    onClick={onCheckout}
                    className="bg-white hover:bg-gray-50 active:scale-95 text-[#287A38] font-black text-xs px-6 py-3 rounded-2xl shadow-sm transition-all duration-200"
                >
                    Tukar Sekarang
                </button>
            </div>
        </div>
    );
};
