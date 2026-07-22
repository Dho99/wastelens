"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    ArrowLeft,
    Camera,
    Check,
    Clock3,
    MapPin,
    Save,
    Truck,
    UserRound,
    X,
} from "lucide-react";
import { DlhShell } from "./dlh-shell";
import { useReport, useAssignReport } from "../hooks/useReports";
import { useOfficers } from "../hooks/useOfficers";
import { useVehicles } from "../hooks/useVehicles";
import type { DinasReport } from "@/lib/services/dinas/types";

const STATUS_DISPLAY: Record<string, string> = {
    WAITING: "Menunggu",
    PENDING: "Diproses",
    SELESAI: "Selesai",
};

const STATUS_TO_API: Record<string, string> = {
    Menunggu: "WAITING",
    Diproses: "PENDING",
    Selesai: "SELESAI",
};

const timeline = [
    ["Dilaporkan", "09:15 WIB"],
    ["Verifikasi AI", "09:16 WIB"],
    ["Penugasan", "09:40 WIB"],
    ["Menuju Lokasi", "09:50 WIB"],
    ["Proses Pembersihan", "10:30 WIB"],
    ["Selesai", "11:15 WIB"],
];

const LeafletLocationMap = dynamic(
    () => import("@/components/leaflet-location-map"),
    {
        ssr: false,
        loading: () => (
            <div
                className="h-[230px] animate-pulse bg-[#d9f1f7] sm:h-[270px]"
                aria-label="Memuat peta lokasi"
            />
        ),
    },
);

function fmt(iso: string) {
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            timeZone: "UTC",
        }),
        year: d.getFullYear().toString(),
        time:
            d.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
            }) + " WIB",
    };
}

