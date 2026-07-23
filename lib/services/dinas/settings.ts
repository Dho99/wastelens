import { apiFetch } from "@/lib/api-client";
import type { DinasSettings } from "./types";

export function getSettings() {
  return apiFetch<DinasSettings>("/api/dinas/settings");
}

export function updateSettings(data: DinasSettings) {
  return apiFetch<DinasSettings>("/api/dinas/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
