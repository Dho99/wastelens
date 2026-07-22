export interface DinasReport {
  id: string;
  user_id: string;
  dinas_id: string | null;
  petugas_id: string | null;
  kendaraan_id: string | null;
  foto_url: string;
  lokasi_lat: number;
  lokasi_lng: number;
  kategori_ukuran: string;
  rekomendasi_kendaraan: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  corrected_kategori_ukuran: string | null;
  address_text: string | null;
  road_name: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  waste_types: string[];
  drainage_risk: boolean | null;
  access_obstruction_risk: boolean | null;
  priority_score: number | null;
  priority_level: string | null;
  route_order: number | null;
  assigned_load_kg: number | null;
  user?: { name: string; phoneNumber?: string };
  foto?: { url: string; mime_type?: string }[];
}

export interface DinasVehicle {
  id: string;
  dinas_id: string;
  jenis: string;
  kapasitas: number;
  current_load: number;
}

export interface DinasOfficer {
  id: string;
  dinas_id: string;
  user_id: string;
  nama: string;
  no_hp: string;
  user?: { id: string; name: string; email: string; image: string | null };
  _count?: { laporan: number };
}

export interface DinasAdmin {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phoneNumber: string | null;
  dinasId: string;
  dinasName: string;
}

export interface DinasSettings {
  agency?: string;
  region?: string;
  email?: string;
  phone?: string;
  autoDispatch?: boolean;
  emailAlert?: boolean;
  soundAlert?: boolean;
}

export interface DinasNotification {
  id: string;
  user_id: string;
  laporan_id: string;
  pesan: string;
  status_baca: boolean;
  createdAt: string;
}

export interface DinasAccount {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: "Petugas Lapangan" | "Operator DLH";
  active: boolean;
  image: string | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
