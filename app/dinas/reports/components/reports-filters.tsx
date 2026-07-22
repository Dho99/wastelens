import { useRef } from "react";
import { CalendarDays, ChevronDown, Search, X } from "lucide-react";
import type { ReportStatus } from "../hooks/use-reports-page";

interface Props {
  query: string;
  status: "Semua" | ReportStatus;
  date: string;
  formattedDate: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (status: "Semua" | ReportStatus) => void;
  onDateChange: (value: string) => void;
  onClearDate: () => void;
}

export function ReportsFilters({
  query,
  status,
  date,
  formattedDate,
  onQueryChange,
  onStatusChange,
  onDateChange,
  onClearDate,
}: Props) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") input.showPicker();
    else { input.focus(); input.click(); }
  };

  return (
    <section className="mt-6 flex flex-col gap-4 rounded-[24px] border border-[#b7cbbd] bg-white/55 p-4 lg:flex-row lg:items-center">
      <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-[#e8f6fd] px-5">
        <Search className="size-5 shrink-0 text-[#46594f]" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#7c8792]"
          placeholder="Cari ID Laporan, Lokasi, atau Petugas..."
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-bold text-[#46594f]">Filter Status:</span>
        {(["Semua", "Menunggu", "Diproses", "Selesai"] as const).map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onStatusChange(item)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${status === item ? "border-[#b4e4cb] bg-[#bcebd1] text-[#47705b]" : "border-[#b7c7bb] bg-white/40 text-[#536159] hover:bg-white"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="hidden h-12 w-px bg-[#c5d1c8] lg:block" />
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={openDatePicker}
          aria-label="Pilih tanggal laporan"
          className="flex h-11 items-center gap-2 rounded-full bg-[#e8f6fd] px-4 text-xs font-bold text-[#536159] transition hover:bg-[#dceff8]"
        >
          <CalendarDays className="size-5" />
          <span>{formattedDate}</span>
          <ChevronDown className="size-4" />
        </button>
        <input
          ref={dateInputRef}
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="pointer-events-none absolute bottom-0 left-1/2 size-px opacity-0"
          tabIndex={-1}
          aria-hidden="true"
        />
        {date && (
          <button
            type="button"
            onClick={onClearDate}
            aria-label="Hapus filter tanggal"
            className="ml-1 grid size-8 place-items-center rounded-full text-[#667169] hover:bg-white"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </section>
  );
}
