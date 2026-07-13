export interface TaskItem {
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
  user: { nama: string } | null;
  kendaraan: { jenis: string } | null;
  dinas: { nama_dinas: string } | null;
  [key: string]: unknown;
}

export interface TaskDetail extends TaskItem {
  foto: { url: string }[];
  verifikasi_pickup: {
    id: string;
    foto_sebelum: string;
    foto_sesudah: string;
    waktu: string;
  }[];
}

export async function getAssignedTasks(): Promise<TaskItem[]> {
  const res = await fetch("/api/petugas/tasks");
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Gagal memuat tugas" }));
    throw new Error(err.error ?? "Gagal memuat tugas");
  }
  const data = await res.json();
  return data.data ?? [];
}

export async function getTaskDetail(id: string): Promise<TaskDetail> {
  const res = await fetch(`/api/petugas/tasks/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Gagal memuat detail tugas" }));
    throw new Error(err.error ?? "Gagal memuat detail tugas");
  }
  return res.json();
}

export async function completeTask(
  id: string,
  fotoSesudah: string
): Promise<{ status: string; message: string }> {
  const res = await fetch(`/api/petugas/tasks/${id}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ foto_sesudah: fotoSesudah }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Gagal verifikasi" }));
    throw new Error(err.error ?? "Gagal verifikasi tugas");
  }

  return res.json();
}
