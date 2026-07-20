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
export type { Pagination };
