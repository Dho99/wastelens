import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdmin, updateAdmin, changePassword } from "@/lib/services/dinas/admin";

export function useAdmin() {
  return useQuery({
    queryKey: ["dinas-admin"],
    queryFn: getAdmin,
  });
}

export function useUpdateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-admin"] }); },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
