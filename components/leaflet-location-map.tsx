"use client";

import "@/lib/leaflet"; // side-effect: fixes Leaflet default icon paths
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface LocationMapProps {
  lat: number;
  lng: number;
  popup?: string;
  zoom?: number;
  height?: string;
  scrollWheelZoom?: boolean;
  className?: string;
}

export default function LocationMap({
  lat,
  lng,
  popup,
  zoom = 16,
  height = "h-48",
  scrollWheelZoom = false,
  className = "",
}: LocationMapProps) {
  return (
    <div className={`w-full ${height} overflow-hidden ${className}`}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={scrollWheelZoom}
        dragging
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          {popup ? <Popup>{popup}</Popup> : null}
        </Marker>
      </MapContainer>
    </div>
  );
}
