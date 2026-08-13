"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { TaskItem } from "@/lib/services/petugas-task";
import "leaflet/dist/leaflet.css";

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 15);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [24, 24] });
  }, [map, positions]);
  return null;
}

function numberedIcon(n: number, color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};color:#fff;width:26px;height:26px;border-radius:999px;display:grid;place-items:center;font:700 11px/1 sans-serif;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)">${n}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export function TaskRouteMap({
  tasks,
  color,
  routeGeometry,
}: {
  tasks: TaskItem[];
  color: string;
  routeGeometry: [number, number][] | null;
}) {
  const stopPositions = tasks.map(
    (t) => [t.lokasi_lat, t.lokasi_lng] as [number, number],
  );
  const linePositions =
    routeGeometry && routeGeometry.length > 1
      ? routeGeometry.map(([lng, lat]) => [lat, lng] as [number, number])
      : stopPositions;

  if (stopPositions.length === 0) return null;

  return (
    <div className="h-48 overflow-hidden rounded-xl border border-neutral-200">
      <MapContainer
        center={stopPositions[0]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds positions={linePositions.length > 0 ? linePositions : stopPositions} />
        {linePositions.length > 1 && (
          <Polyline
            positions={linePositions}
            pathOptions={{ color, weight: 4, opacity: 0.9 }}
          />
        )}
        {tasks.map((task, index) => (
          <Marker
            key={task.id}
            position={[task.lokasi_lat, task.lokasi_lng]}
            icon={numberedIcon(task.route_order ?? index + 1, color)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
