import type { ReactNode } from "react";
import { Check, Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
  icon,
  placeholder,
}: {
  label: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  icon: ReactNode;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-bold text-[#26312a]">
      {label}
      <span className="relative mt-2 block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#536159] [&_svg]:size-5">
          {icon}
        </span>
        <input
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          required
          minLength={name === "currentPassword" ? 8 : 12}
          autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
          placeholder={placeholder}
          className="h-12 w-full rounded-full border-2 border-[#bdcbbd] bg-[#f4fbff] pl-12 pr-12 text-sm font-normal outline-none placeholder:text-[#87919d] focus:border-[#087529]"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Sembunyikan ${label}` : `Tampilkan ${label}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#536159]"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </span>
    </label>
  );
}

export function PasswordTip({
  children,
  valid,
}: {
  children: ReactNode;
  valid: boolean;
}) {
  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${valid ? "border-[#8ef28e] text-[#8ef28e]" : "border-white/50 text-white/50"}`}
      >
        <Check className="size-3" />
      </span>
      <span>{children}</span>
    </li>
  );
}
