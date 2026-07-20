import { apiFetch } from "@/lib/api-client";
import type { ListResult, User } from "../types/users";
import type { CreateUserPayload } from "../types/users";

export function getUsers(params: URLSearchParams) {
  return apiFetch<ListResult<User>>(`/api/admin/users?${params}`);
}

export function createUser(body: CreateUserPayload) {
  return apiFetch<{ message: string; userId: string; role: string }>("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function updateUserStatus(id: string, payload: { status: string; alasan?: string; nama?: string; email?: string }) {
  return apiFetch<{ message: string }>(`/api/admin/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
