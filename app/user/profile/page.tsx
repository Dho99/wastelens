"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { signOut } from "@/lib/auth-client";
import { useProfile } from "./hooks/useProfile";

// Slices
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { StatsCard } from "./components/StatsCard";
import { SettingsList } from "./components/SettingsList";
import { AppSettingsCard } from "./components/AppSettingsCard";

function ProfileContent() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);
  const { data: profile, isLoading } = useProfile();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      console.log("Signing out user...");
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
      // Fallback redirect if network error or session issues
      router.push("/login");
    }
  };

  if (isLoading) {
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

  if (!profile) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat profil pengguna.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32">
      {/* 1. Header (Profil Saya title & settings cog) */}
      <ProfileHeader onSettingsClick={() => console.log("Settings gear clicked...")} />

      {/* 2. Photo Avatar display, User Name, Eco-role badge */}
      <ProfileAvatar
        name={profile.name}
        ecoRole={profile.ecoRole}
        avatarUrl={profile.profileImageUrl}
        onEditAvatar={() => console.log("Edit avatar clicked...")}
      />

      {/* 3. XP points & rank score card */}
      <StatsCard
        totalPoints={profile.totalPointsXP}
        rankIndex={profile.rankIndex}
        rankCity={profile.rankCity}
      />

      {/* 4. Settings Menus Navigation List */}
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

      {/* 5. App Settings (Notifications Toggle Switch) */}
      <AppSettingsCard />

      {/* 6. Logout Button (Keluar) */}
      <div className="px-4 mb-6">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full border border-[#8C4F2B]/40 hover:bg-[#8C4F2B]/5 active:scale-95 text-[#8C4F2B] font-black text-xs py-4 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          {/* MDI logout */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
          </svg>
          <span>{loggingOut ? "Mengeluarkan..." : "Keluar"}</span>
        </button>
      </div>

      {/* 7. App Version Footer note */}
      <div className="text-center select-none mt-2">
        <p className="text-[10px] text-gray-400 font-extrabold tracking-wide">
          {profile.appVersion}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  );
}
