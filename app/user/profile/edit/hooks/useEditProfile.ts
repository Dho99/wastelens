import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { UserProfileData } from "../../services/profileService";

export function useProfileQuery() {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: () => apiFetch<UserProfileData>("/api/user/profile"),
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { fullName: string; email: string }) =>
            apiFetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
    });
}
