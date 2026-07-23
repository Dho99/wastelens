import { apiFetch } from "@/lib/api-client";
import type { DinasAccount } from "./types";

export function getAccounts() {
  return apiFetch<DinasAccount[]>("/api/dinas/accounts");
}

export function createAccount(data: { name: string; email: string; password: string; phone?: string }) {
  return apiFetch<DinasAccount>("/api/dinas/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateAccount(id: string, data: Partial<{ name: string; email: string; no_hp: string }>) {
  return apiFetch<void>(`/api/dinas/accounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteAccount(id: string) {
  return apiFetch<void>(`/api/dinas/accounts/${id}`, { method: "DELETE" });
}
