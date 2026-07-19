import React from "react";

interface TransactionDetailsProps {
    itemName: string;
    transactionId: string;
    quantity: number;
    totalCoins: number;
    status: string;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    itemName,
    transactionId,
    quantity,
    totalCoins,
    status,
}) => {
    const statusLabel: Record<string, { text: string; color: string }> = {
        PENDING: { text: "Menunggu", color: "text-yellow-600" },
        COMPLETED: { text: "Selesai", color: "text-green-600" },
        CANCELLED: { text: "Dibatalkan", color: "text-red-600" },
        EXPIRED: { text: "Kadaluarsa", color: "text-gray-500" },
    };

    const st = statusLabel[status] ?? { text: status, color: "text-gray-500" };

    return (
        <div className="px-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 tracking-wide uppercase">
                        Item
                    </span>
                    <p className="text-xs font-black text-[#287A38] mt-1 truncate">
                        {itemName}
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 tracking-wide uppercase">
                        ID Transaksi
                    </span>
                    <p className="text-xs font-black text-gray-800 mt-1 truncate">
                        {transactionId}
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 tracking-wide uppercase">
                        Jumlah
                    </span>
                    <p className="text-xs font-black text-gray-800 mt-1">
                        {quantity} item
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 tracking-wide uppercase">
                        Total
                    </span>
                    <p className="text-xs font-black text-[#287A38] mt-1">
                        {totalCoins} Koin
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm col-span-2">
                    <span className="text-[10px] font-black text-gray-400 tracking-wide uppercase">
                        Status
                    </span>
                    <p className={`text-xs font-black mt-1 ${st.color}`}>
                        {st.text}
                    </p>
                </div>
            </div>
        </div>
    );
};
