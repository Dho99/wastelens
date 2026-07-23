import type { KeyboardEvent } from "react";
import { MapPin, MapPinned, Plus, X } from "lucide-react";
import type { RegionOption } from "../types/regions";

export function DistrictSelector({
  districts,
  suggestions,
  draft,
  disabled,
  error,
  onDraftChange,
  onAdd,
  onRemove,
}: {
  districts: string[];
  suggestions: RegionOption[];
  draft: string;
  disabled: boolean;
  error: string;
  onDraftChange: (value: string) => void;
  onAdd: (district?: string) => void;
  onRemove: (district: string) => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="sm:col-span-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <label htmlFor="district" className="text-sm font-bold text-[#27342d]">
            Daftar Kecamatan
          </label>
          <p className="mt-1 text-xs text-[#78847d]">
            Tambahkan seluruh kecamatan yang masuk dalam cakupan DLH.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-[#56806a]">
          {districts.length} kecamatan
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#d9e2dc] bg-[#fbfdfb] px-3 text-[#7a8780] transition focus-within:border-[#17833a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#17833a]/10">
          <MapPinned className="size-[18px] shrink-0" />
          <input
            id="district"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled
                ? "Pilih kota atau kabupaten terlebih dahulu"
                : "Ketik nama kecamatan"
            }
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#17231d] outline-none placeholder:text-[#a3ada7]"
          />
        </div>
        <button
          type="button"
          onClick={() => onAdd()}
          disabled={!draft.trim()}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#16833a] px-5 text-sm font-bold text-[#087529] transition hover:bg-[#edf8f1] disabled:cursor-not-allowed disabled:border-[#ccd8d0] disabled:text-[#9ba69f]"
        >
          <Plus className="size-4" />
          Tambah
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-xl border border-[#d5e1da] bg-white p-1.5 shadow-[0_10px_24px_rgba(33,72,49,0.12)]">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829088]">
            Rekomendasi Kecamatan
          </p>
          {suggestions.map((district) => (
            <button
              key={district.code}
              type="button"
              onClick={() => onAdd(district.name)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#314239] transition hover:bg-[#edf8f1] hover:text-[#087529]"
            >
              <MapPin className="size-4 text-[#54836a]" />
              {district.name}
              <Plus className="ml-auto size-4" />
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}

      {districts.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-[#e0e8e3] bg-[#f7faf8] p-3">
          {districts.map((district) => (
            <span
              key={district}
              className="inline-flex items-center gap-2 rounded-full border border-[#cce1d4] bg-white py-2 pl-3.5 pr-2 text-xs font-bold text-[#315c43] shadow-sm"
            >
              {district}
              <button
                type="button"
                onClick={() => onRemove(district)}
                aria-label={`Hapus ${district}`}
                className="grid size-5 place-items-center rounded-full text-[#759080] transition hover:bg-red-50 hover:text-red-600"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-[#cbd9d0] bg-[#fafcfb] px-4 py-5 text-center text-xs text-[#7c8981]">
          Belum ada kecamatan yang ditambahkan.
        </div>
      )}
    </div>
  );
}
