import type { ReactNode } from "react";

export function StatCard({
  icon,
  tone,
  value,
  label,
  trend,
}: {
  icon: ReactNode;
  tone: "green" | "amber";
  value: string;
  label: string;
  trend: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#d4ded7] bg-white p-5 shadow-sm">
      <div className="flex items-start">
        <span
          className={`grid size-11 place-items-center rounded-xl [&_svg]:size-5 ${tone === "green" ? "bg-[#bcebd1] text-[#47705b]" : "bg-[#ffd9ae] text-[#795000]"}`}
        >
          {icon}
        </span>
        <span
          className={`ml-auto text-xs font-bold ${tone === "green" ? "text-[#087529]" : "text-[#956100]"}`}
        >
          {trend}
        </span>
      </div>
      <p className="mt-4 text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-[#667169]">{label}</p>
    </div>
  );
}
