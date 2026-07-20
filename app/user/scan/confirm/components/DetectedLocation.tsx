"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapView({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

interface DetectedLocationProps {
  address: string;
  latitude: number;
  longitude: number;
}

export const DetectedLocation: React.FC<DetectedLocationProps> = ({
  address,
  latitude,
  longitude,
}) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        {/* Header detail */}
        <div className="flex gap-3.5 items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E2ECE4] border border-[#d6ebd9] flex items-center justify-center text-[#1E7D38] shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              Lokasi Terdeteksi
            </span>
            <p className="text-sm font-extrabold text-gray-800 leading-snug">
              {address}
            </p>
          </div>
        </div>

        {/* Map View Frame */}
        <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            className="w-full h-full"
            zoomControl={true}
            scrollWheelZoom={true}
            dragging={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapView lat={latitude} lng={longitude} />
            <Marker position={[latitude, longitude]} icon={markerIcon} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
