"use client";

import { useSyncExternalStore } from "react";

export type DlhReport = {
  id: string;
  date: string;
  isoDate: string;
  year: string;
  time: string;
  location: string;
  district: string;
  category: "BAHAYA" | "AMAN";
  status: "Menunggu" | "Diproses" | "Selesai";
  reporter: string;
  notes?: string;
};

export type DlhVehicle = {
  id: string;
  plate: string;
  capacity: string;
  status: "Beroperasi" | "Maintenance" | "Standby";
  type: string;
  year: number;
  area: string;
  load: number;
  maintenance: { id: string; title: string; date: string; description: string; status: string }[];
  nextService?: string;
};

export type DlhOfficer = {
  id: string;
  name: string;
  initials: string;
  zone: string;
  phone: string;
  email: string;
  color: string;
  role: string;
  shift: string;
  mobileAccess: boolean;
  tracking: boolean;
  photo?: string;
  tasks: number;
  location: string;
  recentTasks: { id: string; place: string; time: string; note: string }[];
};

export type DlhState = {
  reports: DlhReport[];
  vehicles: DlhVehicle[];
  officers: DlhOfficer[];
  admin: {
    name: string;
    email: string;
    passwordUpdatedAt: string;
    department?: string;
    position?: string;
    phone?: string;
    photo?: string;
  };
  settings: { agency: string; region: string; email: string; phone: string; autoDispatch: boolean; emailAlert: boolean; soundAlert: boolean };
  notifications: { id: number; title: string; message: string; time: string; type: string; read: boolean }[];
};

const reportSeed: DlhReport[] = [
  ["LPR-2024001", "24 Mei", "2024-05-24", "2024", "08:45 WIB", "Jl. Sudirman No. 12", "Kec. Menteng, Jakarta Pusat", "BAHAYA", "Menunggu", "Bpk. Agus"],
  ["LPR-2024002", "24 Mei", "2024-05-24", "2024", "09:12 WIB", "Pasar Senen Block III", "Kec. Senen, Jakarta Pusat", "AMAN", "Diproses", "Ibu Rina"],
  ["LPR-2024003", "23 Mei", "2024-05-23", "2024", "15:30 WIB", "Taman Suropati", "Kec. Menteng, Jakarta Pusat", "AMAN", "Selesai", "Sdr. Dimas"],
  ["LPR-2024004", "23 Mei", "2024-05-23", "2024", "11:05 WIB", "Jl. Thamrin KM 4", "Kec. Gambir, Jakarta Pusat", "BAHAYA", "Diproses", "Ibu Sari"],
  ["LPR-2024005", "22 Mei", "2024-05-22", "2024", "14:20 WIB", "Monumen Nasional", "Kec. Gambir, Jakarta Pusat", "AMAN", "Selesai", "Bpk. Joko"],
  ["LPR-2024006", "22 Mei", "2024-05-22", "2024", "10:15 WIB", "Jl. Kramat Raya", "Kec. Senen, Jakarta Pusat", "BAHAYA", "Menunggu", "Ibu Maya"],
  ["LPR-2024007", "21 Mei", "2024-05-21", "2024", "16:40 WIB", "Lapangan Banteng", "Kec. Sawah Besar, Jakarta Pusat", "AMAN", "Diproses", "Bpk. Andi"],
  ["LPR-2024008", "21 Mei", "2024-05-21", "2024", "07:50 WIB", "Jl. Cempaka Putih Raya", "Kec. Cempaka Putih, Jakarta Pusat", "AMAN", "Selesai", "Ibu Nita"],
].map(([id, date, isoDate, year, time, location, district, category, status, reporter]) => ({ id, date, isoDate, year, time, location, district, category: category as DlhReport["category"], status: status as DlhReport["status"], reporter }));

const vehicleSeed: DlhVehicle[] = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1;
  return {
    id: `ARM-${String(number).padStart(3, "0")}`,
    plate: number === 1 ? "B 1234 ABC" : number === 2 ? "B 5678 XYZ" : `B ${7000 + number * 31} DLH`,
    capacity: `${[12.5, 8, 10, 6.5, 9, 12, 7.5, 8.5, 10, 6][index].toFixed(1)} Ton`,
    status: index === 1 || index === 4 || index === 7 ? "Maintenance" : "Beroperasi",
    type: index % 3 === 0 ? "Compactor Truck XL" : "Compactor Truck",
    year: 2024 - index % 4,
    area: index % 2 ? "Jakarta Pusat" : "Jakarta Selatan",
    load: Number((index % 5 + 2).toFixed(1)),
    maintenance: [
      { id: `M-${number}-1`, title: "Servis Rutin Berkala", date: "2024-05-12", description: "Ganti oli mesin, pemeriksaan hidrolik, dan rotasi ban.", status: "Selesai" },
      { id: `M-${number}-2`, title: "Uji Emisi Kendaraan (KIR)", date: "2024-03-15", description: "Sertifikasi KIR berkala dan pemeriksaan emisi.", status: "Selesai" },
    ],
  };
});

