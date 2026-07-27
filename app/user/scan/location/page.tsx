"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { ErrorBoundary } from "@/components/error-boundary";

export default function LocationPermissionPage() {
  const router = useRouter();
  const { setHideTabBar } = useTabBar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "granted" | "denied" | "error" | "unsupported">("idle");
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [manualLat, setManualLat] = useState("-6.200000");
  const [manualLng, setManualLng] = useState("106.816666");

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  async function extractExifFromFile(file: File) {
    try {
      const exifr = await import("exifr");
      const gps = await exifr.default.gps(file);
      return {
        latitude: gps?.latitude ?? null,
        longitude: gps?.longitude ?? null,
        timestamp: null,
      };
    } catch {
      return { latitude: null, longitude: null, timestamp: null };
    }
  }

  async function getStoredFile(): Promise<File | null> {
    return null;
  }

  const saveLocationAndProceed = async (
    lat: number, lng: number, accuracy: number, capturedAt: string,
    address: string | null,
  ) => {
    const metaRaw = localStorage.getItem("scan_meta");
    if (!metaRaw) {
      router.push("/user/scan");
      return;
    }

    const meta = JSON.parse(metaRaw);
    const exifLocation: { latitude: number | null; longitude: number | null; timestamp: string | null } = { latitude: null, longitude: null, timestamp: null };

    if (fileInputRef.current?.files?.[0]) {
      const exif = await extractExifFromFile(fileInputRef.current.files[0]);
      exifLocation.latitude = exif.latitude;
      exifLocation.longitude = exif.longitude;
    }

    const confirmData = {
      address,
      browserLocation: {
        latitude: lat,
        longitude: lng,
        accuracyMeters: accuracy,
        capturedAt,
      },
      exifLocation,
      confirmedLatitude: lat,
      confirmedLongitude: lng,
      sizeCategory: meta.classificationResult?.sizeCategory ?? "UNCERTAIN",
    };

    localStorage.setItem("scan_meta", JSON.stringify({
      ...meta,
      reportConfirmData: confirmData,
    }));

    router.push("/user/scan/confirm");
  };

  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus("unsupported");
      return;
    }

    setGpsStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setGpsStatus("granted");
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const capturedAt = new Date().toISOString();

        await saveLocationAndProceed(lat, lng, accuracy, capturedAt, null);
      },
      () => {
        setGpsStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSaveManualLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;

    const capturedAt = new Date().toISOString();
    const manLat = parseFloat(manualLat);
    const manLng = parseFloat(manualLng);

    await saveLocationAndProceed(manLat, manLng, 0, capturedAt, manualAddress.trim() || null);
    setShowManualModal(false);
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen max-w-screen-sm mx-auto w-full bg-[#FAF9F5] flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none select-none">
          <Image
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80"
            alt="Maps backdrop"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 flex items-center justify-between px-5 pt-6 pb-4 bg-transparent select-none">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
            aria-label="Back"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11H7.83L13.41,5.41L12,4L4,12L12,20L13.41,18.59L7.83,13H20V11Z" />
            </svg>
          </button>

          <h2 className="text-md font-black text-[#1E7D38]">WasteLens</h2>

          <button
            onClick={() => alert("Informasi Lokasi: Lokasi digunakan untuk memetakan rute angkut kurator.")}
            className="w-10 h-10 flex items-center justify-center text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-all duration-200"
            aria-label="Help"
          >
            <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
              <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A3.75,3.75 0 0,0 8.25,9.75H9.75A2.25,2.25 0 0,1 12,7.5A2.25,2.25 0 0,1 14.25,9.75C14.25,11.25 12,11.25 12,13.5H13.5C13.5,11.63 15.75,11.25 15.75,9.75A3.75,3.75 0 0,0 12,6Z" />
            </svg>
          </button>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-[32px] p-6 shadow-xl w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#E2ECE4] text-[#1E7D38] flex items-center justify-center shadow-sm mx-auto animate-pulse">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-gray-900 leading-none">
                Aktifkan Lokasi
              </h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-[280px] mx-auto">
                Lokasi digunakan untuk memastikan laporan dikirim kepada pihak yang tepat.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex gap-2.5 items-center justify-center max-w-[280px] mx-auto select-none">
              <svg className="w-4 h-4 text-[#1E7D38] fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22M11,17L7,13L8.41,11.59L11,14.17L16.59,8.58L18,10L11,17Z" />
              </svg>
              <span className="text-[10px] text-gray-500 font-bold text-left">
                Data lokasi kamu aman dan hanya digunakan untuk verifikasi.
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleRequestGPS}
                disabled={gpsStatus === "loading"}
                className="w-full bg-[#287A38] hover:bg-[#20632d] active:scale-95 text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 disabled:opacity-50"
              >
                {gpsStatus === "loading" ? "Mengakses GPS..." : "Izinkan Akses Lokasi"}
              </button>

              <button
                onClick={() => setShowManualModal(true)}
                className="w-full bg-[#EBF1EC] hover:bg-[#dce6dd] active:scale-95 text-[#1E7D38] font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200"
              >
                Pilih Lokasi Secara Manual
              </button>
            </div>
          </div>
        </div>

        {showManualModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center max-w-screen-sm mx-auto w-full">
            <div className="bg-white w-full rounded-t-[32px] p-6 space-y-5 animate-[slide-up_0.3s_ease-out] shadow-2xl">
              <div className="flex justify-between items-center select-none pb-1 border-b border-gray-100">
                <h4 className="text-sm font-black text-gray-805">Pilih Lokasi Manual</h4>
                <button
                  onClick={() => setShowManualModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xs"
                >
                  Tutup
                </button>
              </div>

              <form onSubmit={handleSaveManualLocation} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9.5px] font-black text-gray-400 tracking-wider uppercase">
                    Alamat Lengkap Laporan
                  </label>
                  <textarea
                    required
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    rows={3}
                    placeholder="Masukkan nama jalan, nomor, RT/RW, kelurahan..."
                    className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl p-4 text-xs font-semibold placeholder-gray-400 text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black text-gray-400 tracking-wider uppercase">Latitude</label>
                    <input
                      type="text"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl px-4 py-3.5 text-xs font-semibold text-gray-800 font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black text-gray-400 tracking-wider uppercase">Longitude</label>
                    <input
                      type="text"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl px-4 py-3.5 text-xs font-semibold text-gray-800 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#287A38] hover:bg-[#20632d] text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 mt-2"
                >
                  Simpan Lokasi
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
