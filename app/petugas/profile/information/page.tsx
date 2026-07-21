"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@mdi/react";
import {
  mdiAccountOutline,
  mdiCameraOutline,
  mdiCheckCircle,
  mdiContentSaveOutline,
  mdiEmailOutline,
  mdiLockOutline,
  mdiMapMarkerOutline,
  mdiPhoneOutline,
} from "@mdi/js";
import { usePetugasProfile, useUpdateProfile } from "../../hooks/useProfile";

const PLACEHOLDER_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

function formatZone(zone: string | null): string {
  if (!zone) return "Belum ditentukan";
  return zone;
}

function formatId(id: string): string {
  return `WL-${id.slice(0, 8).toUpperCase()}`;
}

export default function ProfileInformationPage() {
  const { data: profile, isLoading, isError, refetch } = usePetugasProfile();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setNama(profile.nama);
      setNoHp(profile.no_hp);
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaved(false);
    await updateProfile.mutateAsync({ nama, no_hp: noHp });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const hasChanges = profile && (nama !== profile.nama || noHp !== profile.no_hp);

  if (isLoading) {
    return (
      <div className="min-h-screen space-y-6 py-6 pb-8 animate-pulse">
        <div className="mx-auto size-28 rounded-full bg-neutral-100" />
        <div className="mx-auto h-5 w-32 rounded-md bg-neutral-100" />
        <div className="mx-auto h-4 w-48 rounded-md bg-neutral-100" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 rounded bg-neutral-100" />
            <div className="h-12 rounded-full bg-neutral-100" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-medium text-red-800">Gagal memuat profil</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const displayAvatar = avatarPreview ?? profile.image ?? PLACEHOLDER_AVATAR;

  return (
    <div className="min-h-screen pb-10 font-sans">
      <div className="space-y-8 pt-6">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="relative size-28 overflow-hidden rounded-full ring-4 ring-primary/10">
              <Image
                src={displayAvatar}
                alt={profile.nama}
                fill
                unoptimized
                className="object-cover"
                sizes="112px"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-0.5 -right-0.5 flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform active:scale-95"
              aria-label="Ganti foto profil"
            >
              <Icon path={mdiCameraOutline} className="size-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <h2 className="text-lg font-bold text-neutral-800">{profile.nama}</h2>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-full bg-primary/15 px-3 py-0.5 text-[11px] font-semibold text-primary">
              Petugas Lapangan
            </span>
            <span className="text-[11px] text-neutral-400">
              ID: {formatId(profile.id)}
            </span>
          </div>
        </div>

        {saved && (
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-50 py-2 text-[13px] font-medium text-emerald-700">
            <Icon path={mdiCheckCircle} className="size-4" />
            Profil berhasil disimpan
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="nama" className="mb-2 block text-[13px] font-medium text-neutral-600">
              Full Name
            </label>
            <div className="flex h-12 items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              <Icon path={mdiAccountOutline} className="size-5 shrink-0 text-neutral-400" />
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="h-full w-full bg-transparent text-[14px] text-neutral-800 outline-none placeholder:text-neutral-300"
                placeholder="Nama lengkap"
              />
            </div>
          </div>

          <div>
            <label htmlFor="noHp" className="mb-2 block text-[13px] font-medium text-neutral-600">
              Phone Number
            </label>
            <div className="flex h-12 items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              <Icon path={mdiPhoneOutline} className="size-5 shrink-0 text-neutral-400" />
              <input
                id="noHp"
                type="tel"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="h-full w-full bg-transparent text-[14px] text-neutral-800 outline-none placeholder:text-neutral-300"
                placeholder="Nomor telepon"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-neutral-600">
              Email Address
            </label>
            <div className="flex h-12 items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-4">
              <Icon path={mdiEmailOutline} className="size-5 shrink-0 text-neutral-400" />
              <input
                id="email"
                type="email"
                value={profile.email ?? ""}
                readOnly
                disabled
                className="h-full w-full bg-transparent text-[14px] text-neutral-500 outline-none"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-400">
              Email tidak dapat diubah melalui halaman ini
            </p>
          </div>

          <div>
            <label htmlFor="zone" className="mb-2 block text-[13px] font-medium text-neutral-600">
              Assigned Zone
            </label>
            <div className="flex h-12 items-center gap-3 rounded-full border border-neutral-200 bg-blue-50/40 px-4">
              <Icon path={mdiMapMarkerOutline} className="size-5 shrink-0 text-neutral-400" />
              <input
                id="zone"
                type="text"
                value={formatZone(profile.zone)}
                readOnly
                disabled
                className="h-full w-full bg-transparent text-[14px] text-neutral-600 outline-none"
              />
              <Icon path={mdiLockOutline} className="size-4 shrink-0 text-neutral-400" />
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-400">
              Contact supervisor to change assigned zone
            </p>
          </div>
        </div>

        {updateProfile.isError && (
          <div className="rounded-xl bg-red-50 p-3 text-[13px] text-red-700">
            {updateProfile.error instanceof Error
              ? updateProfile.error.message
              : "Gagal menyimpan profil"}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!hasChanges || updateProfile.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-white shadow-md transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateProfile.isPending ? (
            "Menyimpan..."
          ) : (
            <>
              <Icon path={mdiContentSaveOutline} className="size-5" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
