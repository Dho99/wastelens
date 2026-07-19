import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { StoreDetail } from "../services/storeDetailService";

export function useStoreDetail(storeId: string) {
    return useQuery({
        queryKey: ["store-detail", storeId],
        queryFn: () => apiFetch<StoreDetail>(`/api/kopdes/${storeId}`),
    });
}
