import React from "react";
import { RecentActivity } from "../services/dashboardService";

interface RecentActivitiesProps {
  activities: RecentActivity[];
  onViewAll?: () => void;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  onViewAll,
}) => {
  return (
    <div className="px-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-extrabold text-gray-900 tracking-wide">
          Aktivitas Terbaru
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#1E7D38] hover:text-[#165D29] hover:underline transition-all duration-150"
        >
          Lihat Semua
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          // Determine status style
          let badgeBg = "bg-gray-100 text-gray-700";
          let badgeText = activity.status;

          if (activity.status === "SELESAI") {
            badgeBg = "bg-[#FFEBE3] text-[#D2593C]";
            badgeText = "SELESAI";
          } else if (activity.status === "DIPROSES") {
            badgeBg = "bg-[#FFE8F0] text-[#C93B6E]";
            badgeText = "DIPROSES";
          } else if (activity.status === "PERLU_DIPERIKSA") {
            badgeBg = "bg-[#FFF9E6] text-[#B8860B]";
            badgeText = "PERLU DIPERIKSA";
          }

          return (
            <div
              key={activity.id}
              className="bg-white border border-gray-100/80 rounded-2xl p-3 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* Image thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activity.imageUrl}
                    alt={activity.location}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-gray-800">
                    {activity.location}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {activity.time}
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-block text-[9px] font-extrabold px-2.5 py-1 rounded-full tracking-wider ${badgeBg}`}
                    >
                      {badgeText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Point value on right side */}
              {activity.points && (
                <div className="text-right">
                  <span className="text-xs font-black text-[#1E7D38] whitespace-nowrap">
                    +{activity.points} Poin
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
