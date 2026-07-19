"use client";

import Icon from '@mdi/react';
import {
  mdiCheckCircle,
  mdiCalendarBlank,
  mdiClockOutline,
  mdiMapMarker,
  mdiAlertOutline
} from '@mdi/js';
import Image from "next/image";
import LocationMap from "@/components/leaflet-location-map";

const data = {
  id: "#WL-HIST-209",
  status: "Selesai",
  date: "24 Okt 2023",
  time: "14:20 WIB",
  locationName: "Lokasi Penjemputan",
  address: "Jl. Menteng No. 12, Jakarta Pusat, DKI Jakarta 10310",
  lat: -6.1931,
  lng: 106.8336,
  isVerifiedAI: true,
  photos: [
    {
      id: "before",
      label: "Kondisi Awal",
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200&h=300&fit=crop",
      isClean: false
    },
    {
      id: "after",
      label: "Kondisi Bersih",
      url: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=200&h=300&fit=crop",
      isClean: true
    }
  ]
};

export default function DetailHistoryPage() {
  return <div className="min-h-screen pb-8 font-sans">
    <div className="py-4 space-y-6">

      {/* Task ID Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Task ID</p>
            <h2 className="text-xl font-bold text-neutral-800">{data.id}</h2>
          </div>
          <div className="bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Icon path={mdiCheckCircle} className="w-4 h-4" />
            <span className="text-sm font-medium">{data.status}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-neutral-700">
          <div className="flex items-center gap-1.5">
            <Icon path={mdiCalendarBlank} className="w-4 h-4" />
            <span className="text-sm font-medium">{data.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon path={mdiClockOutline} className="w-4 h-4" />
            <span className="text-sm font-medium">{data.time}</span>
          </div>
        </div>
      </div>

      {/* Lokasi Penjemputan Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Icon path={mdiMapMarker} className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-800 text-base mb-1">{data.locationName}</h3>
            <p className="text-sm text-neutral-500 leading-snug">
              {data.address}
            </p>
          </div>
        </div>
        {/* Map */}
        <LocationMap lat={data.lat} lng={data.lng} popup={data.address} />
      </div>

      {/* Foto Verifikasi */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-neutral-800 text-base">Foto Verifikasi</h3>
          {data.isVerifiedAI && (
            <span className="text-sm font-bold text-primary">Terverifikasi AI</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.photos.map((photo) => (
            <div key={photo.id} className="flex flex-col items-center">
              <div
                className={`w-full aspect-4/5 relative rounded-xl overflow-hidden mb-2 ${photo.isClean ? 'border-2 border-primary' : 'border border-neutral-200'
                  }`}
              >
                <Image
                  src={photo.url}
                  alt={photo.label}
                  className="w-full h-full object-cover"
                  width={200}
                  height={300}
                />
              </div>
              <p className={`text-sm ${photo.isClean ? 'font-bold text-primary' : 'text-neutral-600 font-medium'}`}>
                {photo.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Laporkan Masalah Button */}
      <button className="w-full bg-red-50 border border-red-200 text-[#d32f2f] font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm mt-4">
        <Icon path={mdiAlertOutline} className="w-5 h-5" />
        Laporkan Masalah pada Tugas Ini
      </button>

    </div>
  </div>
}
