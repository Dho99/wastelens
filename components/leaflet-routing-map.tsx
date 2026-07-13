"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { fetchRouteGeometry } from "@/lib/services/route-optimization";

interface Props {
  currentLat: number;
  currentLng: number;
  targetLat: number;
  targetLng: number;
}

function createIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 20px; height: 20px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

const blueIcon = createIcon("#3b82f6");
const redIcon = createIcon("#ef4444");

function MapBoundsUpdater({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(
        coords.map((c) => [c[1], c[0]] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, coords]);
  return null;
}

export default function LeafletRoutingMap({
  currentLat,
  currentLng,
  targetLat,
  targetLng,
}: Props) {
  const [routeData, setRouteData] = useState<{
    coordinates: [number, number][];
    distance: number;
    duration: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchRouteGeometry(
          { lat: currentLat, lng: currentLng },
          { lat: targetLat, lng: targetLng }
        );
        if (!cancelled) setRouteData(data);
      } catch {
        if (!cancelled) setError("Gagal memuat rute");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [currentLat, currentLng, targetLat, targetLng]);

  const center: [number, number] = [
    (currentLat + targetLat) / 2,
    (currentLng + targetLng) / 2,
  ];

  const polylinePositions: [number, number][] = routeData
    ? routeData.coordinates.map((c) => [c[1], c[0]])
    : [
        [currentLat, currentLng],
        [targetLat, targetLng],
      ];

  return (
    <div className="space-y-3">
      <div className="h-64 overflow-hidden rounded-xl border">
        <MapContainer
          center={center}
          zoom={14}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBoundsUpdater coords={routeData?.coordinates ?? [[currentLng, currentLat], [targetLng, targetLat]]} />

          <Marker position={[currentLat, currentLng]} icon={blueIcon}>
            <Popup>Lokasi Anda</Popup>
          </Marker>

          <Marker position={[targetLat, targetLng]} icon={redIcon}>
            <Popup>Lokasi Sampah</Popup>
          </Marker>

          <Polyline
            positions={polylinePositions}
            color={routeData ? "#3b82f6" : "#94a3b8"}
            weight={4}
            opacity={0.8}
            dashArray={routeData ? undefined : "10 6"}
          />
        </MapContainer>
      </div>

      {loading && (
        <p className="text-center text-xs text-neutral-400">Memuat rute...</p>
      )}

      {error && (
        <p className="text-center text-xs text-red-500">{error}</p>
      )}

      {routeData && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="font-medium text-neutral-700">
            Jarak: {(routeData.distance / 1000).toFixed(1)} KM
          </span>
          <span className="text-neutral-300">|</span>
          <span className="font-medium text-neutral-700">
            Estimasi: {Math.ceil(routeData.duration / 60)} Menit
          </span>
        </div>
      )}
    </div>
  );
}
