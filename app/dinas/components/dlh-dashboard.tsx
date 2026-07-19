"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DlhShell } from "./dlh-shell";
import {
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Crosshair,
  Layers3,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { updateDlhStore } from "@/lib/dlh-store";

const vehicles = [
  { id: "truck-01", name: "Truk Sampah 01", meta: "Kapasitas 10 ton • 1.2km" },
  { id: "truck-05", name: "Truk Sampah 05", meta: "Kapasitas 5 ton • 2.5km" },
];

const officers = [
  { id: "budi", initials: "BS", name: "Budi Santoso", meta: "Aktif • 0.5km dari lokasi" },
  { id: "siti", initials: "SA", name: "Siti Aminah", meta: "Aktif • 1.2km dari lokasi" },
];

type Dropdown = "vehicle" | "officer" | null;

function MapCanvas({ reportOpen, onOpenReport }: { reportOpen: boolean; onOpenReport: () => void }) {
  const [view, setView] = useState<"heatmap" | "points">("heatmap");
  const [zoom, setZoom] = useState(1);
  const [located, setLocated] = useState(false);

  return (
    <section className="relative min-h-[420px] flex-1 overflow-hidden bg-[#64c5ed] lg:min-w-[430px]">
      <Image
        src="/images/dlh-dashboard-reference.png"
        alt="Peta heatmap kepadatan laporan sampah wilayah Jakarta"
        width={1444}
        height={1028}
        priority
        className="pointer-events-none absolute left-[-41.95%] top-[-6.75%] h-auto w-[234.8%] max-w-none select-none transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      />
      <div className="absolute left-5 top-5 flex h-12 gap-1 rounded-full bg-white/80 p-1 text-xs sm:left-6 sm:h-[52px] sm:text-sm">
        <button
          type="button"
          onClick={() => setView("heatmap")}
          className={`min-w-[94px] rounded-full px-4 font-extrabold transition-colors sm:min-w-[108px] ${view === "heatmap" ? "bg-[#087529] text-white shadow-[0_6px_12px_rgba(18,27,22,0.3)]" : "bg-transparent text-[#17231d] hover:bg-white/15"}`}
        >
          Heatmap
        </button>
        <button
          type="button"
          onClick={() => setView("points")}
          className={`min-w-[118px] rounded-full px-4 font-semibold transition-colors sm:min-w-[132px] ${view === "points" ? "bg-[#087529] text-white shadow-[0_6px_12px_rgba(18,27,22,0.3)]" : "bg-transparent text-[#17231d] hover:bg-white/15"}`}
        >
          Titik Laporan
        </button>
      </div>

      <div className="absolute left-5 top-[84px] grid gap-3 sm:left-6 sm:top-[88px]">
        <div className="grid gap-2 rounded-[26px] bg-white/80 p-2">
          <button type="button" onClick={() => setZoom((value) => Math.min(1.35, value + 0.1))} aria-label="Perbesar peta" className="grid size-11 place-items-center rounded-full bg-[#f4faff] text-[#12232c] shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition hover:bg-white sm:size-12"><Plus className="size-6" strokeWidth={2.2} /></button>
          <button type="button" onClick={() => setZoom((value) => Math.max(0.85, value - 0.1))} aria-label="Perkecil peta" className="grid size-11 place-items-center rounded-full bg-[#f4faff] text-[#12232c] shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition hover:bg-white sm:size-12"><Minus className="size-6" strokeWidth={2.2} /></button>
        </div>
        <div className="rounded-[26px] bg-white/80 p-2">
          <button type="button" onClick={() => setLocated((value) => !value)} aria-pressed={located} aria-label="Lokasi saya" className={`grid size-11 place-items-center rounded-full shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition sm:size-12 ${located ? "bg-[#087529] text-white" : "bg-[#f4faff] text-[#12232c] hover:bg-white"}`}>
            <Crosshair className="size-6" strokeWidth={2.3} />
          </button>
        </div>
      </div>

      {located && <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-[#087529] shadow-xl"><span className="size-2 rounded-full bg-white" /></span>}

      {view === "points" && (
        <div className="pointer-events-none absolute inset-0">
          {[
            [26, 36], [47, 48], [69, 31], [76, 67], [37, 72], [61, 59],
          ].map(([left, top], index) => (
            <button
              type="button"
              key={`${left}-${top}`}
              onClick={onOpenReport}
              aria-label={`Buka laporan ${index + 1}`}
              className="pointer-events-auto absolute grid size-7 place-items-center rounded-full border-2 border-white bg-[#08752a] text-[10px] font-bold text-white shadow-lg transition hover:scale-110 hover:bg-[#065d21]"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {!reportOpen && (
        <button
          type="button"
          onClick={onOpenReport}
          className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-[#087529] px-5 py-3 text-sm font-bold text-white shadow-lg"
        >
          <MapPin className="size-4" /> Buka laporan aktif
        </button>
      )}
    </section>
  );
}

function DropdownField({
  type,
  label,
  placeholder,
  active,
  onToggle,
  selected,
  onSelect,
}: {
  type: Exclude<Dropdown, null>;
  label: string;
  placeholder: string;
  active: Dropdown;
  onToggle: (type: Exclude<Dropdown, null>) => void;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const isOpen = active === type;
  const selectedItem = type === "vehicle" ? vehicles.find((item) => item.id === selected) : officers.find((item) => item.id === selected);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-bold text-[#1f2924]">{label}</label>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => onToggle(type)}
        className={`flex h-[47px] w-full items-center justify-between rounded-full border bg-white px-4 text-left text-sm transition-colors ${
          isOpen ? "border-2 border-[#08752a]" : "border-[#859287]"
        }`}
      >
        <span className="truncate">{selectedItem?.name ?? placeholder}</span>
        {isOpen ? <ChevronUp className="size-4 shrink-0" /> : <ChevronDown className="size-4 shrink-0 text-[#657269]" />}
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-[77px] z-30 overflow-hidden rounded-[24px] border border-[#b9c7bd] bg-white py-1 shadow-[0_12px_28px_rgba(24,46,34,0.2)]">
          {type === "vehicle"
            ? vehicles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[#f1faf5]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">{item.name}</p>
                    <p className="truncate text-[11px] text-[#667168]">{item.meta}</p>
                  </div>
                  <span className="size-2 rounded-full bg-[#08752a]" />
                </button>
              ))
            : officers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f1faf5]"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#c9eed9] text-xs font-bold text-[#4b8b69]">{item.initials}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{item.name}</p>
                    <p className="truncate text-[10px] text-[#187234]">{item.meta}</p>
                  </div>
                </button>
              ))}
        </div>
      )}
    </div>
  );
}

function ReportPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [dropdown, setDropdown] = useState<Dropdown>(null);
  const [vehicle, setVehicle] = useState("");
  const [officer, setOfficer] = useState("");

  const toggleDropdown = (next: Exclude<Dropdown, null>) => setDropdown((current) => (current === next ? null : next));
  const assignFleet = () => {
    updateDlhStore((draft) => {
      const report = draft.reports.find((item) => item.status === "Menunggu");
      if (report) report.status = "Diproses";
      draft.notifications.unshift({ id: Date.now(), title: "Armada berhasil ditugaskan", message: `${vehicle} dan ${officer} ditugaskan untuk laporan prioritas.`, time: "Baru saja", type: "truck", read: false });
    });
    router.push(`/dinas/assignments/WL-099?vehicle=${vehicle}&officer=${officer}`);
  };

  return (
    <aside className="fixed inset-x-0 bottom-0 top-16 z-20 flex w-full flex-col border-l border-[#d8e2dd] bg-white lg:relative lg:inset-auto lg:w-[39%] lg:min-w-[480px] lg:max-w-[560px] lg:shrink-0">
      <div className="flex h-[93px] shrink-0 items-center bg-[#e9f7fd] px-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#17231d]">Report #WL-099</h2>
          <p className="mt-0.5 text-xs text-[#758079]">Kelurahan Menteng, Jakarta Pusat</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Tutup laporan" className="ml-auto rounded-full p-2 hover:bg-white/70">
          <X className="size-6" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
        <div className="relative h-[294px] overflow-hidden rounded-[20px] border border-[#bcc8c1] bg-slate-200">
          <Image
            src="/images/dlh-dashboard-reference.png"
            alt="Tumpukan sampah pada laporan WL-099"
            width={1444}
            height={1028}
            className="absolute left-[-173%] top-[-58.3%] h-auto w-[278.2%] max-w-none"
          />
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#147632] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <Layers3 className="size-3.5" /> AI Verified
          </span>
        </div>

        <div className="flex gap-4 rounded-[20px] border border-[#ade6c7] bg-[#edfbf4] px-5 py-6 text-[#48715f]">
          <Sparkles className="mt-1 size-7 shrink-0" />
          <div>
            <p className="text-sm font-bold">AI Analysis: Large Trash Pile</p>
            <p className="mt-1 text-sm leading-5 text-[#6c8c7d]">Deteksi penumpukan sampah anorganik masif berukuran ~15m³. Membutuhkan truk kapasitas besar (Armada Tipe C).</p>
          </div>
        </div>

        <DropdownField
          type="vehicle"
          label="Pilih Armada"
          placeholder="Pilih Armada Tersedia"
          active={dropdown}
          onToggle={toggleDropdown}
          selected={vehicle}
          onSelect={(id) => { setVehicle(id); setDropdown(null); }}
        />

        <DropdownField
          type="officer"
          label="Pilih Petugas"
          placeholder="Pilih Petugas Lapangan"
          active={dropdown}
          onToggle={toggleDropdown}
          selected={officer}
          onSelect={(id) => { setOfficer(id); setDropdown(null); }}
        />

        <div className="rounded-[24px] border border-[#c3d2c6] px-4 py-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wide text-[#7a857d]">Estimasi Waktu Jemput</span>
            <span className="text-sm font-extrabold text-[#08752a]">14 Menit</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wide text-[#7a857d]">Tingkat Prioritas</span>
            <span className="rounded-sm bg-[#ffdada] px-2 py-1 font-bold text-[#b00000]">Tinggi</span>
          </div>
        </div>

      </div>

      <div className="shrink-0 border-t border-[#d8e2dd] bg-[#f2faff] p-6">
        <button
          type="button"
          disabled={!vehicle || !officer}
          onClick={assignFleet}
          className="flex h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[#087529] text-sm font-extrabold text-white shadow-md transition hover:bg-[#065d21] disabled:cursor-not-allowed disabled:bg-[#8fb39b]"
        >
          <ClipboardCheck className="size-5" />
          Tugaskan Armada
        </button>
      </div>
    </aside>
  );
}

export function DlhDashboard() {
  const [reportOpen, setReportOpen] = useState(true);

  return (
    <DlhShell>
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <MapCanvas reportOpen={reportOpen} onOpenReport={() => setReportOpen(true)} />
        {reportOpen && <ReportPanel onClose={() => setReportOpen(false)} />}
      </main>
    </DlhShell>
  );
}
