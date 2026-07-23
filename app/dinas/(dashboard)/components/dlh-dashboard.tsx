"use client";

import dynamic from "next/dynamic";
import { type ComponentType, useState, useCallback } from "react";
import { Route, Loader2 } from "lucide-react";
import { DlhShell } from "../../components/dlh-shell";
import { useDashboardData } from "../hooks/useDashboard";
import type { DinasReport } from "@/lib/services/dinas/types";
import { ReportPanel } from "./report-panel";
import { AutoCollectiveModal } from "./auto-collective-modal";

type MapCanvasProps = {
    reports: DinasReport[];
    assignedReports: DinasReport[];
    dispatchRoutes?: import("@/lib/services/dinas/types").DinasDispatchRoute[];
    reportOpen: boolean;
    selectedReportId: string | null;
    onOpenReport: (id: string) => void;
    selectedPickupIds: string[];
    onTogglePickup: (id: string) => void;
};

const MapCanvas = dynamic<MapCanvasProps>(
    () =>
        import("./dlh-operations-map").then((mod) => {
            const mapModule = mod as unknown as {
                default?: ComponentType<MapCanvasProps>;
                DlhOperationsMap?: ComponentType<MapCanvasProps>;
            };
            return mapModule.default ?? mapModule.DlhOperationsMap!;
        }),
    {
        ssr: false,
        loading: () => (
            <section
                className="absolute inset-0 h-full w-full animate-pulse bg-[#dcecf2]"
                aria-label="Memuat peta operasional"
            />
        ),
    },
);

export function DlhDashboard() {
    const { data: dashboard } = useDashboardData();
    const activeReports = (dashboard?.activeReports ?? []).filter(
        (report) =>
            (report.status === "ANALYZED" || report.status === "WAITING") &&
            !report.petugas_id &&
            !report.kendaraan_id,
    );
    const assignedReports = dashboard?.assignedReports ?? [];

    const [selectedReportId, setSelectedReportId] = useState<string | null>(
        null,
    );
    const [selectedPickupIds, setSelectedPickupIds] = useState<string[]>([]);
    const [autoCollectiveOpen, setAutoCollectiveOpen] = useState(false);
    const [expandingNeighbors, setExpandingNeighbors] = useState(false);

    const selectedReport = activeReports.find(
        (report) => report.id === selectedReportId,
    );
    const reportOpen = Boolean(selectedReport);

    const expandNeighbors = useCallback(async (id: string) => {
        setExpandingNeighbors(true);
        try {
            const res = await fetch("/api/dinas/auto-collective/neighbors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId: id }),
            });
            const data = await res.json();
            if (data.success && data.data.neighborIds.length > 0) {
                setSelectedPickupIds((current) => {
                    const combined = new Set(current);
                    for (const nid of data.data.neighborIds) {
                        combined.add(nid);
                    }
                    return [...combined];
                });
            } else {
                setSelectedPickupIds((current) =>
                    current.includes(id) ? current : [...current, id],
                );
            }
        } catch {
            setSelectedPickupIds((current) =>
                current.includes(id) ? current : [...current, id],
            );
        } finally {
            setExpandingNeighbors(false);
        }
    }, []);

    const handleOpenReport = (id: string) => {
        setSelectedReportId(id);
        if (!selectedPickupIds.includes(id)) {
            expandNeighbors(id);
        }
    };

    const handleTogglePickup = (id: string) => {
        if (selectedPickupIds.includes(id)) {
            setSelectedPickupIds((current) =>
                current.filter((item) => item !== id),
            );
        } else {
            expandNeighbors(id);
        }
    };

    const handleOpenCollective = () => {
        if (selectedPickupIds.length > 0) {
            setAutoCollectiveOpen(true);
            setSelectedReportId(null);
        }
    };

    return (
        <DlhShell>
            <main className="relative flex min-h-0 flex-1 items-stretch overflow-hidden">
                <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden bg-[#dcecf2]">
                    <MapCanvas
                        reports={activeReports}
                        assignedReports={assignedReports}
                        dispatchRoutes={dashboard?.dispatchRoutes ?? []}
                        reportOpen={reportOpen}
                        selectedReportId={selectedReportId}
                        onOpenReport={handleOpenReport}
                        selectedPickupIds={selectedPickupIds}
                        onTogglePickup={handleTogglePickup}
                    />

                    {selectedPickupIds.length > 0 && (
                        <button
                            type="button"
                            onClick={handleOpenCollective}
                            disabled={expandingNeighbors}
                            className="absolute right-4 top-4 z-[1000] flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95 disabled:cursor-wait disabled:bg-emerald-400"
                        >
                            {expandingNeighbors ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Route className="size-4" />
                            )}
                            Buat Rute Otomatis
                            <span className="ml-0.5 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                {selectedPickupIds.length}
                            </span>
                        </button>
                    )}
                </div>

                {reportOpen && selectedReport && (
                    <ReportPanel
                        report={selectedReport}
                        vehicles={dashboard?.vehicles ?? []}
                        officers={dashboard?.officers ?? []}
                        onClose={() => setSelectedReportId(null)}
                    />
                )}
            </main>

            {autoCollectiveOpen && (
                <AutoCollectiveModal
                    selectedPickupIds={selectedPickupIds}
                    onClose={() => setAutoCollectiveOpen(false)}
                />
            )}
        </DlhShell>
    );
}
