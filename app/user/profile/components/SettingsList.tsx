import React from "react";

interface MenuItem {
  id: string;
  label: string;
  iconType: 'ACCOUNT' | 'SHIELD' | 'HELP' | 'INFO';
  onClick: () => void;
}

interface SettingsListProps {
  onMenuClick: (menuId: string) => void;
}

export const SettingsList: React.FC<SettingsListProps> = ({ onMenuClick }) => {
  const menus: MenuItem[] = [
    {
      id: "info-pribadi",
      label: "Informasi Pribadi",
      iconType: "ACCOUNT",
      onClick: () => onMenuClick("info-pribadi"),
    },
    {
      id: "keamanan",
      label: "Keamanan Akun",
      iconType: "SHIELD",
      onClick: () => onMenuClick("keamanan"),
    },
    {
      id: "bantuan",
      label: "Bantuan & Dukungan",
      iconType: "HELP",
      onClick: () => onMenuClick("bantuan"),
    },
    {
      id: "tentang",
      label: "Tentang WasteLens",
      iconType: "INFO",
      onClick: () => onMenuClick("tentang"),
    },
  ];

  return (
    <div className="px-4 mb-5">
      <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm divide-y divide-gray-50">
        {menus.map((item) => {
          let iconNode = null;
          let iconBg = "bg-gray-100 text-gray-500";

          if (item.iconType === "ACCOUNT") {
            iconBg = "bg-[#E2ECE4] text-[#1E7D38]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            );
          } else if (item.iconType === "SHIELD") {
            iconBg = "bg-[#F3EEF5] text-[#80509E]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M12,2.18L19,5.29V11C19,15.93 15.59,20.58 12,21.96C8.41,20.58 5,15.93 5,11V5.29L12,2.18M12,4L7,6.23V11C7,14.87 9.74,18.57 12,19.78C14.26,18.57 17,14.87 17,11V6.23L12,4Z" />
              </svg>
            );
          } else if (item.iconType === "HELP") {
            iconBg = "bg-[#E2ECE4] text-[#1E7D38]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A3.75,3.75 0 0,0 8.25,9.75H9.75A2.25,2.25 0 0,1 12,7.5A2.25,2.25 0 0,1 14.25,9.75C14.25,11.25 12,11.25 12,13.5H13.5C13.5,11.63 15.75,11.25 15.75,9.75A3.75,3.75 0 0,0 12,6Z" />
              </svg>
            );
          } else if (item.iconType === "INFO") {
            iconBg = "bg-[#F3EEF5] text-[#80509E]";
            iconNode = (
              <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
              </svg>
            );
          }

          return (
            <div
              key={item.id}
              onClick={item.onClick}
              className="flex items-center justify-between py-3.5 px-2 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
            >
              <div className="flex items-center gap-3.5">
                {/* Circle Icon Container */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 ${iconBg}`}>
                  {iconNode}
                </div>
                <span className="text-xs font-bold text-gray-805">
                  {item.label}
                </span>
              </div>

              {/* Chevron Right */}
              <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
