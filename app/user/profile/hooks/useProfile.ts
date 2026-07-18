import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { UserProfileData } from "../services/profileService";

export function useProfile() {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: () => apiFetch<UserProfileData>("/api/user/profile"),
    });
}
