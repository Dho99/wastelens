import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } from "@/lib/services/dinas/vehicles";

export function useVehicles() {
  return useQuery({
    queryKey: ["dinas-vehicles"],
    queryFn: getVehicles,
  });
}

export function useVehicle(id: string | null) {
  return useQuery({
    queryKey: ["dinas-vehicles", id],
    queryFn: () => getVehicle(id!),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-vehicles"] }); },
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateVehicle>[1]) =>
      updateVehicle(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-vehicles"] }); },
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-vehicles"] }); },
  });
}
