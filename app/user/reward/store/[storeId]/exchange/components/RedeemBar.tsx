import React from "react";

interface RedeemBarProps {
    quantity: number;
    maxQuantity: number;
    unitPrice: number;
    remainingCoins: number;
    onQuantityChange: (qty: number) => void;
    onRedeem: () => void;
    loading?: boolean;
}

export const RedeemBar: React.FC<RedeemBarProps> = ({
    quantity,
    maxQuantity,
    unitPrice,
    remainingCoins,
    onQuantityChange,
    onRedeem,
    loading,
}) => {
    const totalCost = quantity * unitPrice;
    const canRedeem = quantity > 0 && totalCost <= remainingCoins && !loading;

    return (
        <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 space-y-3.5 shadow-lg">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-gray-400">
                    Jumlah
                </span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() =>
                            onQuantityChange(Math.max(1, quantity - 1))
                        }
                        disabled={quantity <= 1}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-black text-sm transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19,13H5V11H19V13Z" />
                        </svg>
                    </button>
                    <span className="text-base font-black text-gray-800 min-w-[24px] text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={() =>
                            onQuantityChange(
                                Math.min(maxQuantity, quantity + 1),
                            )
                        }
                        disabled={
                            quantity >= maxQuantity ||
                            totalCost + unitPrice > remainingCoins
                        }
                        className="w-7 h-7 rounded-full bg-[#287A38] hover:bg-[#20632d] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-white font-black text-sm transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Total & Balance */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-gray-400">
                    Total
                </span>
                <span className="text-base font-black text-gray-850">
                    {totalCost} Koin
                </span>
            </div>
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-gray-400">
                    Sisa Saldo
                </span>
                <span className="text-sm font-black text-[#287A38]">
                    {remainingCoins - totalCost} Koin
                </span>
            </div>

            <button
                onClick={onRedeem}
                disabled={!canRedeem}
                className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-xs py-4 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
            >
                {loading ? (
                    <span>Memproses...</span>
                ) : (
                    <>
                        <span>Tukar Sekarang</span>
                        <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M4,11H16.17L11.58,6.41L13,5L20,12L13,19L11.58,17.59L16.17,13H4V11Z" />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
};
