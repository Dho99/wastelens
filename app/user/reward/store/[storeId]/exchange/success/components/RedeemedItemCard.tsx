import { Package } from "lucide-react";
import Image from "next/image";
import React from "react";

interface RedeemedItemCardProps {
    itemName: string;
    itemPrice: number;
    imageUrl: string;
}

export const RedeemedItemCard: React.FC<RedeemedItemCardProps> = ({
    itemName,
    itemPrice,
    imageUrl,
}) => {
    return (
        <div className="px-4 mb-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-3.5 shadow-sm flex items-center gap-4">
                {/* Left Image */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 relative">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={itemName}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-300" />
                        </div>
                    )}
                </div>

                {/* Right Info */}
                <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-[#31708F] tracking-wider uppercase">
                        REDEEMED ITEM
                    </span>
                    <h3 className="text-sm font-black text-gray-800 tracking-tight leading-none">
                        {itemName}
                    </h3>

                    <div className="flex items-center gap-1 mt-1">
                        {/* Green coin circle icon */}
                        <div className="w-4 h-4 rounded-full bg-[#248A3D] text-white flex items-center justify-center font-black text-[8.5px] pb-[0.5px]">
                            $
                        </div>
                        <span className="text-xs font-black text-[#287A38]">
                            {itemPrice} Koin
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
