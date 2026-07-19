import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) =>
            apiFetch<{ message: string }>("/api/user/profile/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
    });
}