const officerNames = ["Hendro Saputro", "Bambang Arianto", "Siti Aminah", "Dedi Irawan", "Rizky Pratama", "Andi Setiawan", "Nur Aisyah", "Fajar Nugroho", "Putri Lestari", "Agus Firmansyah"];
const officerSeed: DlhOfficer[] = officerNames.map((name, index) => ({
  id: `FLD-${9921 + index}`,
  name,
  initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2),
  zone: ["Zone A - Menteng", "Zone C - Tebet", "Zone B - Gambir", "Zone D - Senen"][index % 4],
  phone: `+62 812-${String(3456 + index * 37).padStart(4, "0")}-${String(7890 + index * 11).slice(-4)}`,
  email: `${name.toLowerCase().replace(" ", ".")}@dlh-jakarta.go.id`,
  color: ["bg-[#bcebd1]", "bg-[#ffd9ae]", "bg-[#d7eafd]", "bg-[#e5ddfb]"][index % 4],
  role: "Field Operator",
  shift: "Pagi",
  mobileAccess: true,
  tracking: true,
  tasks: 142 - index * 3,
  location: index % 2 ? "Jl. Tebet Raya No. 8" : "Jl. Teuku Umar No. 12",
  recentTasks: [{ id: `T-${index}-1`, place: "Jl. Imam Bonjol No. 44", time: "Selesai 15 menit lalu", note: "Pengangkutan berhasil dan area telah dibersihkan." }],
}));

export const defaultDlhState: DlhState = {
  reports: reportSeed,
  vehicles: vehicleSeed,
  officers: officerSeed,
  admin: {
    name: "Bambang Pamungkas",
    email: "b.pamungkas@dlh.kota.go.id",
    passwordUpdatedAt: "2 bulan yang lalu",
    department: "Operasional Pengolahan Limbah",
    position: "Kepala Bidang Operasional",
    phone: "+62 812-3456-7890",
  },
  settings: { agency: "Dinas Lingkungan Hidup", region: "Jakarta Pusat", email: "operasional@dlh.go.id", phone: "021-555-0199", autoDispatch: true, emailAlert: true, soundAlert: false },
  notifications: [
    { id: 1, title: "Laporan prioritas tinggi", message: "Laporan #WL-099 di Menteng membutuhkan armada besar.", time: "8 menit lalu", type: "report", read: false },
    { id: 2, title: "Armada tiba di lokasi", message: "Truk Sampah 02 telah tiba untuk laporan #WL-098.", time: "18 menit lalu", type: "truck", read: false },
    { id: 3, title: "Laporan selesai", message: "Petugas menyelesaikan laporan #WL-096.", time: "1 jam lalu", type: "done", read: true },
  ],
};

const storageKey = "wastelens-dlh-store-v1";
let currentSnapshot: DlhState = defaultDlhState;
let initialized = false;
const listeners = new Set<() => void>();

function clientSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) currentSnapshot = { ...defaultDlhState, ...JSON.parse(stored) };
    } catch {
      currentSnapshot = defaultDlhState;
    }
  }
  return currentSnapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey || !event.newValue) return;
    currentSnapshot = { ...defaultDlhState, ...JSON.parse(event.newValue) };
    listener();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useDlhStore() {
  return useSyncExternalStore(subscribe, clientSnapshot, () => defaultDlhState);
}

export function updateDlhStore(update: (draft: DlhState) => void) {
  const draft = structuredClone(clientSnapshot());
  update(draft);
  currentSnapshot = draft;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    throw new Error("Penyimpanan lokal penuh. Gunakan foto yang lebih kecil.");
  }
  listeners.forEach((listener) => listener());
}

export function resetDlhStore() {
  currentSnapshot = structuredClone(defaultDlhState);
  window.localStorage.removeItem(storageKey);
  listeners.forEach((listener) => listener());
}
