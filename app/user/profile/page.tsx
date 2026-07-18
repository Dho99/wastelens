"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

// Slices
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { StatsCard } from "./components/StatsCard";
import { SettingsList } from "./components/SettingsList";
import { AppSettingsCard } from "./components/AppSettingsCard";

const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await signOut();
            router.push("/login");
            router.refresh();
        } catch {
            router.push("/login");
        }
    };

    if (isPending) {
        return (
            <div className="space-y-4 p-4 animate-pulse">
                <div className="flex justify-between items-center h-10" />
                <div className="h-28 w-28 bg-gray-200 rounded-full mx-auto" />
                <div className="h-6 w-32 bg-gray-200 rounded-md mx-auto" />
                <div className="h-16 bg-gray-200 rounded-3xl" />
                <div className="h-48 bg-gray-200 rounded-3xl" />
            </div>
        );
    }

    const displayName =
        (session?.user as { name?: string })?.name ||
        session?.user?.name ||
        "Pengguna";
    const avatarUrl = session?.user?.image || PLACEHOLDER_IMAGE;

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-32">
            <ProfileHeader
                onSettingsClick={() => console.log("Settings gear clicked...")}
            />

            <ProfileAvatar
                name={displayName}
                ecoRole="PAHLAWAN LINGKUNGAN"
                avatarUrl={avatarUrl}
                onEditAvatar={() => console.log("Edit avatar clicked...")}
            />

            <StatsCard totalPoints={1250} rankIndex={12} rankCity="Jakarta" />

            <SettingsList
                onMenuClick={(id) => {
                    if (id === "info-pribadi") {
                        router.push("/user/profile/edit");
                    } else if (id === "keamanan") {
                        router.push("/user/profile/account-safety");
                    } else if (id === "bantuan") {
                        router.push("/user/profile/help-center");
                    } else if (id === "tentang") {
                        router.push("/user/profile/about");
                    }
                }}
            />

            <AppSettingsCard />

            <div className="px-4 mb-6">
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full border border-[#8C4F2B]/40 hover:bg-[#8C4F2B]/5 active:scale-95 text-[#8C4F2B] font-black text-xs py-4 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                    </svg>
                    <span>{loggingOut ? "Mengeluarkan..." : "Keluar"}</span>
                </button>
            </div>

            <div className="text-center select-none mt-2">
                <p className="text-[10px] text-gray-400 font-extrabold tracking-wide">
                    Versi Aplikasi 2.4.0 (Build 108)
                </p>
            </div>
        </div>
    );
}
