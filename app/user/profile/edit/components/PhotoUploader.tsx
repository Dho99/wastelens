import React from "react";

interface PhotoUploaderProps {
  imageUrl: string;
  onUploadClick?: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  imageUrl,
  onUploadClick,
}) => {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-2 pb-6 select-none">
      
      {/* Circle Photo Frame */}
      <div className="relative w-28 h-28 mb-3.5">
        <div className="w-full h-full rounded-full border border-gray-150 p-1 flex items-center justify-center bg-gray-50 shadow-inner overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Profile Avatar Uploader"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Small Green Camera Overlay button */}
        <button
          onClick={onUploadClick}
          className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#1E7D38] border border-white text-white flex items-center justify-center shadow-md hover:bg-[#165D29] active:scale-90 transition-all duration-200"
          aria-label="Upload profile photo"
        >
          {/* MDI camera */}
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
            <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,8A4,4 0 1,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 1,0 14,12A2,2 0 0,0 12,10Z" />
          </svg>
        </button>
      </div>

      {/* Description text */}
      <p className="text-[10px] text-gray-400 font-extrabold tracking-wide">
        Klik untuk memperbarui foto profil Anda
      </p>

    </div>
  );
};
