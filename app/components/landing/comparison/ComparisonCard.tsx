"use client";

import React from "react";
import { Check, X, Smartphone, User, MapPin, Lock, UserX, Cpu, BarChart3, Clock, ShieldCheck, Database } from "lucide-react";

export interface ComparisonItem {
  text: string;
  icon?: React.ReactNode;
}

export interface ComparisonCardProps {
  variant: "negative" | "positive";
  badgeText: string;
  items: ComparisonItem[];
}

export function ComparisonCard({ variant, badgeText, items }: ComparisonCardProps) {
  const isPositive = variant === "positive";

  // Pre-configured icons for each index if not explicitly provided
  const negativeIcons = [
    <Smartphone key="1" className="w-3.5 h-3.5" />,
    <UserX key="2" className="w-3.5 h-3.5" />,
    <MapPin key="3" className="w-3.5 h-3.5" />,
    <Lock key="4" className="w-3.5 h-3.5" />,
    <User key="5" className="w-3.5 h-3.5" />,
  ];

  const positiveIcons = [
    <Cpu key="1" className="w-3.5 h-3.5" />,
    <BarChart3 key="2" className="w-3.5 h-3.5" />,
    <Clock key="3" className="w-3.5 h-3.5" />,
    <ShieldCheck key="4" className="w-3.5 h-3.5" />,
    <Database key="5" className="w-3.5 h-3.5" />,
  ];

  return (
    <div
      className={`rounded-[28px] p-6 sm:p-8 space-y-6 transition-all duration-200 ${
        isPositive
          ? "bg-[#f4fbf6] border border-[#a7f3d0] shadow-sm hover:shadow-md"
          : "bg-[#fcfdfd] border border-slate-200/90 shadow-2xs"
      }`}
    >
      {/* Badge Header */}
      <div>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black tracking-tight ${
            isPositive
              ? "bg-[#15803d] text-white shadow-xs"
              : "bg-slate-200/80 text-slate-600"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              isPositive ? "bg-white/20 text-white" : "bg-slate-300 text-slate-600"
            }`}
          >
            {isPositive ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>{badgeText}</span>
        </div>
      </div>

      {/* List Items */}
      <ul className="space-y-4">
        {items.map((item, idx) => {
          const itemIcon =
            item.icon ??
            (isPositive
              ? positiveIcons[idx % positiveIcons.length]
              : negativeIcons[idx % negativeIcons.length]);

          return (
            <li key={item.text} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                  isPositive
                    ? "bg-[#15803d] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isPositive ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : itemIcon}
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold leading-snug ${
                  isPositive ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {item.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
