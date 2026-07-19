"use client";

import { useState, useCallback } from "react";
import { MapPin, Crosshair, AlertTriangle, RefreshCw, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";
import type { DeviceLocation, ConfirmedLocation } from "../types/scan.types";

const MapWithMarker = dynamic(
  () => import("./MapWithMarker"),
  { ssr: false, loading: () => <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" /> },
);

type Props = {
  onLocationConfirmed: (device: DeviceLocation, confirmed: ConfirmedLocation) => void;
  onError: (message: string) => void;
};

export function LocationConfirmation({ onLocationConfirmed, onError }: Props) {
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocation | null>(null);
  const [confirmedPosition, setConfirmedPosition] = useState<ConfirmedLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      onError("Browser tidak mendukung GPS");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: DeviceLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
          capturedAt: new Date().toISOString(),
        };
        setDeviceLocation(loc);
        setConfirmedPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let msg = "Gagal mendapatkan lokasi";
        if (error.code === error.PERMISSION_DENIED) msg = "Akses lokasi ditolak";
        else if (error.code === error.TIMEOUT) msg = "Waktu permintaan lokasi habis";
        onError(msg);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10_000,
      },
    );
  }, [onError]);

  const handleConfirm = () => {
    if (!deviceLocation || !confirmedPosition) return;
    onLocationConfirmed(deviceLocation, confirmedPosition);
  };

  const handleMarkerDrag = (lat: number, lng: number) => {
    setConfirmedPosition({ latitude: lat, longitude: lng });
  };

  if (!deviceLocation) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#E2ECE4] flex items-center justify-center mx-auto">
            <MapPin className="w-7 h-7 text-[#287A38]" />
          </div>
          <p className="text-sm font-semibold text-gray-600">
            Aktifkan lokasi untuk mengirim laporan
          </p>
        </div>
        <button
          onClick={requestLocation}
          disabled={isLocating}
          className="w-full bg-[#287A38] hover:bg-[#20632d] text-white font-bold text-sm py-3.5 rounded-full transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Crosshair className="w-4 h-4" />
          {isLocating ? "Mengakses GPS..." : "Ambil Lokasi Saya"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="h-48">
          <MapWithMarker
            latitude={deviceLocation.latitude}
            longitude={deviceLocation.longitude}
            onMarkerDrag={handleMarkerDrag}
          />
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi Perangkat</span>
            <button
              onClick={requestLocation}
              disabled={isLocating}
              className="text-xs font-bold text-[#287A38] hover:text-[#1e6329] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Ambil Ulang
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-700 bg-gray-50 rounded-xl p-3">
            <div>
              <span className="text-gray-400">Lat: </span>
              {deviceLocation.latitude.toFixed(6)}
            </div>
            <div>
              <span className="text-gray-400">Lng: </span>
              {deviceLocation.longitude.toFixed(6)}
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">Akurasi: </span>
              {deviceLocation.accuracyMeters.toFixed(1)} m
            </div>
          </div>
          {deviceLocation.accuracyMeters > 150 && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-semibold text-amber-700">
                Akurasi lokasi rendah ({deviceLocation.accuracyMeters.toFixed(0)}m). Coba ambil ulang di tempat terbuka.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Geser marker untuk menyesuaikan titik</span>
            {confirmedPosition && (
              <span className="text-gray-500">
                ({confirmedPosition.latitude.toFixed(6)}, {confirmedPosition.longitude.toFixed(6)})
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={isLocating || deviceLocation.accuracyMeters > 150}
        className="w-full bg-[#287A38] hover:bg-[#20632d] text-white font-bold text-sm py-3.5 rounded-full transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        Konfirmasi Lokasi
      </button>
      {deviceLocation.accuracyMeters > 150 && (
        <p className="text-xs text-center text-amber-600 font-semibold">
          Akurasi terlalu rendah. Ambil ulang lokasi untuk melanjutkan.
        </p>
      )}
    </div>
  );
}
