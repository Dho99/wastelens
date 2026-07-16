import React from "react";

interface ProfileAvatarProps {
  name: string;
  ecoRole: string;
  avatarUrl: string;
  onEditAvatar?: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  ecoRole,
  avatarUrl,
  onEditAvatar,
}) => {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-4 pb-6 select-none">
      
      {/* Circle Photo Container */}
      <div className="relative w-28 h-28 mb-5">
        <div className="w-full h-full rounded-full border border-gray-150 p-1 flex items-center justify-center bg-gray-50 shadow-inner overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Small Green Camera/Edit overlay button */}
        <button
          onClick={onEditAvatar}
          className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#1E7D38] border border-white text-white flex items-center justify-center shadow-md hover:bg-[#165D29] active:scale-90 transition-all duration-200"
          aria-label="Edit Profile Photo"
        >
          {/* MDI pencil / edit */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.07,6.19L3,17.25Z" />
          </svg>
        </button>
      </div>

      {/* User Name */}
      <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-2">
        {name}
      </h2>

      {/* Eco-Badge */}
      <div className="bg-[#EBF7EE] border border-[#d6ebd9] text-[#1E7D38] text-[9px] font-black px-3.5 py-1.5 rounded-full flex items-center gap-1 w-fit uppercase tracking-widest shadow-sm">
        {/* MDI shield-check-outline */}
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12,2.18L19,5.29V11C19,15.93 15.59,20.58 12,21.96C8.41,20.58 5,15.93 5,11V5.29L12,2.18M12,4L7,6.23V11C7,14.87 9.74,18.57 12,19.78C14.26,18.57 17,14.87 17,11V6.23L12,4Z" />
        </svg>
        <span>{ecoRole}</span>
      </div>

    </div>
  );
};
