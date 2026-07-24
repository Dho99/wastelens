"use client";

import React from "react";
import { Users, Building2, UserCheck } from "lucide-react";

export type RoleTabType = "warga" | "operator" | "petugas";

export interface RoleTabNavigationProps {
  activeTab: RoleTabType;
  onTabChange: (tab: RoleTabType) => void;
}

export function RoleTabNavigation({
  activeTab,
  onTabChange,
}: RoleTabNavigationProps) {
  const tabs = [
    {
      id: "warga" as const,
      label: "Untuk Warga",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "operator" as const,
      label: "Untuk Operator DLH",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: "petugas" as const,
      label: "Untuk Petugas",
      icon: <UserCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex justify-center select-none">
      <div className="bg-slate-100/90 border border-slate-200/80 p-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#15803d] text-white shadow-sm scale-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
