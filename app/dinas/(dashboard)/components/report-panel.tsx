"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Clock3,
    ClipboardCheck,
    Layers3,
    MapPin,
    Navigation,
    Recycle,
    Sparkles,
    UserRound,
    X,
} from "lucide-react";
import { useAssignReport } from "../../hooks/useReports";
import type { DinasReport, DinasOfficer, DinasVehicle } from "@/lib/services/dinas/types";
import { shortReportId, wasteTypeLabel } from "../../lib/report-helpers";
import { DropdownField } from "./dropdown-field";

type Dropdown = "vehicle" | "officer" | null;

interface Props {
    report: DinasReport;
    vehicles: DinasVehicle[];
    officers: DinasOfficer[];
    onClose: () => void;
}

export function ReportPanel({ report, vehicles, officers, onClose }: Props) {
    const router = useRouter();
    const assignMutation = useAssignReport();
    const [dropdown, setDropdown] = useState<Dropdown>(null);
    const [vehicle, setVehicle] = useState("");
    const [officer, setOfficer] = useState("");
    const vehicleOptions = vehicles
        .map((item) => ({
            id: item.id,
            name: `${item.jenis} • ${item.jenis.split(" ")[0] || "N/A"}`,
            meta: `Kapasitas ${item.kapasitas} kg`,
        }));
    const officerOptions = officers.map((item) => ({
        id: item.id,
        initials: item.nama.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        name: item.nama,
        meta: "Petugas Lapangan",
    }));
    const displayId = shortReportId(report.id);
    const category = report.priority_level === "TINGGI" || (report.priority_score != null && report.priority_score > 0.7) ? "BAHAYA" : "AMAN";
    const coordinates =
        report.lokasi_lat != null && report.lokasi_lng != null
            ? `${report.lokasi_lat.toFixed(5)}, ${report.lokasi_lng.toFixed(5)}`
            : report.address_text ?? "Koordinat tidak tersedia";
    const address =
        report.address_text ??
        (report.lokasi_lat != null ? `${report.lokasi_lat}, ${report.lokasi_lng}` : "Alamat belum tersedia");
    const wasteTypes = report.waste_types?.length
        ? report.waste_types
        : ["Sampah campuran"];
    const sizeLabel = report.kategori_ukuran
        ? wasteTypeLabel(report.kategori_ukuran)
        : category === "BAHAYA"
          ? "Besar"
          : "Sedang";

    const toggleDropdown = (next: Exclude<Dropdown, null>) =>
        setDropdown((current) => (current === next ? null : next));
    const assignFleet = () => {
        assignMutation.mutate(
            {
                id: report.id,
                petugasId: officer,
                kendaraanId: vehicle,
            },
            {
                onError: (err) => {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Gagal menugaskan laporan";
                    window.alert(message);
                },
                onSuccess: () => {
                    router.push(
                        `/dinas/assignments/${report.id}?vehicle=${encodeURIComponent(vehicle)}&officer=${encodeURIComponent(officer)}`,
                    );
                },
            },
        );
    };

    return (
        <aside className="fixed inset-x-0 bottom-0 top-16 z-20 flex h-auto max-h-[100dvh] w-full min-h-0 flex-col overflow-hidden border-l border-[#d8e2dd] bg-white lg:relative lg:inset-auto lg:h-full lg:w-[39%] lg:min-w-[480px] lg:max-w-[560px] lg:shrink-0">
            <div className="flex min-h-[112px] shrink-0 items-center gap-4 bg-[#e9f7fd] px-6 py-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5d7569]">
                            Detail laporan
                        </p>
                        <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${report.status === "WAITING" || report.status === "ANALYZED" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                        >
                            {report.status}
                        </span>
                    </div>
                    <h2
                        className="mt-1 truncate text-xl font-extrabold tracking-[-0.02em] text-[#17231d]"
                        title={report.id}
                    >
                        Laporan {displayId}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#66776e]">
                        <span className="inline-flex items-center gap-1">
                            <UserRound className="size-3.5" /> {report.user?.name ?? "Tidak diketahui"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <Clock3 className="size-3.5" /> {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}{" "}
                            {new Date(report.createdAt).getFullYear().toString()}, {new Date(report.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"}
                        </span>
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup laporan"
                    className="shrink-0 rounded-full p-2 hover:bg-white/70"
                >
                    <X className="size-6" />
                </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-4">
                <div className="relative h-[294px] overflow-hidden rounded-[20px] border border-[#bcc8c1] bg-slate-200">
                    <Image
                        src={
                            report.foto_url ??
                            "/images/dlh-dashboard-reference.png"
                        }
                        alt={`Foto laporan ${report.id}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 520px"
                        unoptimized={Boolean(
                            report.foto_url?.startsWith("data:"),
                        )}
                    />
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#147632] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        <Layers3 className="size-3.5" /> AI Verified
                    </span>
                </div>

                <section className="rounded-[22px] border border-[#c9d9d0] bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-extrabold text-[#24342b]">
                        Informasi Laporan
                    </h3>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e4f4ec] text-[#087529]">
                                <MapPin className="size-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#829087]">
                                    Alamat
                                </p>
                                <p className="mt-1 text-sm font-semibold leading-5 text-[#35453c]">
                                    {address}
                                </p>
                                {report.district && (
                                    <p className="mt-0.5 text-xs text-[#75827b]">
                                        {report.district}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e7f2f8] text-[#35687e]">
                                <Navigation className="size-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#829087]">
                                    Koordinat
                                </p>
                                <p className="mt-1 break-all font-mono text-xs font-bold text-[#35453c]">
                                    {coordinates}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fff0dc] text-[#9a6200]">
                                <Recycle className="size-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#829087]">
                                    Jenis Sampah
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {wasteTypes.map((type) => (
                                        <span
                                            key={type}
                                            className="rounded-full bg-[#edf6f1] px-3 py-1 text-[11px] font-bold text-[#47705b]"
                                        >
                                            {wasteTypeLabel(type)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e1e9e4] pt-4">
                        <div className="rounded-xl bg-[#f4f8f6] px-3 py-2">
                            <p className="text-[10px] text-[#7b8981]">Ukuran</p>
                            <p className="mt-0.5 text-sm font-extrabold">
                                {sizeLabel}
                            </p>
                        </div>
                        <div className="rounded-xl bg-[#f4f8f6] px-3 py-2">
                            <p className="text-[10px] text-[#7b8981]">
                                Prioritas
                            </p>
                            <p className="mt-0.5 text-sm font-extrabold">
                                {report.priority_level
                                    ? wasteTypeLabel(report.priority_level)
                                    : category === "BAHAYA"
                                      ? "Tinggi"
                                      : "Normal"}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="flex gap-4 rounded-[20px] border border-[#ade6c7] bg-[#edfbf4] px-5 py-6 text-[#48715f]">
                    <Sparkles className="mt-1 size-7 shrink-0" />
                    <div>
                        <p className="text-sm font-bold">
                            Analisis AI: Tumpukan Sampah {sizeLabel}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-[#6c8c7d]">
                            Terdeteksi{" "}
                            {wasteTypes
                                .map(wasteTypeLabel)
                                .join(", ")
                                .toLowerCase()}{" "}
                            di lokasi laporan. Sesuaikan armada dengan ukuran
                            dan tingkat prioritas penanganan.
                        </p>
                    </div>
                </div>

                <DropdownField
                    type="vehicle"
                    label="Pilih Armada"
                    placeholder="Pilih Armada Tersedia"
                    active={dropdown}
                    onToggle={toggleDropdown}
                    selected={vehicle}
                    onSelect={(id) => {
                        setVehicle(id);
                        setDropdown(null);
                    }}
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
                    onSelect={(id) => {
                        setOfficer(id);
                        setDropdown(null);
                    }}
                    vehicles={vehicleOptions}
                    officers={officerOptions}
                />

                <div className="rounded-[24px] border border-[#c3d2c6] px-4 py-4">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold tracking-wide text-[#7a857d]">
                            Estimasi Waktu Jemput
                        </span>
                        <span className="text-sm font-extrabold text-[#08752a]">
                            14 Menit
                        </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-semibold tracking-wide text-[#7a857d]">
                            Tingkat Prioritas
                        </span>
                        <span className="rounded-sm bg-[#ffdada] px-2 py-1 font-bold text-[#b00000]">
                            Tinggi
                        </span>
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
