"use client";

import React from "react";

export interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  icon,
  iconBgColor,
  iconTextColor,
  onClick,
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[128px]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[15px] font-medium text-[#475569] tracking-tight">
          {title}
        </span>
        <div
          className={`w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0 ${iconBgColor} ${iconTextColor}`}
        >
          {icon}
        </div>
      </div>
      <div className="text-4xl font-black text-[#0f172a] tracking-tight mt-2">
        {value}
      </div>
    </div>
  );
}
