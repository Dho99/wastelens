"use client";

import React from "react";

export interface FeaturePointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeaturePoint({ icon, title, description }: FeaturePointProps) {
  return (
    <div className="flex items-start gap-4 p-2 rounded-2xl transition-colors hover:bg-slate-50/80">
      
      {/* Icon Circle */}
      <div className="w-10 h-10 rounded-2xl bg-[#e6f4ea] text-[#15803d] flex items-center justify-center shrink-0 shadow-2xs">
        {icon}
      </div>

      {/* Content */}
      <div className="space-y-0.5">
        <h4 className="text-sm font-extrabold text-[#0f291e] tracking-tight">
          {title}
        </h4>
        <p className="text-xs font-medium text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

    </div>
  );
}
