import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface HistoryTask {
  id: string;
  address: string;
  kategori_ukuran: string;
  waste_types: string[];
  estimated_load_unit: number | null;
  updatedAt: string;
  user: { name: string } | null;
  verifikasi_pickup: { waktu: string }[];
}

export interface HistoryData {
  tasks: HistoryTask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  summary: {
    total_tasks: number;
    total_load: number;
  };
}

export function usePetugasHistory(params?: {
  search?: string;
  filter?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.filter) searchParams.set("filter", params.filter);
  if (params?.page) searchParams.set("page", String(params.page));
  const qs = searchParams.toString();

  return useQuery({
    queryKey: ["petugas-history", params?.search, params?.filter, params?.page],
    queryFn: () =>
      apiFetch<HistoryData>(
        `/api/petugas/history${qs ? `?${qs}` : ""}`,
      ),
  });
}
