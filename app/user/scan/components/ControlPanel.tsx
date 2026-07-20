import React from "react";

interface ControlPanelProps {
    galleryThumbnailUrl?: string;
    onShutterClick: () => void;
    onGalleryClick?: () => void;
    onFlipCamera?: () => void;
    uploading?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    galleryThumbnailUrl,
    onShutterClick,
    onGalleryClick,
    onFlipCamera,
    uploading,
}) => {
    return (
        <div className="absolute bottom-16 left-0 right-0 z-20 flex items-center justify-between px-8 select-none">
            <div className="flex flex-col items-center gap-1.5 w-16">
                {/* <button
                    onClick={onGalleryClick}
                    className="w-12 h-12 rounded-xl overflow-hidden border border-white/40 shadow-md active:scale-90 transition-all duration-200 focus:outline-none"
                    aria-label="Open Gallery"
                >
                    {galleryThumbnailUrl ? (
                        <img
                            src={galleryThumbnailUrl}
                            alt="Gallery Thumbnail"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-black/40 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white/60 fill-current" viewBox="0 0 24 24">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                        </div>
                    )}
                </button>
                <span className="text-[9px] font-black text-white/90 tracking-widest text-center uppercase">
                    Galeri
                </span> */}
            </div>

            {/* 2. Double-Ring Shutter Button */}
            <button
                onClick={onShutterClick}
                disabled={uploading}
                className="relative w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center bg-transparent active:scale-90 transition-all duration-200 select-none shadow-lg focus:outline-none disabled:opacity-50 disabled:active:scale-100"
                aria-label="Capture photo"
            >
                {uploading ? (
                    <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                        <div className="w-6 h-6 border-3 border-[#287A38]/30 border-t-[#287A38] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="w-14 h-14 rounded-full bg-white shadow-inner" />
                )}
            </button>

            {/* 3. Flip Camera Button with MDI camera-switch-outline */}
            <button
                onClick={onFlipCamera}
                className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/45 active:scale-90 transition-all duration-200 shadow-md focus:outline-none"
                aria-label="Switch camera"
            >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M9 12c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3m10-8h-3.17L14 2H10L8.17 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 14H5V6h4.05l1.83-2h2.24l1.83 2H19v12m-7-9c-2.76 0-5 2.24-5 5h2c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3c-.76 0-1.44-.28-1.96-.74L8.62 15.68C9.5 16.5 10.69 17 12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                </svg>
            </button>
        </div>
    );
};
