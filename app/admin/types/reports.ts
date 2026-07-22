import type { Pagination, ListResult } from "./users";

export type Report = {
  id: string;
  user: { id: string; nama: string; email?: string };
  kategori_ukuran: string;
  status: string;
  lokasi_lat: number;
  lokasi_lng: number;
  createdAt: string;
  dinas: { nama_dinas: string } | null;
  kendaraan: { jenis: string } | null;
  foto: { url: string }[];
};

export type ReportList = ListResult<Report>;

export type TimelineStep = {
  id: string;
  label: string;
  time: string;
  completed: boolean;
};

export type ReportDetail = {
  id: string;
  reportNumber: string;
  pelapor: string;
  jamLaporan: string;
  alamat: string;
  fotoUrl: string;
  timestampText: string;
  estimasiPenangananText: string;
  timelineSteps: TimelineStep[];
  locationLat: number;
  locationLng: number;
  addressTitle: string;
  addressSubtitle: string;
  kategoriUkuran?: string;
  status?: string;
};

export type { Pagination };
