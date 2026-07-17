"use client";

import { FormEvent, useMemo, useState } from "react";
import { CircleGauge, Fuel, Plus, Search, Truck, Wrench, X } from "lucide-react";
import { DlhShell } from "./dlh-shell";

type VehicleStatus = "Tersedia" | "Bertugas" | "Perawatan";
type Vehicle = { id: number; name: string; plate: string; capacity: number; load: number; fuel: number; status: VehicleStatus };

const initialVehicles: Vehicle[] = [
  { id: 1, name: "Truk Sampah 01", plate: "B 9124 DLH", capacity: 10, load: 2, fuel: 84, status: "Tersedia" },
  { id: 2, name: "Truk Sampah 02", plate: "B 9082 DLH", capacity: 8, load: 6, fuel: 62, status: "Bertugas" },
  { id: 3, name: "Truk Sampah 05", plate: "B 9341 DLH", capacity: 5, load: 0, fuel: 75, status: "Tersedia" },
  { id: 4, name: "Pick Up 03", plate: "B 8712 DLH", capacity: 3, load: 0, fuel: 31, status: "Perawatan" },
];

const statusStyle: Record<VehicleStatus, string> = { Tersedia: "bg-emerald-100 text-emerald-700", Bertugas: "bg-blue-100 text-blue-700", Perawatan: "bg-amber-100 text-amber-700" };

export function LogisticsManagement() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => vehicles.filter((item) => `${item.name} ${item.plate}`.toLowerCase().includes(query.toLowerCase())), [query, vehicles]);

  const updateStatus = (id: number, status: VehicleStatus) => {
    setVehicles((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setNotice(`Status armada berhasil diubah menjadi ${status}.`);
  };

  const addVehicle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setVehicles((items) => [...items, { id: Date.now(), name: String(data.get("name")), plate: String(data.get("plate")), capacity: Number(data.get("capacity")), load: 0, fuel: 100, status: "Tersedia" }]);
    setModal(false);
    setNotice("Armada baru berhasil ditambahkan.");
  };

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#39815a]">Fleet Center</p><h2 className="mt-1 text-2xl font-extrabold">Kelola Logistik</h2><p className="mt-1 text-sm text-slate-500">Pantau kesiapan armada pengangkutan sampah.</p></div><button type="button" onClick={() => setModal(true)} className="flex items-center justify-center gap-2 rounded-full bg-[#087529] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#066421]"><Plus className="size-4" /> Tambah Armada</button></div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">{(["Tersedia", "Bertugas", "Perawatan"] as VehicleStatus[]).map((status) => <div key={status} className="flex items-center gap-4 rounded-2xl border border-[#d8e7df] bg-white p-5"><span className="grid size-12 place-items-center rounded-2xl bg-[#e5f6ed] text-[#087529]">{status === "Perawatan" ? <Wrench className="size-5" /> : <Truck className="size-5" />}</span><div><p className="text-xs text-slate-500">{status}</p><p className="text-2xl font-extrabold">{vehicles.filter((item) => item.status === status).length}</p></div></div>)}</div>

          {notice && <div role="status" className="mt-5 flex items-center rounded-2xl bg-[#def5e8] px-4 py-3 text-sm font-semibold text-[#166734]"><span>{notice}</span><button type="button" onClick={() => setNotice("")} className="ml-auto"><X className="size-4" /></button></div>}

          <div className="mt-6 rounded-3xl border border-[#d8e7df] bg-white p-4 shadow-sm sm:p-6"><label className="flex max-w-md items-center gap-3 rounded-full border border-[#c5d2cb] px-4"><Search className="size-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full bg-transparent text-sm outline-none" placeholder="Cari nama atau plat armada" /></label><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((vehicle) => <article key={vehicle.id} className="rounded-3xl border border-[#dce8e1] p-5 transition hover:border-[#8fc9a7]"><div className="flex items-start"><span className="grid size-12 place-items-center rounded-2xl bg-[#e5f6ed] text-[#087529]"><Truck className="size-6" /></span><span className={`ml-auto rounded-full px-3 py-1 text-[10px] font-bold ${statusStyle[vehicle.status]}`}>{vehicle.status}</span></div><h3 className="mt-4 font-extrabold">{vehicle.name}</h3><p className="text-xs text-slate-400">{vehicle.plate} • Kapasitas {vehicle.capacity} ton</p><div className="mt-5 space-y-4"><div><div className="flex justify-between text-xs"><span className="flex items-center gap-1 text-slate-500"><CircleGauge className="size-3.5" /> Muatan</span><b>{vehicle.load}/{vehicle.capacity} ton</b></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#087529]" style={{ width: `${Math.min(100, vehicle.load / vehicle.capacity * 100)}%` }} /></div></div><div><div className="flex justify-between text-xs"><span className="flex items-center gap-1 text-slate-500"><Fuel className="size-3.5" /> Bahan bakar</span><b>{vehicle.fuel}%</b></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${vehicle.fuel}%` }} /></div></div></div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => updateStatus(vehicle.id, vehicle.status === "Tersedia" ? "Bertugas" : "Tersedia")} className="rounded-full bg-[#087529] px-3 py-2 text-xs font-bold text-white">{vehicle.status === "Tersedia" ? "Tugaskan" : "Tersedia"}</button><button type="button" onClick={() => updateStatus(vehicle.id, "Perawatan")} className="rounded-full border border-[#c7d6cd] px-3 py-2 text-xs font-bold hover:bg-amber-50">Perawatan</button></div></article>)}</div></div>
        </div>
      </main>

      {modal && <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/45 p-4"><form onSubmit={addVehicle} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center"><h3 className="text-xl font-extrabold">Tambah Armada</h3><button type="button" onClick={() => setModal(false)} className="ml-auto rounded-full p-2 hover:bg-slate-100"><X className="size-5" /></button></div><div className="mt-5 space-y-4"><label className="block text-sm font-bold">Nama Armada<input name="name" required placeholder="Contoh: Truk Sampah 06" className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label><label className="block text-sm font-bold">Nomor Polisi<input name="plate" required placeholder="B 0000 DLH" className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label><label className="block text-sm font-bold">Kapasitas (ton)<input name="capacity" type="number" min="1" required defaultValue="5" className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label></div><button className="mt-6 w-full rounded-full bg-[#087529] py-3 text-sm font-extrabold text-white">Simpan Armada</button></form></div>}
    </DlhShell>
  );
}
