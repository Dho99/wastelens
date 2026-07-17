"use client";

import Icon from '@mdi/react';
import {
  mdiMapMarkerPath,
  mdiTimerOutline,
  mdiFilterVariant,
  mdiClockOutline,
  mdiChevronRight,
  mdiAlertOutline,
  mdiMapOutline,
  mdiClipboardText
} from '@mdi/js';
import Image from 'next/image';

const tasks = [
  {
    address: "Jl. Kebon Jeruk No. 42",
    status: "Menunggu Diproses",
    type: "Organik",
    distance: "450m",
    time_reported: "10 menit",
    high_priority: true,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200&h=200&fit=crop"
  },
  {
    address: "Jl. Thamrin Kav. 12",
    status: "Menunggu Diproses",
    type: "Plastik",
    distance: "1.2 km",
    time_reported: "1 jam",
    high_priority: false,
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=200&h=200&fit=crop"
  },
  {
    address: "Pasar Baru Blok A",
    status: "Menunggu Diproses",
    type: "Campuran",
    distance: "2.8 km",
    time_reported: "2 jam",
    high_priority: false,
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=200&h=200&fit=crop"
  }
]

export default function PetugasDashboardPage() {
  return (
    <div className="min-h-screen pb-8 font-sans">

      {/* Main Content */}
      <div className="py-4 space-y-6">

        {/* Summary section */}
        <section className="space-y-3">
          {/* Main Card */}
          <div className="bg-primary rounded-xl p-5 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <p className="text-[11px] font-semibold text-emerald-50 tracking-wider mb-1 uppercase">Tugas Hari Ini</p>
              <h2 className="text-3xl font-bold mb-1 leading-tight">12 Lokasi</h2>
              <p className="text-[13px] text-emerald-50 font-medium">4 Selesai &bull; 8 Tersisa</p>
            </div>
            {/* Background Icon/Shape */}
            <Icon path={mdiClipboardText} size={4} className="absolute -right-8 -bottom-10 opacity-30" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-xl p-4 border border-neutral-300 flex flex-col justify-center">
              <Icon path={mdiMapMarkerPath} className="w-5 h-5 text-neutral-500 mb-2" />
              <p className="text-[11px] text-neutral-500 font-medium mb-0.5">Total Jarak</p>
              <p className="text-[17px] font-bold text-[#205c48]">4.2 km</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 border border-neutral-300 flex flex-col justify-center">
              <Icon path={mdiTimerOutline} className="w-5 h-5 text-accent mb-2" />
              <p className="text-[11px] text-neutral-500 font-medium mb-0.5">Estimasi</p>
              <p className="text-[17px] font-bold text-accent">3j 15m</p>
            </div>
          </div>
        </section>

        {/* Task List Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[17px] font-bold text-neutral-800">Antrean Tugas</h3>
            <button className="flex items-center gap-1 text-[13px] font-semibold text-[#388e3c]">
              Urutkan <Icon path={mdiFilterVariant} className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task, i) =>
              <div key={i}
                className={`bg-white rounded-2xl overflow-hidden ${i == 0 && "border border-accent"}`}>
                <div className="flex p-3 gap-3">
                  {/* Image */}
                  <div className="w-25 h-25 relative rounded-xl overflow-hidden shrink-0">
                    {task.high_priority &&
                      <span className="absolute top-0 left-0 bg-[#d32f2f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg z-10 flex items-center gap-1">
                        <Icon path={mdiAlertOutline} className="w-2.5 h-2.5" /> Prioritas Tinggi
                      </span>
                    }
                    <Image
                      src={task.image}
                      alt="Trash"
                      className="w-full h-full object-cover"
                      width={200}
                      height={200}
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 py-0.5 flex flex-col">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="font-bold text-neutral-800 text-[15px] leading-tight line-clamp-2">{task.address}</h4>
                      <span className="text-[11px] font-semibold text-neutral-500 mt-0.5">{task.distance}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-auto">
                      <span className="bg-[#c8e6c9] text-[#2e7d32] text-[10px] font-bold px-2 py-0.5 rounded-full">{task.status}</span>
                      <span className="bg-[#e2e8f0] text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{task.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-2 font-medium">
                      <Icon path={mdiClockOutline} className="w-3.5 h-3.5" /> {task.time_reported}
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3 pt-1">
                  {i == 0 ?
                    <button className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm">
                      Mulai Tugas <Icon path={mdiChevronRight} className="w-4 h-4" />
                    </button> :
                    <button className="w-full bg-white border-[1.5px] border-primary text-primary font-semibold py-2 rounded-xl text-sm">
                      Lihat Detail
                    </button>
                  }
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-4 w-12 h-12 bg-[#1b5e20] rounded-full shadow-lg flex items-center justify-center text-white z-50">
        <Icon path={mdiMapOutline} className="w-5 h-5" />
      </button>

    </div>
  );
}
