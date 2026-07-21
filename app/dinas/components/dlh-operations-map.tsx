"use client";

import "leaflet/dist/leaflet.css";
import "@/lib/leaflet";

import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import {
  Crosshair,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Recycle,
} from "lucide-react";
import type { DlhReport } from "@/lib/dlh-store";
import { shortReportId, wasteTypeLabel } from "@/app/dinas/lib/report-helpers";

const fallbackPositions: [number, number][] = [
  [-6.1754, 106.8272],
  [-6.1862, 106.8341],
  [-6.1928, 106.8239],
  [-6.1687, 106.8426],
  [-6.1817, 106.8148],
  [-6.2012, 106.8322],
];

function reportPosition(report: DlhReport, index: number): [number, number] {
  const coordinates = report.location.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/,
  );
  if (coordinates) return [Number(coordinates[1]), Number(coordinates[2])];
  return fallbackPositions[index % fallbackPositions.length];
}

export default function DlhOperationsMap({
  reports,
  reportOpen,
  selectedReportId,
  onOpenReport,
  selectedPickupIds = [],
  onTogglePickup,
}: {
  reports: DlhReport[];
  reportOpen: boolean;
  selectedReportId: string | null;
  onOpenReport: (id: string) => void;
  selectedPickupIds?: string[];
  onTogglePickup?: (id: string) => void;
}) {
  const [view, setView] = useState<"heatmap" | "points">("heatmap");
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [located, setLocated] = useState(false);
  const resizeRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!map) return;

    const invalidate = () => {
      map.invalidateSize({ animate: false });
    };

    const frame = requestAnimationFrame(invalidate);

    const container = map.getContainer();
    const observer = new ResizeObserver(invalidate);
    observer.observe(container);
    resizeRef.current = observer;

    window.addEventListener("resize", invalidate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", invalidate);
      resizeRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const frame = requestAnimationFrame(() =>
      map.invalidateSize({ animate: false }),
    );
    return () => cancelAnimationFrame(frame);
  }, [reportOpen, map]);

  useEffect(() => {
    if (!map || !reportOpen || !selectedReportId) return;
    const selectedIndex = reports.findIndex(
      (report) => report.id === selectedReportId,
    );
    if (selectedIndex < 0) return;

    const timeout = window.setTimeout(() => {
      map.flyTo(
        reportPosition(reports[selectedIndex], selectedIndex),
        Math.max(map.getZoom(), 13),
        { animate: true, duration: 0.5 },
      );
    }, 80);

    return () => window.clearTimeout(timeout);
  }, [map, reportOpen, reports, selectedReportId]);

  const selectedReportIndex = selectedReportId
    ? reports.findIndex((report) => report.id === selectedReportId)
    : -1;
  const selectedReport =
    selectedReportIndex >= 0 ? reports[selectedReportIndex] : undefined;

  const focusOperationalArea = () => {
    setLocated(true);
    map?.setView([-6.1754, 106.8272], 13, { animate: true });
  };

  const isSelectedPickup = useCallback(
    (id: string) => selectedPickupIds.includes(id),
    [selectedPickupIds],
  );

  const handleMarkerClick = useCallback(
    (id: string) => {
      onTogglePickup?.(id);
    },
    [onTogglePickup],
  );

  return (
    <section className="relative flex-1 overflow-hidden bg-[#dcecf2]">
      <MapContainer
        center={[-6.1754, 106.8272]}
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
          reports.map((report, index) => {
            const center = reportPosition(report, index);
            const weight = report.category === "BAHAYA" ? 1.25 : 1;

            return (
              <Fragment key={report.id}>
                <Circle
                  center={center}
                  radius={900 * weight}
                  interactive={false}
                  pathOptions={{
                    stroke: false,
                    fillColor: "#facc15",
                    fillOpacity: 0.3,
                  }}
                />
                <Circle
                  center={center}
                  radius={550 * weight}
                  interactive={false}
                  pathOptions={{
                    stroke: false,
                    fillColor: "#f97316",
                    fillOpacity: 0.48,
                  }}
                />
                <Circle
                  center={center}
                  radius={260 * weight}
                  interactive={false}
                  pathOptions={{
                    stroke: false,
                    fillColor: "#dc2626",
                    fillOpacity: 0.78,
                  }}
                />
              </Fragment>
            );
          })}
        {view === "points" &&
          reports.map((report, index) => (
            <CircleMarker
              key={report.id}
              center={reportPosition(report, index)}
              radius={10}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: report.category === "BAHAYA" ? "#dc2626" : "#087529",
                fillOpacity: 1,
              }}
            >
              <Popup className="dlh-report-popup" minWidth={260} maxWidth={280}>
                <div className="w-[260px] rounded-[24px] bg-white p-2.5 text-[#26362d]">
                  <div className="rounded-[18px] bg-gradient-to-br from-[#087529] to-[#159447] px-3.5 py-3 pr-8 text-white shadow-[0_8px_18px_rgba(8,117,41,0.2)]">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/70">
                      Titik Pickup
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <p
                        className="min-w-0 flex-1 truncate text-sm font-extrabold"
                        title={report.id}
                      >
                        Laporan {shortReportId(report.id)}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-extrabold ${report.status === "Menunggu" ? "bg-amber-300 text-amber-950" : "bg-white/20 text-white"}`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 px-1 pb-0.5 pt-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e2f5ea] text-[#087529]">
                        <MapPin className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#729080]">
                          Alamat
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold leading-4">
                          {report.address ??
                            report.district ??
                            "Alamat belum tersedia"}
                        </p>
                        {report.address && report.district && (
                          <p className="mt-0.5 text-[9px] text-[#688075]">
                            {report.district}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 border-t border-[#e7eee9] pt-2">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8f3f9] text-[#356d87]">
                        <Navigation className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#718995]">
                          Koordinat
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[10px] font-bold text-[#31576a]">
                          {report.latitude !== undefined &&
                          report.longitude !== undefined
                            ? `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`
                            : report.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 border-t border-[#e7eee9] pt-2">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8f3f9] text-[#356d87]">
                          <Navigation className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#829087]">
                            Koordinat
                          </p>
                          <p className="mt-1 truncate font-mono text-xs font-bold text-[#35453c]">
                            {report.latitude !== undefined &&
                            report.longitude !== undefined
                              ? `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`
                              : report.location}
                          </p>
                        </div>
                      </div>
                      {Boolean(report.wasteTypes?.length) && (
                        <div className="flex items-start gap-2.5 border-t border-[#e7eee9] pt-2">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fff0d9] text-[#9a6200]">
                            <Recycle className="size-3.5" />
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {report.wasteTypes?.map((type) => (
                              <span
                                key={type}
                                className="rounded-full bg-[#edf6f1] px-3 py-1 text-[11px] font-bold text-[#47705b]"
                              >
                                {wasteTypeLabel(type)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenReport(report.id)}
                        className="mt-1 w-full rounded-full bg-[#087529] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-[0_6px_14px_rgba(8,117,41,0.18)] transition hover:bg-[#066421]"
                      >
                        Buka Detail Laporan
                      </button>
                    </div>
                    {Boolean(report.wasteTypes?.length) && (
                      <div className="flex items-start gap-2.5 border-t border-[#e7eee9] pt-2">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fff0d9] text-[#9a6200]">
                          <Recycle className="size-3.5" />
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {report.wasteTypes?.map((type) => (
                            <span
                              key={type}
                              className="rounded-full bg-[#fff0d9] px-2 py-1 text-[9px] font-bold text-[#8a5900]"
                            >
                              {wasteTypeLabel(type)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenReport(report.id)}
                      className="mt-1 w-full rounded-full bg-[#087529] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-[0_6px_14px_rgba(8,117,41,0.18)] transition hover:bg-[#066421]"
                    >
                      Buka Detail Laporan
                    </button>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {selectedReport && (
          <>
            <Circle
              center={reportPosition(selectedReport, selectedReportIndex)}
              radius={420}
              interactive={false}
              pathOptions={{
                color: "#087529",
                weight: 3,
                dashArray: "8 7",
                fillColor: "#bcebd1",
                fillOpacity: 0.2,
              }}
            />
            <CircleMarker
              center={reportPosition(selectedReport, selectedReportIndex)}
              radius={14}
              interactive={false}
              pathOptions={{
                color: "#ffffff",
                weight: 5,
                fillColor: "#087529",
                fillOpacity: 1,
              }}
            >
              <Tooltip
                permanent
                direction="top"
                offset={[0, -14]}
                className="dlh-selected-report-label"
              >
                Laporan dipilih • {shortReportId(selectedReport.id)}
              </Tooltip>
            </CircleMarker>
          </>
        )}
      </MapContainer>

      <div className="absolute left-5 top-5 z-[500] flex h-12 gap-1 rounded-full bg-white/90 p-1 text-xs shadow-md backdrop-blur sm:left-6 sm:h-[52px] sm:text-sm">
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

      <div className="absolute left-5 top-[84px] z-[500] grid gap-3 sm:left-6 sm:top-[88px]">
        <div className="grid gap-2 rounded-[26px] bg-white/80 p-2">
          <button
            type="button"
            onClick={() => map?.zoomIn()}
            aria-label="Perbesar peta"
            className="grid size-11 place-items-center rounded-full bg-[#f4faff] text-[#12232c] shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition hover:bg-white sm:size-12"
          >
            <Plus className="size-6" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => map?.zoomOut()}
            aria-label="Perkecil peta"
            className="grid size-11 place-items-center rounded-full bg-[#f4faff] text-[#12232c] shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition hover:bg-white sm:size-12"
          >
            <Minus className="size-6" strokeWidth={2.2} />
          </button>
        </div>
        <div className="rounded-[26px] bg-white/80 p-2">
          <button
            type="button"
            onClick={focusOperationalArea}
            aria-pressed={located}
            aria-label="Fokus wilayah operasional"
            className={`grid size-11 place-items-center rounded-full shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition sm:size-12 ${located ? "bg-[#087529] text-white" : "bg-[#f4faff] text-[#12232c] hover:bg-white"}`}
          >
            <Crosshair className="size-6" strokeWidth={2.3} />
          </button>
        </div>
      </div>

      {!reportOpen && (
        <button
          type="button"
          onClick={() => reports[0] && onOpenReport(reports[0].id)}
          disabled={!reports.length}
          className="absolute bottom-5 right-5 z-[500] flex items-center gap-2 rounded-full bg-[#087529] px-5 py-3 text-sm font-bold text-white shadow-lg"
        >
          <MapPin className="size-4" />{" "}
          {reports.length
            ? `Buka ${reports.length} laporan menunggu`
            : "Tidak ada laporan menunggu"}
        </button>
      )}
    </section>
  );
}
