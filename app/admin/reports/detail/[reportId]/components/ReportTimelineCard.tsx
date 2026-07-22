"use client";

import React from "react";
import { Clock, Check } from "lucide-react";
import type { TimelineStep } from "@/app/admin/types/reports";

export interface ReportTimelineCardProps {
  estimasiText: string;
  steps: TimelineStep[];
}

export function ReportTimelineCard({
  estimasiText,
  steps,
}: ReportTimelineCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#0f172a]" />
          <h3 className="text-sm md:text-base font-extrabold text-[#0f172a] tracking-tight">
            Estimasi Penanganan
          </h3>
        </div>
        <span className="text-sm md:text-base font-black text-[#287A38] tracking-tight">
          {estimasiText}
        </span>
      </div>

      {/* Vertical Progress Timeline */}
      <div className="relative space-y-5 my-auto pl-2 py-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div key={step.id} className="relative flex items-start gap-3.5 group">
              {/* Connecting Vertical Line */}
              {!isLast && (
                <div className="absolute left-[11px] top-6 bottom-[-20px] w-[2px] bg-[#287A38] z-0" />
              )}

              {/* Circle Icon Badge */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-transform duration-200 group-hover:scale-110 ${
                  step.completed
                    ? "bg-[#287A38] text-white shadow-xs"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              {/* Label & Time Details */}
              <div className="-mt-0.5">
                <p className="text-xs md:text-sm font-extrabold text-[#0f172a] tracking-tight leading-tight">
                  {step.label}
                </p>
                <p className="text-[11px] font-semibold text-[#94a3b8] mt-0.5">
                  {step.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
