"use client";

import React from "react";

export interface StepCardProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function StepCard({ stepNumber, icon, title, description }: StepCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-xs flex flex-col items-center text-center relative hover:-translate-y-1 hover:shadow-md transition-all duration-200 h-full select-none">
      
      {/* Top Left Step Number Badge */}
      <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-[#15803d] text-white font-black text-xs flex items-center justify-center shadow-xs">
        {stepNumber}
      </div>

      {/* Center Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-[#e6f4ea] text-[#15803d] flex items-center justify-center mt-3 mb-4 shadow-2xs">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-extrabold text-[#0f291e] tracking-tight mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs font-semibold text-slate-500 leading-relaxed">
        {description}
      </p>

    </div>
  );
}
