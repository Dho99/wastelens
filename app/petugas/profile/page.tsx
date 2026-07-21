"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiAccount,
  mdiCheckboxMarkedCircleOutline,
  mdiHelpBoxOutline,
  mdiLogout,
  mdiSecurity,
} from "@mdi/js";
import { signOut, useSession } from "@/lib/auth-client";
import { usePetugasProfile } from "../hooks/useProfile";

import { ProfileAvatar } from "@/app/user/profile/components/ProfileAvatar";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export default function ProfilePage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { data: session, isPending: sessionLoading } = useSession();
  const { data: profile, isLoading: profileLoading } = usePetugasProfile();

  const displayName =
    (session?.user as { name?: string })?.name ??
    session?.user?.name ??
    "Pengguna";
  const avatarUrl = session?.user?.image || PLACEHOLDER_IMAGE;

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

  if (sessionLoading) {
    return (
      <div className="min-h-screen space-y-4 p-4 pb-8 animate-pulse">
        <div className="flex h-10 items-center justify-between" />
        <div className="mx-auto h-28 w-28 rounded-full bg-gray-200" />
        <div className="mx-auto h-6 w-32 rounded-md bg-gray-200" />
        <div className="h-16 rounded-3xl bg-gray-200" />
        <div className="h-48 rounded-3xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <ProfileAvatar
        name={displayName}
        ecoRole="Petugas Lapangan"
        avatarUrl={avatarUrl}
        onEditAvatar={() => {}}
      />

      <div className="mb-8 flex flex-col items-center rounded-xl border border-neutral-300 p-4 text-center">
        <div className="m-auto mb-2 rounded-full bg-primary/20 p-2 text-primary">
          <Icon path={mdiCheckboxMarkedCircleOutline} size={1} />
        </div>
        {profileLoading ? (
          <div className="h-8 w-16 animate-pulse rounded-md bg-neutral-100" />
        ) : (
          <h4 className="text-2xl font-bold">{profile?.tugas_selesai ?? 0}</h4>
        )}
        <p>Tugas Selesai</p>
      </div>

      <p className="mb-2 text-sm font-medium text-neutral-500">Pengaturan Akun</p>
      <div className="mb-8 overflow-hidden rounded-xl border border-neutral-300">
        <Link
          href="/petugas/profile/information"
          className="flex items-center gap-2 border-b border-neutral-300 p-4 transition-colors hover:bg-neutral-50"
        >
          <div className="rounded-lg bg-primary/20 p-2 text-primary">
            <Icon path={mdiAccount} size={1} />
          </div>
          <span className="font-medium">Informasi Pribadi</span>
        </Link>
        <Link
          href="/user/profile/change-password"
          className="flex items-center gap-2 border-b border-neutral-300 p-4 transition-colors hover:bg-neutral-50"
        >
          <div className="rounded-lg bg-primary/20 p-2 text-primary">
            <Icon path={mdiSecurity} size={1} />
          </div>
          <span className="font-medium">Ganti Kata Sandi</span>
        </Link>
        <div className="flex items-center gap-2 border-b border-neutral-300 p-4 opacity-50">
          <div className="rounded-lg bg-primary/20 p-2 text-primary">
            <Icon path={mdiHelpBoxOutline} size={1} />
          </div>
          <span className="font-medium">Pusat Bantuan</span>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-red-500/40 py-4 font-black text-red-500 transition-all duration-200 hover:bg-red-500/5 disabled:opacity-50"
        >
          <Icon path={mdiLogout} size={1} />
          <span>{loggingOut ? "Mengeluarkan..." : "Keluar"}</span>
        </button>
      </div>
    </div>
  );
}
