import React from "react";

interface ScanHeaderProps {
  flashOn: boolean;
  onClose: () => void;
  onToggleFlash: () => void;
  onSettingsClick?: () => void;
}

export const ScanHeader: React.FC<ScanHeaderProps> = ({
  flashOn,
  onClose,
  onToggleFlash,
  onSettingsClick,
}) => {
  return (
    <div className="absolute top-6 left-0 right-0 z-30 flex items-center justify-between px-5">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all duration-200"
        aria-label="Close scanner"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </button>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Flash Toggle */}
        <button
          onClick={onToggleFlash}
          className={`w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center active:scale-95 transition-all duration-200 ${
            flashOn
              ? "bg-amber-400 text-amber-950 shadow-md shadow-amber-400/20"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
          aria-label="Toggle flash"
        >
          {flashOn ? (
            // mdi-flash
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M7,2v11h3v9l7-12h-4l4-8H7z" />
            </svg>
          ) : (
            // mdi-flash-off
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17,10H13L17,2H11.5L5.75,10.5L10.25,10H6L11.5,22L17,10M17,10L13,10L17,2M11.5,22L17,10L13,10" />
            </svg>
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onSettingsClick}
          className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all duration-200"
          aria-label="Settings"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.49,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.51,2.42L9.14,5.08C8.53,5.34 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.95C7.96,18.34 8.53,18.66 9.14,18.92L9.51,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.49,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
