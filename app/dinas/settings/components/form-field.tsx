import type { ReactNode } from "react";

export function FormField({
  icon,
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  icon: ReactNode;
  label: string;
  name: string;
  defaultValue: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#27342d]">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#d9e2dc] bg-[#fbfdfb] px-3 text-[#7a8780] transition focus-within:border-[#17833a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#17833a]/10">
        <span className="[&>svg]:size-[18px]">{icon}</span>
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#17231d] outline-none placeholder:text-[#a3ada7]"
        />
      </span>
    </label>
  );
}
