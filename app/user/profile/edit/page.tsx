"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useProfileQuery, useUpdateProfile } from "./hooks/useEditProfile";
import { useSession } from "@/lib/auth-client";
import { editProfileSchema, type EditProfileData } from "./schema";
import { EditHeader } from "./components/EditHeader";
import { PhotoUploader } from "./components/PhotoUploader";
import { EditForm } from "./components/EditForm";
import { MembershipBanner } from "./components/MembershipBanner";

const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export default function EditProfilePage() {
    const router = useRouter();
    const { data: profile, isLoading } = useProfileQuery();
    const { mutateAsync, isPending: isUpdating } = useUpdateProfile();
    const { setHideTabBar } = useTabBar();
    const { refetch: refetchSession } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EditProfileData>({
        resolver: zodResolver(editProfileSchema),
    });

    useEffect(() => {
        setHideTabBar(true);
        return () => setHideTabBar(false);
    }, [setHideTabBar]);

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name,
                email: profile.email ?? "",
                phoneNumber: profile.phoneNumber ?? "",
                address: profile.address ?? "",
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data: EditProfileData) => {
        try {
            await mutateAsync(data);
            await refetchSession();
            toast.success("Perubahan profil berhasil disimpan!");
            router.push("/user/profile");
        } catch {
            toast.error("Gagal menyimpan perubahan profil");
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#FAF9F5] h-dvh">
                <EditHeader onBackClick={() => router.back()} />
                <div className="space-y-4 p-4 ">
                    <div className="flex justify-between items-center h-10" />
                    <div className="h-28 w-28 bg-gray-200 rounded-full mx-auto" />
                    <div className="h-10 bg-gray-200 rounded-2xl" />
                    <div className="h-10 bg-gray-200 rounded-2xl" />
                    <div className="h-28 bg-gray-200 rounded-3xl" />
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center text-gray-500 bg-[#FAF9F5] h-dvh ">
                <EditHeader onBackClick={() => router.back()} />
                <div className="p-8">Gagal memuat form pengubahan profil.</div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#FAF9F5] min-h-screen pb-32"
        >
            <EditHeader onBackClick={() => router.back()} />

            <PhotoUploader
                imageUrl={profile.image || PLACEHOLDER_IMAGE}
                onUploadClick={() =>
                    console.log("Choose profile photo from gallery...")
                }
            />

            <EditForm register={register} errors={errors} />

            <MembershipBanner level={profile.role} />

            <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 shadow-lg flex items-center justify-center">
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-[#0D631B] hover:bg-[#0a4d15] active:scale-95 text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <svg
                        className="w-4 h-4 fill-current text-emerald-200"
                        viewBox="0 0 24 24"
                    >
                        <path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H16.17L19,7.83V19M12,10A3,3 0 1,0 12,16A3,3 0 0,0 12,10M8,6V8H15V6H8Z" />
                    </svg>
                    <span>
                        {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                    </span>
                </button>
            </div>
        </form>
    );
}
