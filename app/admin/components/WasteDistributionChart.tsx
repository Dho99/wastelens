"use client";

import React from "react";
import type { WasteDistributionItem } from "../types/dashboard";

export interface WasteDistributionChartProps {
  items: WasteDistributionItem[];
}

export function WasteDistributionChart({ items }: WasteDistributionChartProps) {
  // SVG Donut Chart Constants
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate stroke-dasharray offsets for donut segments immutably
  const segments = items.map((item, index) => {
    const prevCumulative = items
      .slice(0, index)
      .reduce((sum, curr) => sum + curr.percentage, 0);
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((prevCumulative / 100) * circumference);
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <h3 className="text-lg font-extrabold text-[#0f172a] tracking-tight mb-6">
        Distribusi Jenis Sampah
      </h3>

      {/* SVG Donut Chart */}
      <div className="relative flex items-center justify-center my-4">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 select-none overflow-visible"
        >
          {segments.map((seg) => (
            <circle
              key={seg.id}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 hover:opacity-90 cursor-pointer"
            >
              <title>{`${seg.label}: ${seg.percentage}% (${seg.weightKg} kg)`}</title>
            </circle>
          ))}
        </svg>

        {/* Donut Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-3xl font-black text-[#0f172a] tracking-tight">
            78%
          </span>
          <span className="text-xs font-bold text-[#64748b] mt-0.5">
            Organik
          </span>
        </div>
      </div>

      {/* Legend List */}
      <div className="space-y-3 mt-6 pt-4 border-t border-slate-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm font-semibold text-[#334155]"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-[#475569]">{item.label}</span>
            </div>
            <span className="font-black text-[#0f172a] tracking-tight">
              {item.weightKg} kg
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
