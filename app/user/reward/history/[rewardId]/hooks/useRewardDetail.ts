import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { RedemptionDetail } from "../services/detailService";

export function useRewardDetail(rewardId: string) {
    return useQuery({
        queryKey: ["user-reward-history", rewardId],
        queryFn: () => apiFetch<RedemptionDetail>(`/api/user/reward/history/${rewardId}`),
    });
}
