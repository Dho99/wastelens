import React from "react";

interface ProfileHeaderProps {
  onSettingsClick?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onSettingsClick,
}) => {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-transparent select-none">
      <h1 className="text-xl font-black text-[#1E7D38] tracking-tight">
        Profil Saya
      </h1>

      {/* Settings cog button */}
      <button
        onClick={onSettingsClick}
        className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-emerald-50 rounded-full transition-all duration-200"
        aria-label="Settings"
      >
        {/* MDI cog-outline */}
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.47,5.34 14.86,5.08L14.48,2.42C14.44,2.2 14.25,2 14,2H10C9.75,2 9.56,2.2 9.52,2.42L9.14,5.08C8.53,5.34 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.95C7.96,18.34 8.53,18.66 9.14,18.92L9.52,21.58C9.56,21.8 9.75,22 10,22H14C14.25,22 14.44,21.8 14.48,21.58L14.86,18.92C15.47,18.66 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
      </button>
    </div>
  );
};
