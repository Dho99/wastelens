import React, { useState } from "react";

export const AppSettingsCard: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="px-4 mb-6">
      {/* Label Subtitle */}
      <h3 className="text-[10px] font-black text-gray-400 tracking-widest uppercase px-1 mb-2">
        PENGATURAN APLIKASI
      </h3>

      <div className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm select-none">
        <div className="flex items-center gap-3.5 pl-1">
          {/* Bell Icon circle wrapper */}
          <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-500 border border-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
            {/* MDI bell-outline */}
            <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
              <path d="M12,2A2,2 0 0,0 10,4A2,2 0 0,0 10,4.29C7.12,5.14 5,7.82 5,11V17L3,19V20H21V19L19,17V11C19,7.82 16.88,5.14 14,4.29A2,2 0 0,0 14,4A2,2 0 0,0 12,2M12,6A5,5 0 0,1 17,11V17H7V11A5,5 0 0,1 12,6M10,21A2,2 0 0,0 12,23A2,2 0 0,0 14,21H10Z" />
            </svg>
          </div>

          <span className="text-xs font-bold text-gray-805">
            Notifikasi
          </span>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-13 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#287A38]"></div>
        </label>
      </div>
    </div>
  );
};
