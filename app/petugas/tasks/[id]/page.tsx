"use client";

import Icon from '@mdi/react';
import {
  mdiClipboardTextOutline,
  mdiMapMarker,
  mdiDirections,
  mdiImageOutline,
  mdiInformation,
  mdiKey,
  mdiAlert,
  mdiCameraOutline,
} from '@mdi/js';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';

const LocationMap = dynamic(() => import("@/components/leaflet-location-map"), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse bg-neutral-100" />
});

const data = {
  id: "#WL-1842",
  status: "Menunggu Diproses",
  pelapor: "Budi Santoso",
  lokasi_lat: -6.1931,
  lokasi_lng: 106.8336,
  foto: [
    {
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=400&fit=crop",
      label: "Tampak Depan"
    },
    {
      url: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=300&h=400&fit=crop",
      label: "Tampak Samping"
    }
  ],
  informasi_akses: "Gerbang samping terbuka pukul 06:00 - 18:00. Hubungi Pak RT jika gerbang terkunci (0812-3456-7890).",
  catatan_khusus: "Gunakan sarung tangan karet ekstra. Terdapat limbah basah sisa katering warga yang mungkin bocor."
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [cleaned, setCleaned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem("foto_sesudah", reader.result as string);
      router.push(`/petugas/tasks/${id}/verify`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pb-8 font-sans">
      <div className="py-4 space-y-6">

        {/* Status Badge */}
        <div className="inline-flex bg-primary/20 text-primary px-3 py-1.5 rounded-full items-center gap-1.5">
          <Icon path={mdiClipboardTextOutline} className="w-4 h-4" />
          <span className="text-sm font-medium">{data.status}</span>
        </div>

        {/* Lokasi Penjemputan Section */}
        <section>
          <h2 className="flex items-center gap-2 font-bold text-neutral-800 text-base mb-3">
            <Icon path={mdiMapMarker} className="w-5 h-5 text-primary" />
            Lokasi Penjemputan
          </h2>

          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 pb-3">
              <p className="text-[11px] text-primary font-bold uppercase mb-1 tracking-wider">Pelapor</p>
              <p className="text-[14px] font-bold text-neutral-800 mb-0.5 leading-snug">
                {data.pelapor}
              </p>
              <p className="text-sm text-neutral-500">
                {data.lokasi_lat.toFixed(6)}, {data.lokasi_lng.toFixed(6)}
              </p>
            </div>

            {/* Map */}
            <div className="w-full relative">
              <LocationMap lat={data.lokasi_lat} lng={data.lokasi_lng} height="h-48" popup="Lokasi Penjemputan" />

              <button
                className="absolute bottom-3 right-3 z-[1000] bg-white text-neutral-700 px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5 text-sm font-bold hover:bg-neutral-50 transition-colors border border-neutral-200"
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${data.lokasi_lat},${data.lokasi_lng}`, '_blank')}
              >
                <Icon path={mdiDirections} className="w-4 h-4 text-primary" />
                Buka Navigasi
              </button>
            </div>
          </div>
        </section>

        {/* Foto Laporan Section */}
        <section>
          <h2 className="flex items-center gap-2 font-bold text-neutral-800 text-base mb-3">
            <Icon path={mdiImageOutline} className="w-5 h-5 text-primary" />
            Foto Laporan
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {data.foto.map((foto, i) => (
              <div key={i} className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
                <Image
                  src={foto.url}
                  alt={foto.label}
                  className="w-full h-full object-cover"
                  width={300}
                  height={400}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10">
                  <span className="text-white text-[13px] font-medium">{foto.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Instruksi Petugas Section */}
        <section>
          <h2 className="flex items-center gap-2 font-bold text-neutral-800 text-base mb-3">
            <Icon path={mdiInformation} className="w-5 h-5 text-primary" />
            Instruksi Petugas
          </h2>

          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-4 space-y-4">

            {/* Informasi Akses */}
            <div className="bg-primary/10 rounded-xl p-3 flex gap-3">
              <div className="mt-0.5 shrink-0">
                <div className="bg-primary/20 p-1.5 rounded-lg flex items-center justify-center">
                  <Icon path={mdiKey} className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800 mb-1">Informasi Akses</p>
                <p className="text-sm text-neutral-600 leading-snug">
                  {data.informasi_akses}
                </p>
              </div>
            </div>

            {/* Catatan Khusus */}
            <div className="bg-accent/10 rounded-xl p-3 flex gap-3">
              <div className="mt-0.5 shrink-0">
                <div className="bg-accent/20 p-1.5 rounded-lg flex items-center justify-center">
                  <Icon path={mdiAlert} className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800 mb-1">Catatan Khusus</p>
                <p className="text-sm text-neutral-600 leading-snug">
                  {data.catatan_khusus}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Action Button */}
        {
          cleaned ?
            <button
              className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[15px] shadow-md mt-6 hover:bg-primary/90 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon path={mdiCameraOutline} className="w-5 h-5" />
              Ambil Foto
            </button> :
            <button
              className="w-full bg-accent text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[15px] shadow-md mt-6 hover:bg-accent/90 transition-colors"
              onClick={() => setCleaned(true)}
            >
              Mulai Bersihkan
            </button>
        }

        {/* Hidden camera input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
        />

      </div>
    </div>
  );
}