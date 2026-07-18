import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { UserProfileData } from "../../types/profileService";

export function useProfileQuery() {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: () => apiFetch<UserProfileData>("/api/user/profile"),
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<UserProfileData>) =>
            apiFetch<UserProfileData>("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: async (updatedProfile) => {
            await queryClient.setQueryData(["user-profile"], updatedProfile);
            await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
    });
}
