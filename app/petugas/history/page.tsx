"use client";

import Icon from '@mdi/react';
import {
  mdiMagnify,
  mdiChevronRight,
  mdiScaleBalance,
  mdiHistory
} from '@mdi/js';

const historyTasks = [
  {
    id: "1",
    date: "24 Okt 2023, 14:20",
    address: "Jl. Menteng No. 12",
    weight: "12.5 Kg",
  },
  {
    id: "2",
    date: "24 Okt 2023, 11:45",
    address: "Jl. Sudirman Kav. 52",
    weight: "28.0 Kg",
  },
  {
    id: "3",
    date: "23 Okt 2023, 16:10",
    address: "Komp. Green Garden B4",
    weight: "8.2 Kg",
  },
  {
    id: "4",
    date: "23 Okt 2023, 09:30",
    address: "Jl. Kebon Jeruk No. 88",
    weight: "15.7 Kg",
  },
];

export default function PetugasHistoryPage() {
  return (
    <div className="min-h-screen pb-8 font-sans">

      <div className="py-4 space-y-6">
        {/* Search Input */}
        <div className="bg-white border border-neutral-300 rounded-xl px-3 py-3 flex items-center gap-2 shadow-sm">
          <Icon path={mdiMagnify} className="w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Cari alamat atau ID tugas..."
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-neutral-800 placeholder-neutral-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button className="bg-primary text-white px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm">
            Semua
          </button>
          <button className="bg-white border border-neutral-300 text-neutral-600 px-5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shadow-sm">
            Hari Ini
          </button>
          <button className="bg-white border border-neutral-300 text-neutral-600 px-5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shadow-sm">
            Minggu Ini
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/20 rounded-xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-sm text-[#4a7759] font-medium mb-1">Total Berat</p>
            <p className="text-2xl font-bold text-[#1b5e20]">
              482.5 <span className="text-[14px] font-semibold">Kg</span>
            </p>
          </div>
          <div className="bg-primary/20 rounded-xl p-4 flex flex-col justify-center shadow-sm">
            <p className="text-sm text-[#3e684a] font-medium mb-1">Total Tugas</p>
            <p className="text-2xl font-bold text-[#4e342e]">54</p>
          </div>
        </div>

        {/* List Section */}
        <section>
          <h3 className="font-bold text-neutral-800 mb-3">Selesai Baru-baru Ini</h3>

          <div className="space-y-3">
            {historyTasks.map((task) => (
              <div key={task.id} className="bg-white border border-neutral-200 rounded-xl p-3.5 flex flex-col shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                    SELESAI
                  </span>
                  <span className="text-sm text-neutral-500 font-medium">{task.date}</span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <h4 className="font-bold text-neutral-800">{task.address}</h4>
                  <Icon path={mdiChevronRight} className="w-5 h-5 text-neutral-400" />
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-neutral-600">
                  <Icon path={mdiScaleBalance} className="w-4 h-4" />
                  <span className="text-sm font-medium">{task.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
