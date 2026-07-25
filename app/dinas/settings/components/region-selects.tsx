import { ChevronDown, MapPin } from "lucide-react";
import type { RegionOption } from "../types/regions";

function RegionSelect({
  label,
  value,
  placeholder,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: RegionOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#27342d]">{label}</span>
      <span className="relative mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#d9e2dc] bg-[#fbfdfb] px-3 text-[#7a8780] transition focus-within:border-[#17833a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#17833a]/10">
        <MapPin className="size-[18px] shrink-0" />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required
          className="min-w-0 flex-1 appearance-none bg-transparent pr-7 text-sm font-medium text-[#17231d] outline-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4" />
      </span>
    </label>
  );
}

export function RegionSelects({
  provinceCode,
  regionCode,
  provinces,
  regencies,
  onProvinceChange,
  onRegionChange,
}: {
  provinceCode: string;
  regionCode: string;
  provinces: RegionOption[];
  regencies: RegionOption[];
  onProvinceChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}) {
  return (
    <>
      <RegionSelect
        label="Provinsi"
        value={provinceCode}
        placeholder="Pilih provinsi"
        options={provinces}
        onChange={onProvinceChange}
      />
      <RegionSelect
        label="Kota / Kabupaten"
        value={regionCode}
        placeholder="Pilih kota atau kabupaten"
        options={regencies}
        disabled={!provinceCode}
        onChange={onRegionChange}
      />
    </>
  );
}
