"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { WeeklyReportPoint } from "../types/dashboard";

export interface WeeklyReportChartProps {
  data: WeeklyReportPoint[];
}

export function WeeklyReportChart({ data }: WeeklyReportChartProps) {
  const [period, setPeriod] = useState("7 Hari Terakhir");

  // Chart dimensions & layout calculations
  const yAxisTicks = [30, 25, 20, 15, 10, 5, 0];
  const chartHeight = 220;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const viewBoxWidth = 650;
  const viewBoxHeight = chartHeight + paddingTop + paddingBottom;

  const drawableWidth = viewBoxWidth - paddingLeft - paddingRight;
  const drawableHeight = chartHeight;

  // Calculate coordinates for points
  const points = data.map((pt, idx) => {
    const x = paddingLeft + (idx / (data.length - 1)) * drawableWidth;
    const y = paddingTop + drawableHeight - (pt.value / 30) * drawableHeight;
    return { x, y, value: pt.value, day: pt.day };
  });

  // Construct smooth cubic Bezier path for spline curve
  const createSplinePath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return d;
  };

  const linePathD = createSplinePath(points);
  const areaPathD = points.length
    ? `${linePathD} L ${points[points.length - 1].x},${paddingTop + drawableHeight} L ${points[0].x},${paddingTop + drawableHeight} Z`
    : "";

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-extrabold text-[#0f172a] tracking-tight">
          Statistik Laporan Mingguan
        </h3>
        <div className="relative inline-block">
          <button
            type="button"
            className="bg-[#f8fafc] border border-slate-200 hover:bg-slate-100/80 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#475569] flex items-center gap-1.5 transition-all shadow-2xs"
            onClick={() =>
              setPeriod((prev) =>
                prev === "7 Hari Terakhir" ? "30 Hari Terakhir" : "7 Hari Terakhir"
              )
            }
          >
            <span>{period}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* SVG Spline Chart */}
      <div className="w-full flex-1 min-h-[260px] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="splineAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#287A38" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#287A38" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Y-Gridlines & Y-Axis Labels */}
          {yAxisTicks.map((tick) => {
            const yPos = paddingTop + drawableHeight - (tick / 30) * drawableHeight;
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={viewBoxWidth - paddingRight}
                  y2={yPos}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? "none" : "0"}
                />
                <text
                  x={paddingLeft - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="600"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X-Axis Labels */}
          {points.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={viewBoxHeight - 8}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="12"
              fontWeight="600"
            >
              {pt.day}
            </text>
          ))}

          {/* Area Fill */}
          <path d={areaPathD} fill="url(#splineAreaGradient)" />

          {/* Spline Line */}
          <path
            d={linePathD}
            fill="none"
            stroke="#287A38"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Circle Data Markers */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r="5"
              fill="white"
              stroke="#287A38"
              strokeWidth="2.5"
              className="transition-all duration-200 hover:r-7 hover:stroke-width-3 cursor-pointer"
            >
              <title>{`${pt.day}: ${pt.value} laporan`}</title>
            </circle>
          ))}
        </svg>
      </div>
    </div>
  );
}
