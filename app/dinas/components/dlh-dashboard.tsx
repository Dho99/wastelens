"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DlhShell } from "./dlh-shell";
import {
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Layers3,
  Sparkles,
  X,
} from "lucide-react";
import { type DlhOfficer, type DlhReport, type DlhVehicle, updateDlhStore, useDlhStore } from "@/lib/dlh-store";

type Dropdown = "vehicle" | "officer" | null;

const MapCanvas = dynamic(() => import("./dlh-operations-map"), {
  ssr: false,
  loading: () => <section className="min-h-[420px] flex-1 animate-pulse bg-[#dcecf2] lg:min-w-[430px]" aria-label="Memuat peta operasional" />,
});

function DropdownField({
  type,
  label,
  placeholder,
  active,
  onToggle,
  selected,
  onSelect,
  vehicles,
  officers,
}: {
  type: Exclude<Dropdown, null>;
  label: string;
  placeholder: string;
  active: Dropdown;
  onToggle: (type: Exclude<Dropdown, null>) => void;
  selected: string;
  onSelect: (id: string) => void;
  vehicles: { id: string; name: string; meta: string }[];
  officers: { id: string; initials: string; name: string; meta: string }[];
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

function ReportPanel({ report, vehicles, officers, onClose }: { report: DlhReport; vehicles: DlhVehicle[]; officers: DlhOfficer[]; onClose: () => void }) {
  const router = useRouter();
  const [dropdown, setDropdown] = useState<Dropdown>(null);
  const [vehicle, setVehicle] = useState("");
  const [officer, setOfficer] = useState("");
  const vehicleOptions = vehicles.filter((item) => item.status === "Beroperasi").map((item) => ({ id: item.id, name: `${item.type} • ${item.plate}`, meta: `Kapasitas ${item.capacity} • ${item.area}` }));
  const officerOptions = officers.map((item) => ({ id: item.id, initials: item.initials, name: item.name, meta: `${item.role} • ${item.zone}` }));

  const toggleDropdown = (next: Exclude<Dropdown, null>) => setDropdown((current) => (current === next ? null : next));
  const assignFleet = () => {
    updateDlhStore((draft) => {
      const target = draft.reports.find((item) => item.id === report.id);
      if (target) {
        target.status = "Diproses";
        target.assignedVehicleId = vehicle;
        target.assignedOfficerId = officer;
      }
      const vehicleName = draft.vehicles.find((item) => item.id === vehicle)?.plate ?? vehicle;
      const officerName = draft.officers.find((item) => item.id === officer)?.name ?? officer;
      draft.notifications.unshift({ id: Date.now(), title: "Armada berhasil ditugaskan", message: `${vehicleName} dan ${officerName} ditugaskan untuk laporan #${report.id}.`, time: "Baru saja", type: "truck", read: false });
    });
    router.push(`/dinas/assignments/${report.id}?vehicle=${encodeURIComponent(vehicle)}&officer=${encodeURIComponent(officer)}`);
  };

  return (
    <aside className="fixed inset-x-0 bottom-0 top-16 z-20 flex w-full flex-col border-l border-[#d8e2dd] bg-white lg:relative lg:inset-auto lg:w-[39%] lg:min-w-[480px] lg:max-w-[560px] lg:shrink-0">
      <div className="flex h-[93px] shrink-0 items-center bg-[#e9f7fd] px-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#17231d]">Laporan #{report.id}</h2>
          <p className="mt-0.5 text-xs text-[#758079]">{report.location} • {report.district}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Tutup laporan" className="ml-auto rounded-full p-2 hover:bg-white/70">
          <X className="size-6" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
        <div className="relative h-[294px] overflow-hidden rounded-[20px] border border-[#bcc8c1] bg-slate-200">
          <Image
            src={report.photoUrl ?? "/images/dlh-dashboard-reference.png"}
            alt={`Foto laporan ${report.id}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
            unoptimized={Boolean(report.photoUrl?.startsWith("data:"))}
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
          vehicles={vehicleOptions}
          officers={officerOptions}
        />

        <DropdownField
          type="officer"
          label="Pilih Petugas"
          placeholder="Pilih Petugas Lapangan"
          active={dropdown}
          onToggle={toggleDropdown}
          selected={officer}
          onSelect={(id) => { setOfficer(id); setDropdown(null); }}
          vehicles={vehicleOptions}
          officers={officerOptions}
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
  const store = useDlhStore();
  const activeReports = store.reports.filter((report) => report.status !== "Selesai");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(activeReports[0]?.id ?? null);
  const selectedReport = activeReports.find((report) => report.id === selectedReportId) ?? activeReports[0];
  const reportOpen = Boolean(selectedReportId && selectedReport);

  return (
    <DlhShell>
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <MapCanvas reports={activeReports} reportOpen={reportOpen} onOpenReport={setSelectedReportId} />
        {reportOpen && selectedReport && <ReportPanel report={selectedReport} vehicles={store.vehicles} officers={store.officers} onClose={() => setSelectedReportId(null)} />}
      </main>
    </DlhShell>
  );
}
