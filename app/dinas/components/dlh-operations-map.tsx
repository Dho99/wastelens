"use client";

import { Fragment, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { Circle, CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Crosshair, MapPin, Minus, Plus } from "lucide-react";
import type { DlhReport } from "@/lib/dlh-store";

const fallbackPositions: [number, number][] = [
  [-6.1754, 106.8272],
  [-6.1862, 106.8341],
  [-6.1928, 106.8239],
  [-6.1687, 106.8426],
  [-6.1817, 106.8148],
  [-6.2012, 106.8322],
];

function reportPosition(report: DlhReport, index: number): [number, number] {
  const coordinates = report.location.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (coordinates) return [Number(coordinates[1]), Number(coordinates[2])];
  return fallbackPositions[index % fallbackPositions.length];
}

export default function DlhOperationsMap({
  reports,
  reportOpen,
  onOpenReport,
}: {
  reports: DlhReport[];
  reportOpen: boolean;
  onOpenReport: (id: string) => void;
}) {
  const [view, setView] = useState<"heatmap" | "points">("heatmap");
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [located, setLocated] = useState(false);

  const focusOperationalArea = () => {
    setLocated(true);
    map?.setView([-6.1754, 106.8272], 13, { animate: true });
  };

  return (
    <section className="relative min-h-[420px] flex-1 overflow-hidden bg-[#dcecf2] lg:min-w-[430px]">
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
        {view === "heatmap" && reports.map((report, index) => {
          const center = reportPosition(report, index);
          const weight = report.category === "BAHAYA" ? 1.25 : 1;

          return (
            <Fragment key={report.id}>
              <Circle
                center={center}
                radius={2600 * weight}
                interactive={false}
                pathOptions={{ stroke: false, fillColor: "#fde047", fillOpacity: 0.2 }}
              />
              <Circle
                center={center}
                radius={1700 * weight}
                interactive={false}
                pathOptions={{ stroke: false, fillColor: "#f97316", fillOpacity: 0.28 }}
              />
              <Circle
                center={center}
                radius={750 * weight}
                interactive={false}
                pathOptions={{ stroke: false, fillColor: "#dc2626", fillOpacity: 0.52 }}
              />
            </Fragment>
          );
        })}
        {view === "points" && reports.map((report, index) => (
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
            <Popup>
              <div className="min-w-40">
                <p className="font-bold">Laporan #{report.id}</p>
                <p className="mt-1 text-xs">{report.location}</p>
                <button type="button" onClick={() => onOpenReport(report.id)} className="mt-2 font-bold text-[#087529]">
                  Buka laporan
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
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
          <button type="button" onClick={() => map?.zoomIn()} aria-label="Perbesar peta" className="grid size-11 place-items-center rounded-full bg-[#f4faff] text-[#12232c] shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition hover:bg-white sm:size-12"><Plus className="size-6" strokeWidth={2.2} /></button>
          <button type="button" onClick={() => map?.zoomOut()} aria-label="Perkecil peta" className="grid size-11 place-items-center rounded-full bg-[#f4faff] text-[#12232c] shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition hover:bg-white sm:size-12"><Minus className="size-6" strokeWidth={2.2} /></button>
        </div>
        <div className="rounded-[26px] bg-white/80 p-2">
          <button type="button" onClick={focusOperationalArea} aria-pressed={located} aria-label="Fokus wilayah operasional" className={`grid size-11 place-items-center rounded-full shadow-[0_2px_5px_rgba(50,64,56,0.2)] transition sm:size-12 ${located ? "bg-[#087529] text-white" : "bg-[#f4faff] text-[#12232c] hover:bg-white"}`}>
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
          <MapPin className="size-4" /> {reports.length ? `Buka ${reports.length} laporan aktif` : "Tidak ada laporan aktif"}
        </button>
      )}
    </section>
  );
}
