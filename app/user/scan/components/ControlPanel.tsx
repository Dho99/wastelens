import React from "react";

interface ControlPanelProps {
  galleryThumbnailUrl: string;
  onShutterClick: () => void;
  onGalleryClick?: () => void;
  onFlipCamera?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  galleryThumbnailUrl,
  onShutterClick,
  onGalleryClick,
  onFlipCamera,
}) => {
  return (
    <div className="absolute bottom-24 left-0 right-0 z-20 flex items-center justify-around px-8">
      {/* Placeholder to keep shutter button centered */}
      <div className="w-12 h-12 flex-shrink-0" />

      {/* 2. Double-Ring Shutter Button */}
      <button
        onClick={onShutterClick}
        className="relative w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center bg-transparent active:scale-90 transition-all duration-200 select-none shadow-lg focus:outline-none"
        aria-label="Capture photo"
      >
        <div className="w-14 h-14 rounded-full bg-white shadow-inner" />
      </button>

      {/* 3. Flip Camera Button with MDI camera-switch-outline */}
      <button
        onClick={onFlipCamera}
        className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/45 active:scale-90 transition-all duration-200 shadow-md focus:outline-none"
        aria-label="Switch camera"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,8A4,4 0 1,0 16,12A4,4 0 0,0 12,8M12,14A2,2 0 1,1 14,12A2,2 0 0,1 12,14Z" />
        </svg>
      </button>
    </div>
  );
};
