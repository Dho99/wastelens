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
  address?: string;
  latitude?: number;
  longitude?: number;
  wasteTypes?: string[];
  sizeCategory?: string;
  priorityLevel?: string;
  category: "BAHAYA" | "AMAN";
  status: "Menunggu" | "Diproses" | "Selesai";
  reporter: string;
  photoUrl?: string;
  notes?: string;
  assignedOfficerId?: string;
  assignedVehicleId?: string;
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
  schemaVersion: 2;
  updatedAt: string;
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
  accounts: { id: number; name: string; initials: string; email: string; phone: string; role: "Petugas Lapangan" | "Operator DLH"; active: boolean }[];
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
].map(([id, date, isoDate, year, time, location, district, category, status, reporter], index) => ({
  id,
  date,
  isoDate,
  year,
  time,
  location,
  district,
  category: category as DlhReport["category"],
  status: status as DlhReport["status"],
  reporter,
  assignedVehicleId: status === "Menunggu" ? undefined : `ARM-${String((index % 10) + 1).padStart(3, "0")}`,
  assignedOfficerId: status === "Menunggu" ? undefined : `FLD-${9921 + (index % 10)}`,
}));

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
  schemaVersion: 2,
  updatedAt: "2024-05-24T10:45:00+07:00",
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
  accounts: [
    { id: 1, name: "Budi Santoso", initials: "BS", email: "budi@dlh.go.id", phone: "0812 3344 8877", role: "Petugas Lapangan", active: true },
    { id: 2, name: "Siti Aminah", initials: "SA", email: "siti@dlh.go.id", phone: "0812 1177 3409", role: "Petugas Lapangan", active: true },
    { id: 3, name: "Dedi Kurniawan", initials: "DK", email: "dedi@dlh.go.id", phone: "0813 2209 1411", role: "Petugas Lapangan", active: false },
    { id: 4, name: "Rina Maharani", initials: "RM", email: "rina@dlh.go.id", phone: "0811 9765 3001", role: "Operator DLH", active: true },
  ],
};

const storageKey = "wastelens-dlh-store-v1";
let currentSnapshot: DlhState = defaultDlhState;
let initialized = false;
const listeners = new Set<() => void>();
export type DlhSyncStatus = "idle" | "syncing" | "online" | "offline";
let syncStatus: DlhSyncStatus = "idle";
const syncListeners = new Set<() => void>();
let hydrationPromise: Promise<void> | null = null;
let persistTimer: number | null = null;
let persistenceChain: Promise<void> = Promise.resolve();

function setSyncStatus(status: DlhSyncStatus) {
  syncStatus = status;
  syncListeners.forEach((listener) => listener());
}

function normalizeState(value: Partial<DlhState>): DlhState {
  return {
    ...defaultDlhState,
    ...value,
    schemaVersion: 2,
    reports: Array.isArray(value.reports) ? value.reports : defaultDlhState.reports,
    vehicles: Array.isArray(value.vehicles) ? value.vehicles : defaultDlhState.vehicles,
    officers: Array.isArray(value.officers) ? value.officers : defaultDlhState.officers,
    accounts: Array.isArray(value.accounts) ? value.accounts : defaultDlhState.accounts,
    notifications: Array.isArray(value.notifications) ? value.notifications : defaultDlhState.notifications,
  };
}

async function persistToBackend() {
  const snapshot = structuredClone(currentSnapshot);
  setSyncStatus("syncing");
  try {
    const response = await fetch("/api/dinas/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ data: snapshot }),
    });
    if (!response.ok) throw new Error("Sinkronisasi backend gagal");
    setSyncStatus("online");
  } catch {
    setSyncStatus("offline");
  }
}

function scheduleBackendPersist() {
  if (typeof window === "undefined") return;
  if (persistTimer) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    persistenceChain = persistenceChain.then(persistToBackend, persistToBackend);
  }, 300);
}

function clientSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<DlhState> & { schemaVersion?: number };
        const reports = parsed.reports?.map((report, index) => parsed.schemaVersion === 2 || report.status === "Menunggu" ? report : {
          ...report,
          assignedVehicleId: `ARM-${String((index % 10) + 1).padStart(3, "0")}`,
          assignedOfficerId: `FLD-${9921 + (index % 10)}`,
        });
        currentSnapshot = normalizeState({ ...parsed, reports: reports ?? defaultDlhState.reports });
        window.localStorage.setItem(storageKey, JSON.stringify(currentSnapshot));
      }
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
    currentSnapshot = normalizeState(JSON.parse(event.newValue));
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

export function useDlhSyncStatus() {
  return useSyncExternalStore(
    (listener) => { syncListeners.add(listener); return () => syncListeners.delete(listener); },
    () => syncStatus,
    () => "idle" as const,
  );
}

export function hydrateDlhStore() {
  if (hydrationPromise) return hydrationPromise;
  hydrationPromise = (async () => {
    clientSnapshot();
    setSyncStatus("syncing");
    try {
      const response = await fetch("/api/dinas/state", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error("Backend DLH tidak tersedia");
      const result = await response.json() as { data?: Partial<DlhState> | null };
      if (result.data) {
        currentSnapshot = normalizeState(result.data);
        window.localStorage.setItem(storageKey, JSON.stringify(currentSnapshot));
        listeners.forEach((listener) => listener());
        setSyncStatus("online");
      } else {
        await persistToBackend();
      }
    } catch {
      setSyncStatus("offline");
    }
  })();
  return hydrationPromise;
}

export function updateDlhStore(update: (draft: DlhState) => void) {
  const draft = structuredClone(clientSnapshot());
  update(draft);
  draft.updatedAt = new Date().toISOString();
  currentSnapshot = draft;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    throw new Error("Penyimpanan lokal penuh. Gunakan foto yang lebih kecil.");
  }
  listeners.forEach((listener) => listener());
  scheduleBackendPersist();
}

export function resetDlhStore() {
  currentSnapshot = structuredClone(defaultDlhState);
  window.localStorage.removeItem(storageKey);
  listeners.forEach((listener) => listener());
  scheduleBackendPersist();
}
