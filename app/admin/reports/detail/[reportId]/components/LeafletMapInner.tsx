"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface LeafletMapInnerProps {
  lat: number;
  lng: number;
}

// Custom vivid green Leaflet marker icon
const greenIcon = L.divIcon({
  className: "custom-green-pin",
  html: `<div style="background-color: #287A38; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
          <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
        </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function MapCenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export default function LeafletMapInner({ lat, lng }: LeafletMapInnerProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      className="w-full h-full rounded-xl select-none"
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenterUpdater lat={lat} lng={lng} />
      <Marker position={[lat, lng]} icon={greenIcon} />
    </MapContainer>
  );
}
