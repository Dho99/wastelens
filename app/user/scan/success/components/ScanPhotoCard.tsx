import React from "react";

interface ScanPhotoCardProps {
    imageUrl: string;
    locationName: string;
}

export const ScanPhotoCard: React.FC<ScanPhotoCardProps> = ({
    imageUrl,
    locationName,
}) => {
    return (
        <div className="px-4 mb-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt="Foto hasil scan"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute top-3 left-3 bg-[#287A38]/90 backdrop-blur-sm text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
                        <svg
                            className="w-3.5 h-3.5 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M4 4h3l2-3h6l2 3h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                        </svg>
                        <span>Foto Asli</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-[2px] rounded-full py-1 px-3 flex items-center gap-1.5 shadow-sm border border-white/10 select-none">
                        {/* MDI map-marker-outline */}
                        <svg
                            className="w-3.5 h-3.5 text-white fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
                        </svg>
                        <span className="text-[10px] font-black text-white tracking-wide">
                            {locationName}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
