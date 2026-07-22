import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOfficers, getOfficer, createOfficer, updateOfficer, deleteOfficer } from "@/lib/services/dinas/officers";

export function useOfficers() {
  return useQuery({
    queryKey: ["dinas-officers"],
    queryFn: getOfficers,
  });
}

export function useOfficer(id: string | null) {
  return useQuery({
    queryKey: ["dinas-officers", id],
    queryFn: () => getOfficer(id!),
    enabled: !!id,
  });
}

export function useCreateOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOfficer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-officers"] }); },
  });
}

export function useUpdateOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateOfficer>[1]) =>
      updateOfficer(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-officers"] }); },
  });
}

export function useDeleteOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteOfficer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-officers"] }); },
  });
}
