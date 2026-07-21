export interface DashboardTask {
  id: string;
  address: string;
  status: string;
  waste_types: string[];
  kategori_ukuran: string;
  priority_level: string | null;
  foto_url: string;
  lokasi_lat: number;
  lokasi_lng: number;
  createdAt: string;
  user: { name: string } | null;
}

export interface DashboardData {
  total_tasks: number;
  selesai_hari_ini: number;
  tersisa: number;
  recent_tasks: DashboardTask[];
}
