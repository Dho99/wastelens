import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEntityUsers,
  getDinas,
  getKopdes,
  createDinas,
  updateDinas,
  deleteDinas,
  createKopdes,
  updateKopdes,
  deleteKopdes,
} from "../services/entities";
import type { DinasForm, KopdesForm } from "../types/entities";

export function useEntityUsers() {
  return useQuery({
    queryKey: ["admin-entity-users"],
    queryFn: async () => {
      const result = await getEntityUsers();
      return result.items;
    },
  });
}

export function useDinasList() {
  return useQuery({
    queryKey: ["admin-dinas"],
    queryFn: getDinas,
  });
}

export function useKopdesList() {
  return useQuery({
    queryKey: ["admin-kopdes"],
    queryFn: getKopdes,
  });
}

export function useCreateDinas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: DinasForm) => createDinas(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dinas"] });
    },
  });
}

export function useUpdateDinas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nama_dinas, kontak }: { id: string; nama_dinas: string; kontak: string }) =>
      updateDinas(id, nama_dinas, kontak),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dinas"] });
    },
  });
}

export function useDeleteDinas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDinas(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dinas"] });
    },
  });
}

export function useCreateKopdes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: KopdesForm) => createKopdes(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kopdes"] });
    },
  });
}

export function useUpdateKopdes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nama, alamat }: { id: string; nama: string; alamat: string }) =>
      updateKopdes(id, nama, alamat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kopdes"] });
    },
  });
}

export function useDeleteKopdes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteKopdes(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kopdes"] });
    },
  });
}
