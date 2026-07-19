"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  History,
  Pencil,
  Save,
  Wrench,
  X,
} from "lucide-react";
import { DlhShell } from "./dlh-shell";
import { updateDlhStore, useDlhStore } from "@/lib/dlh-store";

export function VehicleDetail({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const store = useDlhStore();
  const vehicle =
    store.vehicles.find((item) => item.id === vehicleId) ?? store.vehicles[0];
  const [editOpen, setEditOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState("");
  const capacity = Number.parseFloat(vehicle.capacity);
  const loadPercent =
    capacity > 0
      ? Math.min(100, Math.round((vehicle.load / capacity) * 100))
      : 0;

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    updateDlhStore((draft) => {
      const target = draft.vehicles.find((item) => item.id === vehicleId);
      if (!target) return;
      target.plate = String(data.get("plate")).toUpperCase();
      target.capacity = `${Number(data.get("capacity")).toFixed(1)} Ton`;
    });
    setEditOpen(false);
    setNotice("Data armada berhasil diperbarui.");
  };

  return (
    <DlhShell hideHeader>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f4fbff] p-4 sm:p-5">
        <div className="mx-auto max-w-[1220px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => router.push("/dinas/logistics")}
              className="grid size-9 place-items-center rounded-full text-[#087529] hover:bg-white"
              aria-label="Kembali"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-[#087529]">
                Detail Armada
              </h1>
              <p className="text-sm text-[#667169]">
                {vehicleId} • {vehicle.area}
              </p>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex h-10 items-center gap-2 rounded-full border-2 border-[#087529] px-5 text-sm font-bold text-[#087529]"
              >
                <Pencil className="size-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => router.push("/dinas/logistics")}
                className="h-10 rounded-full bg-[#087529] px-6 text-sm font-bold text-white shadow-md"
              >
                Kembali
              </button>
            </div>
          </div>

          {notice && (
            <div
              role="status"
              className="mt-4 flex items-center rounded-xl bg-[#daf3e5] px-4 py-2.5 text-sm font-semibold text-[#176a35]"
            >
              {notice}
              <button
                type="button"
                onClick={() => setNotice("")}
                className="ml-auto"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
            <section className="overflow-hidden rounded-[22px] border border-[#bdcbbd] bg-white shadow-sm">
              <div className="relative aspect-[1.9/1] min-h-[260px] bg-slate-200">
                <Image
                  src="/images/dlh-fleet-truck.png"
                  alt={`Armada ${vehicleId}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 62vw"
                />
                <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#087529] px-3 py-1 text-xs font-bold text-white">
                  <BadgeCheck className="size-4" />
                  Operasional
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start">
                  <div>
                    <h2 className="text-xl font-extrabold">{vehicle.type}</h2>
                    <p className="mt-1 text-sm text-[#667169]">
                      Hino 500 Series • {vehicle.plate}
                    </p>
                  </div>
                  <span className="ml-auto rounded-full bg-[#bcebd1] px-4 py-1 text-sm font-bold text-[#47705b]">
                    {vehicle.year}
                  </span>
                </div>
                <div className="mt-6 flex justify-between text-sm font-bold">
                  <span>Kapasitas Muatan</span>
                  <span>
                    {vehicle.load} / {capacity.toFixed(1)} Ton ({loadPercent}%)
                  </span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#dcebf3]">
                  <div
                    className="h-full rounded-full bg-[#2e8737]"
                    style={{ width: `${loadPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs italic text-[#667169]">
                  Prediksi penuh dalam 1.5 jam berdasarkan rute aktif.
                </p>
              </div>
            </section>

            <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5 shadow-sm">
              <div className="flex items-center">
                <h2 className="flex items-center gap-2 text-lg font-extrabold">
                  <History className="size-5 text-[#087529]" />
                  Log Pemeliharaan
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAll((value) => !value)}
                  className="ml-auto text-xs font-bold text-[#087529]"
                >
                  {showAll ? "Tampilkan Ringkas" : "Lihat Semua"}
                </button>
              </div>
              <ol className="mt-5 space-y-5">
                {vehicle.maintenance
                  .slice(0, showAll ? vehicle.maintenance.length : 3)
                  .map((log, index, visible) => (
                    <li key={log.id} className="relative flex gap-4">
                      {index < visible.length - 1 && (
                        <span className="absolute left-4 top-8 h-[calc(100%+4px)] w-px bg-[#bdcbbd]" />
                      )}
                      <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-[#2e8737] text-white">
                        <Wrench className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex gap-3">
                          <h3 className="text-sm font-extrabold">
                            {log.title}
                          </h3>
                          <time className="ml-auto shrink-0 text-[11px] text-[#667169]">
                            {new Date(log.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </time>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[#667169]">
                          {log.description}
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-[#bcebd1] px-3 py-0.5 text-[10px] font-bold text-[#47705b]">
                          {log.status}
                        </span>
                      </div>
                    </li>
                  ))}
              </ol>
              <div className="mt-6 flex items-center gap-3 rounded-[20px] bg-[#ffd8d5] p-4 text-[#a9131a]">
                <CalendarClock className="size-6 shrink-0" />
                <div>
                  <p className="text-xs font-extrabold">
                    Jadwal Pemeliharaan Berikutnya
                  </p>
                  <p className="text-[11px]">
                    Servis rutin dalam 12 hari atau 1.200 km lagi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAppointmentOpen(true)}
                  className="ml-auto shrink-0 rounded-full bg-[#b40d17] px-4 py-2 text-xs font-bold text-white"
                >
                  Buat Janji
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      {editOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <form
            onSubmit={save}
            className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center">
              <h2 className="text-lg font-extrabold">
                Edit Armada {vehicleId}
              </h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="ml-auto rounded-full p-2 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">
                Plat Nomor
                <input
                  name="plate"
                  required
                  defaultValue={vehicle.plate}
                  className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
                />
              </label>
              <label className="block text-sm font-semibold">
                Kapasitas (Ton)
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  defaultValue={capacity}
                  className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#087529] text-sm font-bold text-white"
            >
              <Save className="size-4" />
              Simpan Perubahan
            </button>
          </form>
        </div>
      )}
      {appointmentOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const date = String(data.get("date"));
              updateDlhStore((draft) => {
                const target = draft.vehicles.find(
                  (item) => item.id === vehicleId,
                );
                if (!target) return;
                target.nextService = date;
                target.maintenance.unshift({
                  id: crypto.randomUUID(),
                  title: "Jadwal Servis Rutin",
                  date,
                  description: "Janji pemeliharaan terjadwal.",
                  status: "Terjadwal",
                });
              });
              setAppointmentOpen(false);
              setNotice("Jadwal pemeliharaan berhasil dibuat.");
            }}
            className="w-full max-w-[380px] rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center">
              <h2 className="text-lg font-extrabold">Buat Janji Servis</h2>
              <button
                type="button"
                onClick={() => setAppointmentOpen(false)}
                className="ml-auto rounded-full p-2"
              >
                <X className="size-5" />
              </button>
            </div>
            <label className="mt-5 block text-sm font-semibold">
              Tanggal Pemeliharaan
              <input
                name="date"
                type="date"
                required
                className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
              />
            </label>
            <button
              type="submit"
              className="mt-6 h-11 w-full rounded-xl bg-[#087529] text-sm font-bold text-white"
            >
              Simpan Jadwal
            </button>
          </form>
        </div>
      )}
    </DlhShell>
  );
}
