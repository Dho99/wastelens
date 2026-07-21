import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface TaskDetailData {
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
  status_label: string;
  address_text: string | null;
  waste_types: string[];
  priority_level: string | null;
  access_obstruction_risk: boolean | null;
  drainage_risk: boolean | null;
  visual_indicators: string[];
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string } | null;
  kendaraan: { id: string; jenis: string } | null;
  dinas: { id: string; nama_dinas: string } | null;
  foto: { url: string }[];
  verifikasi_pickup: {
    id: string;
    foto_sebelum: string;
    foto_sesudah: string;
    waktu: string;
  }[];
}

export function useTaskDetail(id: string) {
  return useQuery({
    queryKey: ["petugas-task", id],
    queryFn: () => apiFetch<TaskDetailData>(`/api/petugas/tasks/${id}`),
    enabled: !!id,
  });
}
