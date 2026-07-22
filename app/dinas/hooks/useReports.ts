import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports, getReport, assignReport, deleteReport } from "@/lib/services/dinas/reports";
import type { DinasReport } from "@/lib/services/dinas/types";

export function useReports(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ["dinas-reports", params],
    queryFn: () => getReports(params),
  });
}

export function useReport(id: string | null) {
  return useQuery({
    queryKey: ["dinas-reports", id],
    queryFn: () => getReport(id!),
    enabled: !!id,
  });
}

export function useAssignReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof assignReport>[1]) =>
      assignReport(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dinas-reports"] });
    },
  });
}

export function useDeleteReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dinas-reports"] });
    },
  });
}
