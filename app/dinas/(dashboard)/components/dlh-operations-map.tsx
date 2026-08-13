"use client";

import "leaflet/dist/leaflet.css";
import "@/lib/leaflet";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import L, { type Map as LeafletMap } from "leaflet";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { MapPin, Minus, Navigation, Plus, Recycle } from "lucide-react";
import type { DinasDispatchRoute, DinasReport } from "@/lib/services/dinas/types";
import { shortReportId, wasteTypeLabel } from "../../lib/report-helpers";
import { routeColorAt } from "../lib/route-colors";

const OPERATIONAL_CENTER: [number, number] = [-6.1754, 106.8272];

function reportPosition(report: DinasReport): [number, number] {
  return [report.lokasi_lat, report.lokasi_lng];
}

type DlhOperationsMapProps = {
  reports: DinasReport[];
  assignedReports?: DinasReport[];
  dispatchRoutes?: DinasDispatchRoute[];
  reportOpen: boolean;
  selectedReportId: string | null;
  onOpenReport: (id: string) => void;
  selectedPickupIds?: string[];
  onTogglePickup?: (id: string) => void;
};

export default function DlhOperationsMap({
  reports,
  assignedReports = [],
  dispatchRoutes = [],
  reportOpen,
  selectedReportId,
  onOpenReport,
  selectedPickupIds = [],
  onTogglePickup,
}: DlhOperationsMapProps) {
  const [view, setView] = useState<"heatmap" | "points">("heatmap");
  const [map, setMap] = useState<LeafletMap | null>(null);
  const fittedPointsKey = useRef("");

  const assignedRoutes = useMemo(() => {
    const groups = new Map<string, DinasReport[]>();
    for (const report of assignedReports) {
      const key = `${report.petugas_id ?? "none"}:${report.kendaraan_id ?? "none"}`;
      const group = groups.get(key) ?? [];
      group.push(report);
      groups.set(key, group);
    }
    return [...groups.entries()].map(([key, group]) => ({
      key,
      stops: group.sort(
        (a, b) =>
          (a.route_order ?? Number.MAX_SAFE_INTEGER) -
          (b.route_order ?? Number.MAX_SAFE_INTEGER),
      ),
      geometry: dispatchRoutes.find(
        (r) =>
          r.petugas_id === group[0]?.petugas_id &&
          r.kendaraan_id === group[0]?.kendaraan_id,
      )?.route_geometry ?? null,
    }));
  }, [assignedReports, dispatchRoutes]);
  const heatmapReports = useMemo(
    () => [...reports, ...assignedReports],
    [assignedReports, reports],
  );

  useEffect(() => {
    if (!map) return;

    const invalidate = () => map.invalidateSize({ animate: false });
    const frame = requestAnimationFrame(invalidate);
    const observer = new ResizeObserver(invalidate);
    observer.observe(map.getContainer());
    window.addEventListener("resize", invalidate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const frame = requestAnimationFrame(() => map.invalidateSize({ animate: false }));
    return () => cancelAnimationFrame(frame);
  }, [map, reportOpen]);

  useEffect(() => {
    if (!map) return;
    const allReports = [...reports, ...assignedReports];
    if (allReports.length === 0) return;
    const pointsKey = allReports.map((report) => report.id).sort().join(":");
    if (fittedPointsKey.current === pointsKey) return;
    fittedPointsKey.current = pointsKey;

    const bounds = L.latLngBounds(allReports.map(reportPosition));
    if (allReports.length === 1) map.setView(reportPosition(allReports[0]), 15);
    else map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
  }, [assignedReports, map, reports]);

  useEffect(() => {
    if (!map || !reportOpen || !selectedReportId) return;
    const selectedReport = reports.find((report) => report.id === selectedReportId);
    if (!selectedReport) return;

    const timeout = window.setTimeout(() => {
      map.flyTo(reportPosition(selectedReport), Math.max(map.getZoom(), 13), {
        animate: true,
        duration: 0.5,
      });
    }, 80);

    return () => window.clearTimeout(timeout);
  }, [map, reportOpen, reports, selectedReportId]);

  const selectedReport = reports.find((report) => report.id === selectedReportId);
  const isSelectedPickup = useCallback(
    (id: string) => selectedPickupIds.includes(id),
    [selectedPickupIds],
  );

  return (
    <section className="relative min-h-[420px] flex-1 overflow-hidden bg-[#dcecf2] lg:min-w-[430px]">
      <MapContainer
        center={OPERATIONAL_CENTER}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom
        className="absolute inset-0 size-full"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {view === "heatmap" &&
          heatmapReports.map((report) => {
            const center = reportPosition(report);
            const weight = report.kategori_ukuran === "BAHAYA" ? 1.25 : 1;
            return (
              <Fragment key={report.id}>
                <Circle center={center} radius={900 * weight} interactive={false} pathOptions={{ stroke: false, fillColor: "#facc15", fillOpacity: 0.3 }} />
                <Circle center={center} radius={550 * weight} interactive={false} pathOptions={{ stroke: false, fillColor: "#f97316", fillOpacity: 0.48 }} />
                <Circle center={center} radius={260 * weight} interactive={false} pathOptions={{ stroke: false, fillColor: "#dc2626", fillOpacity: 0.78 }} />
              </Fragment>
            );
          })}

        {view === "points" &&
          reports.map((report) => {
            const selected = isSelectedPickup(report.id);
            return (
              <CircleMarker
                key={report.id}
                center={reportPosition(report)}
                radius={selected ? 13 : 10}
                eventHandlers={onTogglePickup ? { click: () => onTogglePickup(report.id) } : undefined}
                pathOptions={{
                  color: selected ? "#facc15" : "#ffffff",
                  weight: selected ? 5 : 3,
                  fillColor: report.kategori_ukuran === "BAHAYA" ? "#dc2626" : "#087529",
                  fillOpacity: 1,
                }}
              >
                <Popup className="dlh-report-popup" minWidth={260} maxWidth={280}>
                  <div className="w-[260px] rounded-[24px] bg-white p-2.5 text-[#26362d]">
                    <div className="rounded-[18px] bg-gradient-to-br from-[#087529] to-[#159447] px-3.5 py-3 text-white shadow-[0_8px_18px_rgba(8,117,41,0.2)]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Titik Pickup</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm font-extrabold" title={report.id}>Laporan {shortReportId(report.id)}</p>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-extrabold ${report.status === "WAITING" ? "bg-amber-300 text-amber-950" : "bg-white/20 text-white"}`}>{report.status}</span>
                      </div>
                    </div>
                    <div className="space-y-2 px-1 pb-0.5 pt-2.5">
                      <div className="flex items-start gap-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e2f5ea] text-[#087529]"><MapPin className="size-3.5" /></span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#829087]">Alamat</p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#35453c]">{report.address_text ?? report.district ?? "Alamat belum tersedia"}</p>
                          {report.address_text && report.district && <p className="mt-0.5 text-xs text-[#75827b]">{report.district}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 border-t border-[#e7eee9] pt-2">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8f3f9] text-[#356d87]"><Navigation className="size-3.5" /></span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#829087]">Koordinat</p>
                          <p className="mt-1 truncate font-mono text-xs font-bold text-[#35453c]">{report.lokasi_lat.toFixed(5)}, {report.lokasi_lng.toFixed(5)}</p>
                        </div>
                      </div>
                      {report.waste_types.length > 0 && (
                        <div className="flex items-start gap-2.5 border-t border-[#e7eee9] pt-2">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fff0d9] text-[#9a6200]"><Recycle className="size-3.5" /></span>
                          <div className="flex flex-wrap gap-1.5 pt-1">{report.waste_types.map((type) => <span key={type} className="rounded-full bg-[#edf6f1] px-3 py-1 text-[11px] font-bold text-[#47705b]">{wasteTypeLabel(type)}</span>)}</div>
                        </div>
                      )}
                      <button type="button" onClick={(event) => { event.stopPropagation(); onOpenReport(report.id); }} className="mt-1 w-full rounded-full bg-[#087529] px-4 py-2.5 text-[11px] font-extrabold text-white transition hover:bg-[#066421]">Buka Detail Laporan</button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {assignedRoutes.map(({ stops: route, geometry }, routeIndex) => {
          const color = routeColorAt(routeIndex);
          const linePositions =
            geometry && geometry.length > 1
              ? geometry.map(([lng, lat]) => [lat, lng] as [number, number])
              : route.map(reportPosition);
          return (
          <Fragment key={`assigned-route-${routeIndex}`}>
            {linePositions.length > 1 && (
              <Polyline
                positions={linePositions}
                pathOptions={{ color, weight: 5, opacity: 0.85 }}
              />
            )}
            {route.map((report, index) => (
              <CircleMarker
                key={`assigned-${report.id}`}
                center={reportPosition(report)}
                radius={14}
                pathOptions={{ color: "#ffffff", weight: 4, fillColor: color, fillOpacity: 1 }}
              >
                <Tooltip permanent direction="top" offset={[0, -14]} className="dlh-selected-report-label">
                  Pickup {report.route_order ?? index + 1}
                </Tooltip>
                <Popup>
                  <strong>Pickup {report.route_order ?? index + 1}</strong><br />
                  {report.address_text ?? report.district ?? "Lokasi pickup"}<br />
                  Status: {report.status}
                </Popup>
              </CircleMarker>
            ))}
          </Fragment>
          );
        })}

        {selectedReport && (
          <>
            <Circle center={reportPosition(selectedReport)} radius={420} interactive={false} pathOptions={{ color: "#087529", weight: 3, dashArray: "8 7", fillColor: "#bcebd1", fillOpacity: 0.2 }} />
            <CircleMarker center={reportPosition(selectedReport)} radius={14} interactive={false} pathOptions={{ color: "#ffffff", weight: 5, fillColor: "#087529", fillOpacity: 1 }}>
              <Tooltip permanent direction="top" offset={[0, -14]} className="dlh-selected-report-label">Laporan dipilih • {shortReportId(selectedReport.id)}</Tooltip>
            </CircleMarker>
          </>
        )}
      </MapContainer>

      <div className="absolute left-5 top-5 z-[500] flex h-12 gap-1 rounded-full bg-white/90 p-1 text-xs shadow-md backdrop-blur sm:left-6 sm:h-[52px] sm:text-sm">
        <button type="button" onClick={() => setView("heatmap")} className={`min-w-[94px] rounded-full px-4 font-extrabold transition-colors sm:min-w-[108px] ${view === "heatmap" ? "bg-[#087529] text-white shadow" : "text-[#17231d] hover:bg-white"}`}>Heatmap</button>
        <button type="button" onClick={() => setView("points")} className={`min-w-[118px] rounded-full px-4 font-semibold transition-colors sm:min-w-[132px] ${view === "points" ? "bg-[#087529] text-white shadow" : "text-[#17231d] hover:bg-white"}`}>Titik Laporan</button>
      </div>

      <div className="absolute left-5 top-[84px] z-[500] grid gap-3 sm:left-6 sm:top-[88px]">
        <div className="grid gap-2 rounded-[26px] bg-white/80 p-2">
          <button type="button" onClick={() => map?.zoomIn()} aria-label="Perbesar peta" className="grid size-11 place-items-center rounded-full bg-[#f4faff] text-[#12232c] shadow transition hover:bg-white sm:size-12"><Plus className="size-6" /></button>
          <button type="button" onClick={() => map?.zoomOut()} aria-label="Perkecil peta" className="grid size-11 place-items-center rounded-full bg-[#f4faff] text-[#12232c] shadow transition hover:bg-white sm:size-12"><Minus className="size-6" /></button>
        </div>
      </div>

      {!reportOpen && (
        <button type="button" onClick={() => reports[0] && onOpenReport(reports[0].id)} disabled={!reports.length} className="absolute bottom-5 right-5 z-[500] flex items-center gap-2 rounded-full bg-[#087529] px-5 py-3 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
          <MapPin className="size-4" />{reports.length ? `Buka ${reports.length} laporan menunggu` : "Tidak ada laporan menunggu"}
        </button>
      )}
    </section>
  );
}
