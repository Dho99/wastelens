import React from "react";
import { HistoryGroup, HistoryRedeemItem } from "../services/historyListService";

interface HistoryListProps {
  groups: HistoryGroup[];
  onItemClick: (itemId: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  groups,
  onItemClick,
}) => {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.monthYear} className="px-5">
          {/* Month Section Title */}
          <div className="flex items-center gap-3 mb-3.5 select-none">
            <h3 className="text-sm font-extrabold text-gray-800 tracking-wide flex-shrink-0">
              {group.monthYear}
            </h3>
            {/* Horizontal Line Divider */}
            <div className="flex-1 h-[1px] bg-gray-100" />
          </div>

          {/* Cards within group */}
          <div className="space-y-4">
            {group.items.map((item) => {
              // Status Styling
              let statusBg = "bg-gray-100 text-gray-500";
              if (item.status === "BERHASIL") {
                statusBg = "bg-[#EBF7EE] text-[#248A3D]";
              } else if (item.status === "PROSES") {
                statusBg = "bg-[#FFF0E6] text-[#C55D2D]";
              }

              // Coin spent text color
              const coinsColor = item.status === "BERHASIL" ? "text-[#1E7D38]" : "text-gray-400";

              // Merchant icon node
              let merchantIcon = null;
              if (item.merchantType === "STORE") {
                // MDI storefront-outline
                merchantIcon = (
                  <svg className="w-3.5 h-3.5 fill-current text-gray-400" viewBox="0 0 24 24">
                    <path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z" />
                  </svg>
                );
              } else if (item.merchantType === "PUBLIC") {
                // MDI flash-outline
                merchantIcon = (
                  <svg className="w-3.5 h-3.5 fill-current text-gray-400" viewBox="0 0 24 24">
                    <path d="M7,2H17L13.5,9H19L10,22V14H5L7,2M9,4L7.5,12H12V15.5L16.2,9H12.8L14.2,4H9Z" />
                  </svg>
                );
              } else {
                // MDI ticket-percent-outline
                merchantIcon = (
                  <svg className="w-3.5 h-3.5 fill-current text-gray-400" viewBox="0 0 24 24">
                    <path d="M22,10V6C22,4.89 21.1,4 20,4H4A2,2 0 0,0 2,6V10C3.11,10 4,10.9 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12A2,2 0 0,1 22,10" />
                  </svg>
                );
              }

              return (
                <div
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.005] transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-grow min-w-0 pr-2">
                    {/* Thumbnail Image Box */}
                    {item.imageUrl ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#E2ECE4] border border-[#d6ebd9] text-[#1E7D38] flex items-center justify-center flex-shrink-0 shadow-inner">
                        {/* MDI ticket-percent-outline */}
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M10,8.5H11.5V9H10V8.5M10,10.5H11.5V11H10V10.5M10,12.5H11.5V13H10V12.5M12.5,8.5H14V9H12.5V8.5M12.5,10.5H14V11H12.5V10.5M12.5,12.5H14V13H12.5V12.5M22,10V6C22,4.89 21.1,4 20,4H4A2,2 0 0,0 2,6V10C3.11,10 4,10.9 4,12A2,2 0 0,1 2,14V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V14A2,2 0 0,1 20,12A2,2 0 0,1 22,10" />
                        </svg>
                      </div>
                    )}

                    {/* Middle Details log */}
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <h4 className="text-xs font-black text-gray-805 truncate">
                          {item.title}
                        </h4>
                        <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase flex-shrink-0 ${statusBg}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mt-0.5 truncate">
                        {merchantIcon}
                        <span>{item.merchantName}</span>
                      </div>

                      <span className="text-[9.5px] text-gray-400/80 font-semibold mt-0.5">
                        {item.timestampText}
                      </span>
                    </div>
                  </div>

                  {/* Right Coins Spent */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className={`text-sm font-black tracking-tight ${coinsColor}`}>
                      -{item.coinsSpent.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[9px] font-black text-gray-400 mt-0.5 tracking-wider">
                      KOIN
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ))}
    </div>
  );
};
