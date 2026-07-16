import React, { useState } from "react";

interface SafetyOptionsListProps {
  lastPasswordChangeText: string;
  twoFactorEnabled: boolean;
  activeDevicesCount: number;
  onPasswordClick: () => void;
  onManageDevicesClick: () => void;
  onDeleteAccountClick: () => void;
}

export const SafetyOptionsList: React.FC<SafetyOptionsListProps> = ({
  lastPasswordChangeText,
  twoFactorEnabled,
  activeDevicesCount,
  onPasswordClick,
  onManageDevicesClick,
  onDeleteAccountClick,
}) => {
  const [twoFactor, setTwoFactor] = useState(twoFactorEnabled);

  return (
    <div className="space-y-5 px-4 mb-6">
      
      {/* SECTION 1: AKSES AKUN */}
      <div>
        <h3 className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2 px-1">
          AKSES AKUN
        </h3>
        <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm divide-y divide-gray-50">
          
          {/* Ubah Kata Sandi */}
          <div
            onClick={onPasswordClick}
            className="flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
          >
            <div className="flex items-center gap-3.5 pl-1">
              {/* Lock refresh icon container */}
              <div className="w-10 h-10 rounded-2xl bg-[#E2ECE4]/70 text-[#1E7D38] flex items-center justify-center shadow-sm flex-shrink-0">
                {/* MDI lock-reset / key-change */}
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12,17A2,2 0 0,0 14,15C14,14.21 13.54,13.53 12.88,13.19V10H11.12V13.19C10.46,13.53 10,14.21 10,15A2,2 0 0,0 12,17M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V18A2,2 0 0,0 6,20H18A2,2 0 0,0 20,18V10A2,2 0 0,0 18,8M8.9,6C8.9,4.29 10.29,2.9 12,2.9C13.71,2.9 15.1,4.29 15.1,6V8H8.9V6Z" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-gray-805">
                  Ubah Kata Sandi
                </span>
                <span className="text-[10px] text-gray-400 font-bold">
                  {lastPasswordChangeText}
                </span>
              </div>
            </div>
            
            <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </div>

          {/* Verifikasi Dua Langkah */}
          <div className="flex items-center justify-between py-3 px-2 select-none">
            <div className="flex items-center gap-3.5 pl-1">
              {/* Shield check icon container */}
              <div className="w-10 h-10 rounded-2xl bg-[#E2ECE4]/70 text-[#1E7D38] flex items-center justify-center shadow-sm flex-shrink-0">
                {/* MDI shield-check-outline */}
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12,2L19,5V11C19,16.2 15.6,21 12,22.2C8.4,21 5,16.2 5,11V5L12,2M12,4.2L7,6.3V11C7,15.1 9.8,19 12,20.1C14.2,19 17,15.1 17,11V6.3L12,4.2M11,15L7.5,11.5L8.9,10.1L11,12.2L15.1,8.1L16.5,9.5L11,15Z" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-gray-805">
                  Verifikasi Dua Langkah
                </span>
                <span className="text-[10px] text-gray-400 font-bold">
                  Amankan login dengan SMS/Email
                </span>
              </div>
            </div>

            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#287A38]"></div>
            </label>
          </div>

        </div>
      </div>

      {/* SECTION 2: PERANGKAT */}
      <div>
        <h3 className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2 px-1">
          PERANGKAT
        </h3>
        <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm">
          
          {/* Kelola Perangkat */}
          <div
            onClick={onManageDevicesClick}
            className="flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
          >
            <div className="flex items-center gap-3.5 pl-1">
              {/* Devices icon container */}
              <div className="w-10 h-10 rounded-2xl bg-[#E2ECE4]/70 text-[#1E7D38] flex items-center justify-center shadow-sm flex-shrink-0">
                {/* MDI devices */}
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M4,6H20V16H12V18H16V20H8V18H12V16H4V6M22,9H17A1,1 0 0,0 16,10V18A1,1 0 0,0 17,19H22A1,1 0 0,0 23,18V10A1,1 0 0,0 22,9M21,17H18V11H21V17Z" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-gray-805">
                  Kelola Perangkat
                </span>
                <span className="text-[10px] text-gray-400 font-bold">
                  {activeDevicesCount} perangkat aktif saat ini
                </span>
              </div>
            </div>

            <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </div>

        </div>
      </div>

      {/* SECTION 3: MANAJEMEN */}
      <div>
        <h3 className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2 px-1">
          MANAJEMEN
        </h3>
        <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm">
          
          {/* Hapus Akun */}
          <div
            onClick={onDeleteAccountClick}
            className="flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
          >
            <div className="flex items-center gap-3.5 pl-1">
              {/* Trash icon container in red/rose bg */}
              <div className="w-10 h-10 rounded-2xl bg-[#FCECE8] text-[#A83232] flex items-center justify-center shadow-sm flex-shrink-0">
                {/* MDI trash-can-outline */}
                <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-[#A83232]">
                  Hapus Akun
                </span>
                <span className="text-[10px] text-[#A83232]/70 font-bold">
                  Tindakan ini tidak dapat dibatalkan
                </span>
              </div>
            </div>

            {/* Red Warning Alert Triangle */}
            <svg className="w-5 h-5 text-[#A83232]/80 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12,2L1,21H23L12,2M12,6L19.8,19H4.2L12,6M11,10V14H13V10H11M11,16V18H13V16H11Z" />
            </svg>
          </div>

        </div>
      </div>

    </div>
  );
};
