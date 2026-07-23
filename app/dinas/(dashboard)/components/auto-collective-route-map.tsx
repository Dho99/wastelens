"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import type { AutoCollectiveRoute } from "../../types/auto-collective";

interface Props {
  route: AutoCollectiveRoute;
  color: string;
}

function FitRouteBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 15, { animate: false });
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [28, 28], animate: false });
  }, [map, positions]);

  return null;
}

function numberedMarker(number: number, color: string) {
  return L.divIcon({
    className: "auto-collective-numbered-marker",
    html: `<span style="display:grid;place-items:center;width:28px;height:28px;border-radius:9999px;background:${color};color:white;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35);font:700 12px system-ui">${number}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export function AutoCollectiveRouteMap({ route, color }: Props) {
  const stopPositions = useMemo(
    () => route.stops.map((stop) => [stop.lat, stop.lng] as [number, number]),
    [route.stops],
  );
  const routePositions = useMemo(
    () => (route.routeGeometry.length > 1
      ? route.routeGeometry.map(([lng, lat]) => [lat, lng] as [number, number])
      : stopPositions),
    [route.routeGeometry, stopPositions],
  );
  const center = stopPositions[0] ?? [-6.9175, 107.6191] as [number, number];

  return (
    <div className="relative h-56 overflow-hidden border-b border-neutral-200 bg-sky-50">
      <MapContainer center={center} zoom={13} zoomControl={false} scrollWheelZoom className="size-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitRouteBounds positions={routePositions.length > 0 ? routePositions : stopPositions} />
        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color,
              weight: 5,
              opacity: 0.9,
              dashArray: route.routingSource === "HAVERSINE" ? "10 8" : undefined,
            }}
          />
        )}
        {route.stops.map((stop, index) => (
          <Marker
            key={stop.reportId}
            position={[stop.lat, stop.lng]}
            icon={numberedMarker(index + 1, color)}
          >
            <Popup>
              <strong>Pickup {index + 1}</strong><br />
              {stop.address ?? `${stop.lat.toFixed(5)}, ${stop.lng.toFixed(5)}`}<br />
              {stop.estimatedLoadKg} kg
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <span className="pointer-events-none absolute bottom-2 left-2 z-[500] rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-neutral-600 shadow">
        {route.routingSource === "OSRM" ? "Mengikuti jalan" : "Estimasi garis lurus"}
      </span>
    </div>
  );
}
