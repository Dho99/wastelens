"use client";

import React from "react";
import { Check, ArrowLeft } from "lucide-react";

export interface SuccessViewProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

export function SuccessView({
  title,
  description,
  buttonText,
  onButtonClick,
}: SuccessViewProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4 select-none">
      <div className="bg-white border border-slate-200/80 rounded-[32px] p-8 md:p-10 shadow-lg max-w-md w-full flex flex-col items-center">
        {/* Checkmark Badge */}
        <div className="w-20 h-20 bg-[#edf7f2] rounded-2xl flex items-center justify-center shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#287A38] flex items-center justify-center text-white shadow-xs">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-[#0f172a] text-center mt-6 tracking-tight leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm font-semibold text-[#64748b] text-center mt-2 leading-relaxed max-w-sm">
          {description}
        </p>

        {/* Back Button */}
        <button
          type="button"
          onClick={onButtonClick}
          className="w-full bg-[#0d5c24] hover:bg-[#094119] text-white font-black text-sm py-4 rounded-full flex items-center justify-center gap-2 mt-8 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}
