"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Icon from "@mdi/react";
import {
    mdiMapMarkerPath,
    mdiTimerOutline,
    mdiFilterVariant,
    mdiClockOutline,
    mdiChevronRight,
    mdiAlertOutline,
    mdiClipboardText,
} from "@mdi/js";
import { usePetugasDashboard } from "./hooks/useDashboard";
import type { DashboardTask } from "./types/dashboard";

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Menunggu Diproses",
    DIPROSES: "Sedang Diproses",
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam`;
    const days = Math.floor(hours / 24);
    return `${days} hari`;
}

function formatWasteTypes(types: string[]): string {
    if (!types.length) return "Campuran";
    return types.join(", ");
}

export default function PetugasDashboardPage() {
    const router = useRouter();
    const { data, isLoading, isError, error, refetch } = usePetugasDashboard();

    // --- Loading state ---
    if (isLoading) {
        return (
            <div className="min-h-screen pb-8">
                <div className="space-y-6 py-4">
                    <div className="h-32 animate-pulse rounded-xl bg-neutral-100" />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
                        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-28 animate-pulse rounded-2xl bg-neutral-100"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // --- Error state ---
    if (isError || !data) {
        return (
            <div className="min-h-screen pb-8">
                <div className="py-8 text-center">
                    <p className="text-sm font-medium text-red-800">
                        {error instanceof Error
                            ? error.message
                            : "Gagal memuat dashboard"}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    const { total_tasks, selesai_hari_ini, tersisa, recent_tasks } = data;

    // --- Empty state ---
    if (recent_tasks.length === 0) {
        return (
            <div className="min-h-screen pb-8">
                <div className="space-y-6 py-4">
                    {/* Summary Card */}
                    <div className="relative overflow-hidden rounded-xl bg-primary p-5 text-white shadow-sm">
                        <div className="relative z-10">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-50">
                                Tugas Hari Ini
                            </p>
                            <h2 className="mb-1 text-3xl font-bold leading-tight">
                                0 Lokasi
                            </h2>
                            <p className="text-[13px] font-medium text-emerald-50">
                                {selesai_hari_ini} Selesai &bull; 0 Tersisa
                            </p>
                        </div>
                        <Icon
                            path={mdiClipboardText}
                            size={4}
                            className="absolute -bottom-10 -right-8 opacity-30"
                        />
                    </div>

                    <div className="rounded-xl border-2 border-dashed border-neutral-200 p-8 text-center">
                        <p className="text-sm font-medium text-neutral-500">
                            Tidak ada tugas saat ini
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                            Tugas baru akan muncul setelah ditugaskan oleh Dinas
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-8">
            <div className="space-y-6 py-4">
                {/* Summary section */}
                <section className="space-y-3">
                    {/* Main Card */}
                    <div className="relative overflow-hidden rounded-xl bg-primary p-5 text-white shadow-sm">
                        <div className="relative z-10">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-50">
                                Tugas Hari Ini
                            </p>
                            <h2 className="mb-1 text-3xl font-bold leading-tight">
                                {total_tasks} Lokasi
                            </h2>
                            <p className="text-[13px] font-medium text-emerald-50">
                                {selesai_hari_ini} Selesai &bull; {tersisa}{" "}
                                Tersisa
                            </p>
                        </div>
                        <Icon
                            path={mdiClipboardText}
                            size={4}
                            className="absolute -bottom-10 -right-8 opacity-30"
                        />
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col justify-center rounded-xl border border-neutral-300 bg-primary/10 p-4">
                            <Icon
                                path={mdiMapMarkerPath}
                                className="mb-2 h-5 w-5 text-neutral-500"
                            />
                            <p className="mb-0.5 text-[11px] font-medium text-neutral-500">
                                Total Tugas
                            </p>
                            <p className="text-[17px] font-bold text-[#205c48]">
                                {total_tasks}
                            </p>
                        </div>
                        <div className="flex flex-col justify-center rounded-xl border border-neutral-300 bg-primary/10 p-4">
                            <Icon
                                path={mdiTimerOutline}
                                className="mb-2 h-5 w-5 text-accent"
                            />
                            <p className="mb-0.5 text-[11px] font-medium text-neutral-500">
                                Selesai Hari Ini
                            </p>
                            <p className="text-[17px] font-bold text-accent">
                                {selesai_hari_ini}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Task List Section */}
                <section>
                    <div className="mb-3 flex items-center justify-between px-1">
                        <h3 className="text-[17px] font-bold text-neutral-800">
                            Antrean Tugas
                        </h3>
                        <button className="flex items-center gap-1 text-[13px] font-semibold text-[#388e3c]">
                            Urutkan{" "}
                            <Icon path={mdiFilterVariant} className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recent_tasks.map((task, i) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                first={i === 0}
                                router={router}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function TaskCard({
    task,
    first,
    router,
}: {
    task: DashboardTask;
    first: boolean;
    router: ReturnType<typeof useRouter>;
}) {
    const isHighPriority =
        task.priority_level === "HIGH" || task.priority_level === "CRITICAL";

    return (
        <div
            className={`overflow-hidden rounded-2xl bg-white ${first ? "border border-accent" : ""}`}
        >
            <div className="flex gap-3 p-3">
                {/* Image */}
                <div className="relative h-25 w-25 shrink-0 overflow-hidden rounded-xl">
                    {isHighPriority && (
                        <span className="absolute left-0 top-0 z-10 flex items-center gap-1 rounded-br-lg bg-[#d32f2f] px-1.5 py-0.5 text-[9px] font-bold text-white">
                            <Icon
                                path={mdiAlertOutline}
                                className="h-2.5 w-2.5"
                            />{" "}
                            Prioritas Tinggi
                        </span>
                    )}
                    <Image
                        src={task.foto_url || "/images/waste_bags_stack.png"}
                        alt="Sampah"
                        className="h-full w-full object-cover"
                        width={200}
                        height={200}
                    />
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col py-0.5">
                    <div className="mb-1 flex items-start justify-between gap-2">
                        <h4 className="text-[15px] font-bold leading-tight text-neutral-800 line-clamp-2">
                            {task.address}
                        </h4>
                    </div>
                    <div className="mb-auto flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[#c8e6c9] px-2 py-0.5 text-[10px] font-bold text-[#2e7d32]">
                            {STATUS_LABEL[task.status] ?? task.status}
                        </span>
                        <span className="rounded-full bg-[#e2e8f0] px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                            {formatWasteTypes(task.waste_types)}
                        </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                        <Icon path={mdiClockOutline} className="h-3.5 w-3.5" />{" "}
                        {timeAgo(task.createdAt)} lalu
                    </div>
                </div>
            </div>

            <div className="px-3 pb-3 pt-1">
                <button
                    onClick={() => router.push(`/petugas/tasks/${task.id}`)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white"
                >
                    Mulai Tugas{" "}
                    <Icon path={mdiChevronRight} className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