export function ReportDetail({ reportId }: { reportId: string }) {
    const router = useRouter();
    const { data: report } = useReport(reportId);
    const { data: officers } = useOfficers();
    const { data: vehicles } = useVehicles();
    const assignMutation = useAssignReport();
    const [updateOpen, setUpdateOpen] = useState(false);
    const [status, setStatus] = useState("Menunggu");
    const [notes, setNotes] = useState("");
    const [notice, setNotice] = useState("");

    if (!report) return null;

    const f = fmt(report.createdAt);
    const detail = {
        reporter: report.user?.name ?? "-",
        time: f.time,
        address:
            report.address_text ??
            `${report.lokasi_lat?.toFixed(4)}, ${report.lokasi_lng?.toFixed(4)}`,
        district: report.district ?? "",
    };
    const assignedOfficer = officers?.find(
        (item) => item.id === report.petugas_id,
    );
    const assignedVehicle = vehicles?.find(
        (item) => item.id === report.kendaraan_id,
    );

    const saveUpdate = () => {
        assignMutation.mutate({
            id: reportId,
            status: STATUS_TO_API[status] ?? status,
        });
        setUpdateOpen(false);
        setNotice(`Laporan berhasil diperbarui menjadi ${status}.`);
    };

    return (
        <DlhShell hideHeader>
            <main className="min-h-0 flex-1 overflow-y-auto bg-[#f4fbff] px-4 pb-10 pt-8 sm:px-7 lg:px-10">
                <div className="mx-auto max-w-[1180px]">
                    <div className="flex items-start gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/dinas/reports")}
                            aria-label="Kembali ke kelola laporan"
                            className="mt-1 grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-white"
                        >
                            <ArrowLeft className="size-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-[30px]">
                                Laporan #{reportId}
                            </h1>
                            <p className="mt-1 text-sm text-[#77837b] sm:text-base">
                                Detail operasional penanganan sampah
                            </p>
                        </div>
                    </div>

                    {notice && (
                        <div
                            role="status"
                            className="mt-5 flex items-center rounded-2xl bg-[#d9f3e4] px-4 py-3 text-sm font-bold text-[#176a35]"
                        >
                            <Check className="mr-2 size-4" />
                            {notice}
                            <button
                                type="button"
                                onClick={() => setNotice("")}
                                className="ml-auto rounded-full p-1 hover:bg-white/60"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    )}

                    <section className="mt-8 grid gap-5 rounded-[20px] border border-[#bdcdbf] bg-white px-6 py-5 shadow-sm sm:grid-cols-3">
                        <div>
                            <p className="text-xs font-semibold text-[#7a877f]">
                                Pelapor
                            </p>
                            <p className="mt-1 text-lg font-extrabold">
                                {detail.reporter}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-[#7a877f]">
                                Jam Laporan
                            </p>
                            <p className="mt-1 text-lg font-extrabold">
                                {detail.time}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-[#7a877f]">
                                Alamat
                            </p>
                            <p className="mt-1 text-base font-extrabold leading-6">
                                {detail.address}
                            </p>
                        </div>
                    </section>

                    <section className="mt-5 overflow-hidden rounded-[20px] border border-[#bdcdbf] bg-white shadow-sm">
                        <div className="border-b border-[#d5e0d8] bg-[#e7f6fd] px-6 py-4">
                            <h2 className="text-lg font-extrabold">
                                Petugas dan Kendaraan Penanganan
                            </h2>
                            <p className="mt-0.5 text-xs text-[#667169]">
                                Data operasional yang ditugaskan untuk laporan
                                ini.
                            </p>
                        </div>
                        <div className="grid gap-4 p-5 sm:grid-cols-2">
                            <div className="flex items-center gap-4 rounded-[18px] border border-[#d5e0d8] bg-[#f8fcfa] p-4">
                                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d8f1e3] text-[#087529]">
                                    {assignedOfficer ? (
                                        <span className="text-xs font-extrabold">
                                            {assignedOfficer.nama
                                                ?.split(" ")
                                                .map((n: string) => n[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                    ) : (
                                        <UserRound className="size-5" />
                                    )}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#77837b]">
                                        Petugas
                                    </p>
                                    <p className="truncate font-extrabold">
                                        {assignedOfficer?.nama ??
                                            "Belum ditugaskan"}
                                    </p>
                                    <p className="truncate text-xs text-[#667169]">
                                        {assignedOfficer
                                            ? `${assignedOfficer.id} • ${assignedOfficer.no_hp}`
                                            : "Pilih petugas melalui dashboard peta"}
                                    </p>
                                </div>
                                {assignedOfficer && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(
                                                `/dinas/logistics/officers/${assignedOfficer.id}`,
                                            )
                                        }
                                        className="rounded-full border border-[#b8cabc] px-3 py-1.5 text-xs font-bold text-[#087529] hover:bg-white"
                                    >
                                        Detail
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-4 rounded-[18px] border border-[#d5e0d8] bg-[#f8fcfa] p-4">
                                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e2eff6] text-[#087529]">
                                    <Truck className="size-6" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#77837b]">
                                        Kendaraan
                                    </p>
                                    <p className="truncate font-extrabold">
                                        {assignedVehicle
                                            ? `${assignedVehicle.jenis} • ${assignedVehicle.id}`
                                            : "Belum ditugaskan"}
                                    </p>
                                    <p className="truncate text-xs text-[#667169]">
                                        {assignedVehicle
                                            ? `${assignedVehicle.id} • Kapasitas ${assignedVehicle.kapasitas}`
                                            : "Pilih kendaraan melalui dashboard peta"}
                                    </p>
                                </div>
                                {assignedVehicle && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(
                                                `/dinas/logistics/vehicles/${assignedVehicle.id}`,
                                            )
                                        }
                                        className="rounded-full border border-[#b8cabc] px-3 py-1.5 text-xs font-bold text-[#087529] hover:bg-white"
                                    >
                                        Detail
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(280px,0.95fr)]">
                        <section className="overflow-hidden rounded-[22px] border border-[#bdcdbf] bg-white shadow-sm">
                            <div className="flex h-14 items-center gap-2 bg-[#e7f6fd] px-5">
                                <Camera className="size-5" />
                                <h2 className="text-lg font-extrabold">
                                    Foto Laporan Warga
                                </h2>
                            </div>
                            <div className="relative aspect-[1.55/1] min-h-[330px] overflow-hidden bg-slate-200 sm:aspect-[1.65/1]">
                                <Image
                                    src={
                                        report.foto_url ??
                                        "/images/dlh-dashboard-reference.png"
                                    }
                                    alt="Tumpukan sampah dari laporan warga"
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 65vw"
                                    unoptimized={Boolean(
                                        report.foto_url?.startsWith("data:"),
                                    )}
                                />
                                <div className="absolute bottom-6 left-6 rounded-2xl bg-white/80 px-5 py-3 shadow-lg backdrop-blur-sm">
                                    <p className="text-[11px] font-extrabold tracking-wide text-[#647169]">
                                        TIMESTAMP
                                    </p>
                                    <p className="mt-1 text-sm font-semibold sm:text-base">
                                        {f.date} {f.year}, {f.time}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[22px] border border-[#bdcdbf] bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-3">
                                <Clock3 className="mt-1 size-6 shrink-0 text-[#087529]" />
                                <h2 className="text-xl font-extrabold leading-tight">
                                    Estimasi
                                    <br />
                                    Penanganan
                                </h2>
                                <p className="ml-auto text-right text-lg font-extrabold text-[#087529]">
                                    ~120
                                    <br />
                                    Menit
                                </p>
                            </div>
                            <ol className="mt-7 pl-1">
                                {timeline.map(([label, time], index) => (
                                    <li
                                        key={label}
                                        className="relative flex min-h-[68px] gap-4 last:min-h-0"
                                    >
                                        {index < timeline.length - 1 && (
                                            <span className="absolute left-[15px] top-8 h-[37px] w-px bg-[#bdcdbf]" />
                                        )}
                                        <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 border-white bg-[#087529] text-white shadow-sm">
                                            <Check
                                                className="size-4"
                                                strokeWidth={3}
                                            />
                                        </span>
                                        <div>
                                            <p className="font-extrabold">
                                                {label}
                                            </p>
                                            <p className="text-xs text-[#7a877f]">
                                                {time}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </div>

                    <section className="mt-7 overflow-hidden rounded-[22px] border border-[#bdcdbf] bg-white shadow-sm">
                        <div className="flex h-14 items-center gap-2 bg-[#e7f6fd] px-5">
                            <MapPin className="size-5" />
                            <h2 className="text-lg font-extrabold">
                                Koordinat Lokasi
                            </h2>
                        </div>
                        <LeafletLocationMap
                            lat={latitude}
                            lng={longitude}
                            popup={report.address ?? report.location}
                            zoom={15}
                            height="h-[230px] sm:h-[270px]"
                        />
                        <div className="px-5 py-4">
                            <p className="font-extrabold">{detail.address}</p>
                            <p className="mt-1 text-xs text-[#66746c]">
                                {detail.district}
                            </p>
                        </div>
                    </section>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setUpdateOpen(true)}
                            className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#087529] px-8 font-extrabold text-white shadow-[0_8px_16px_rgba(8,117,41,0.18)] transition hover:bg-[#066321] sm:w-[310px]"
                        >
                            <Save className="size-5" />
                            Perbarui Laporan
                        </button>
                    </div>
                </div>
            </main>

            {updateOpen && (
                <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-4">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            saveUpdate();
                        }}
                        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
                    >
                        <div className="flex items-center">
                            <div>
                                <p className="text-xs font-extrabold text-[#087529]">
                                    PERBARUI LAPORAN
                                </p>
                                <h2 className="mt-1 text-xl font-extrabold">
                                    #{reportId}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setUpdateOpen(false)}
                                className="ml-auto rounded-full p-2 hover:bg-slate-100"
                                aria-label="Tutup"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <label className="mt-6 block text-sm font-bold">
                            Status Penanganan
                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value as typeof status,
                                    )
                                }
                                className="mt-2 h-12 w-full rounded-2xl border border-[#bdcdbf] bg-[#f5fbfe] px-4 outline-none focus:border-[#087529]"
                            >
                                <option>Menunggu</option>
                                <option>Diproses</option>
                                <option>Selesai</option>
                            </select>
                        </label>
                        <label className="mt-4 block text-sm font-bold">
                            Catatan
                            <textarea
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
                                rows={4}
                                placeholder="Tambahkan catatan operasional..."
                                className="mt-2 w-full resize-none rounded-2xl border border-[#bdcdbf] bg-[#f5fbfe] p-4 outline-none placeholder:text-[#89958e] focus:border-[#087529]"
                            />
                        </label>
                        <button
                            type="submit"
                            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#087529] font-extrabold text-white hover:bg-[#066321]"
                        >
                            <Save className="size-4" />
                            Simpan Perubahan
                        </button>
                    </form>
                </div>
            )}
        </DlhShell>
    );
}
