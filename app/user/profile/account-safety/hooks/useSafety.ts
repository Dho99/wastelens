import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { SafetyDetails } from "../services/safetyService";

export function useSafety() {
    return useQuery({
        queryKey: ["user-profile-safety"],
        queryFn: () => apiFetch<SafetyDetails>("/api/user/profile/safety"),
    });
}
