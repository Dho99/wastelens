import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { HistoryGroup } from "../services/historyListService";

export function useRewardHistory() {
    return useQuery({
        queryKey: ["user-reward-history"],
        queryFn: () => apiFetch<HistoryGroup[]>("/api/user/reward/history"),
    });
}
