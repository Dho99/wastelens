import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { LaporanItem } from "../types/history.ts";

export function useHistory() {
    return useQuery({
        queryKey: ["user-history"],
        queryFn: () => apiFetch<LaporanItem[]>("/api/user/history"),
    });
}
