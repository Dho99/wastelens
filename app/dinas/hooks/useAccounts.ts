import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccounts, createAccount, updateAccount, deleteAccount } from "@/lib/services/dinas/accounts";

export function useAccounts() {
  return useQuery({
    queryKey: ["dinas-accounts"],
    queryFn: getAccounts,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-accounts"] }); },
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateAccount>[1]) =>
      updateAccount(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-accounts"] }); },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dinas-accounts"] }); },
  });
}
