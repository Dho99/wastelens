"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { toast } from "sonner";
import { useChangePassword } from "./hooks/useChangePassword";
import { changePasswordSchema, type ChangePasswordData } from "./schema";
import { PasswordHeader } from "./components/PasswordHeader";
import { VisualBanner } from "./components/VisualBanner";
import { PasswordForm } from "./components/PasswordForm";
import { RequirementsPanel } from "./components/RequirementsPanel";

export default function ChangePasswordPage() {
    const router = useRouter();
    const { setHideTabBar } = useTabBar();
    const changePassword = useChangePassword();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ChangePasswordData>({
        resolver: zodResolver(changePasswordSchema),
    });

    useEffect(() => {
        setHideTabBar(true);
        return () => setHideTabBar(false);
    }, [setHideTabBar]);

    const onSubmit = async (data: ChangePasswordData) => {
        try {
            await changePassword.mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success("Kata sandi berhasil diperbarui!");
            router.push("/user/profile");
        } catch {
            toast.error("Gagal mengubah kata sandi. Periksa kata sandi saat ini.");
        }
    };

    const newPassword = watch("newPassword");
    const confirmPassword = watch("confirmPassword");

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#FAF9F5] min-h-screen pb-32"
        >
            <PasswordHeader onBackClick={() => router.back()} />
            <VisualBanner />
            <PasswordForm register={register} errors={errors} />
            <RequirementsPanel
                newPassword={newPassword ?? ""}
                confirmPassword={confirmPassword ?? ""}
            />

            <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 shadow-lg flex items-center justify-center">
                <button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="w-full bg-[#0D631B] hover:bg-[#0a4d15] active:scale-95 text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <svg
                        className="w-4 h-4 fill-current text-emerald-200"
                        viewBox="0 0 24 24"
                    >
                        <path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H16.17L19,7.83V19M12,10A3,3 0 1,0 12,16A3,3 0 0,0 12,10M8,6V8H15V6H8Z" />
                    </svg>
                    <span>
                        {changePassword.isPending
                            ? "Menyimpan..."
                            : "Simpan Perubahan"}
                    </span>
                </button>
            </div>
        </form>
    );
}
