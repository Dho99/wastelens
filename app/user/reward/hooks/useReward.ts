import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { RewardData } from "../services/rewardService";

export function useReward(lat?: number, lng?: number) {
    const params = new URLSearchParams();
    if (lat !== undefined && lng !== undefined) {
        params.set("lat", String(lat));
        params.set("lng", String(lng));
    }
    const qs = params.toString();
    const url = `/api/user/reward${qs ? `?${qs}` : ""}`;

    return useQuery({
        queryKey: ["user-reward", lat, lng],
        queryFn: () => apiFetch<RewardData>(url),
    });
}
