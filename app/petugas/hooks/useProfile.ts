import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface PetugasProfile {
  id: string;
  nama: string;
  no_hp: string;
  email: string | null;
  image: string | null;
  zone: string | null;
  tugas_selesai: number;
}

export function usePetugasProfile() {
  return useQuery({
    queryKey: ["petugas-profile"],
    queryFn: () => apiFetch<PetugasProfile>("/api/petugas/profile"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nama?: string; no_hp?: string }) =>
      apiFetch<PetugasProfile>("/api/petugas/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petugas-profile"] });
    },
  });
}
