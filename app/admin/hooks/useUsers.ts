import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserStatus, createUser } from "../services/users";
import type { CreateUserPayload } from "../types/users";

export function useUsers(page: number, roleFilter: string) {
  return useQuery({
    queryKey: ["admin-users", page, roleFilter],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "5" });
      if (roleFilter) params.set("role", roleFilter);
      return getUsers(params);
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; status: string; alasan?: string; nama?: string; email?: string }) =>
      updateUserStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateUserPayload) => createUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
