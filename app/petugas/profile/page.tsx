"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

// Services
import { getUserProfileDummyData } from "@/app/user/profile/services/profileService";

// Slices
import { ProfileAvatar } from "@/app/user/profile/components/ProfileAvatar";
import { mdiAccount, mdiBell, mdiCheckboxMarkedCircleOutline, mdiHelpBoxOutline, mdiLogout, mdiSecurity, mdiStar } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const profile = getUserProfileDummyData();

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

  // if (loading) {
  //   return (
  //     <div className="space-y-4 p-4 animate-pulse">
  //       <div className="flex justify-between items-center h-10" />
  //       <div className="h-28 w-28 bg-gray-200 rounded-full mx-auto" />
  //       <div className="h-6 w-32 bg-gray-200 rounded-md mx-auto" />
  //       <div className="h-16 bg-gray-200 rounded-3xl" />
  //       <div className="h-48 bg-gray-200 rounded-3xl" />
  //     </div>
  //   );
  // }

  if (!profile) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat profil pengguna.
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <ProfileAvatar
        name={profile.name}
        ecoRole={"Petugas Senior"}
        avatarUrl={profile.profileImageUrl}
        onEditAvatar={() => console.log("Edit avatar clicked...")}
      />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="text-center border border-neutral-300 p-4 rounded-xl flex flex-col items-center">
          <div className="m-auto bg-primary/20 p-2 rounded-full text-primary mb-2">
            <Icon path={mdiCheckboxMarkedCircleOutline} size={1} />
          </div>
          <h4 className="text-2xl font-bold">142</h4>
          <p>Tugas Selesai</p>
        </div>

        <div className="text-center border border-neutral-300 p-4 rounded-xl flex flex-col items-center">
          <div className="m-auto bg-accent/20 p-2 rounded-full text-accent mb-2">
            <Icon path={mdiStar} size={1} />
          </div>
          <h4 className="text-2xl font-bold">{"4.9/5"}</h4>
          <p>Rating</p>
        </div>
      </div>

      <p className="mb-2">Pengaturan Akun</p>
      <div className="border border-neutral-300 rounded-xl overflow-hidden mb-8">
        <Link href={"/petugas/profile/detail"} className="flex items-center p-4 gap-2 border-b border-neutral-300">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <Icon path={mdiAccount} size={1} />
          </div>
          <span className="font-medium">Informasi Pribadi</span>
        </Link>
        <Link href={"/petugas/profile/detail"} className="flex items-center p-4 gap-2 border-b border-neutral-300">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <Icon path={mdiSecurity} size={1} />
          </div>
          <span className="font-medium">Keamanan Akun</span>
        </Link>
        <Link href={"/petugas/profile/detail"} className="flex items-center p-4 gap-2 border-b border-neutral-300">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <Icon path={mdiBell} size={1} />
          </div>
          <span className="font-medium">Notifikasi</span>
        </Link>
        <Link href={"/petugas/profile/detail"} className="flex items-center p-4 gap-2 border-b border-neutral-300">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <Icon path={mdiHelpBoxOutline} size={1} />
          </div>
          <span className="font-medium">Informasi Pribadi</span>
        </Link>
      </div>

      {/* 6. Logout Button (Keluar) */}
      <div className="mb-6">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full border border-red-500/40 hover:bg-red-500/5 cursor-pointer text-red-500 font-black py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          <Icon path={mdiLogout} size={1} />
          <span>{loggingOut ? "Mengeluarkan..." : "Keluar"}</span>
        </button>
      </div>
    </div>
  );
}
