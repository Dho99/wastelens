"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { toast } from "sonner";
import { useProfileQuery, useUpdateProfile } from "./hooks/useEditProfile";

// Slices
import { EditHeader } from "./components/EditHeader";
import { PhotoUploader } from "./components/PhotoUploader";
import { EditForm } from "./components/EditForm";
import { MembershipBanner } from "./components/MembershipBanner";

function EditProfileContent() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfileQuery();
  const updateProfile = useUpdateProfile();
  const { setHideTabBar } = useTabBar();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const initialized = useRef(false);
  useEffect(() => {
    if (profile && !initialized.current) {
      initialized.current = true;
      setFullName(profile.name);
      setEmail(profile.email ?? "");
    }
  }, [profile]);

  const handleSaveChanges = async () => {
    try {
      await updateProfile.mutateAsync({ fullName, email });
      toast.success("Perubahan profil berhasil disimpan!");
      router.push("/user/profile");
    } catch {
      toast.error("Gagal menyimpan perubahan profil");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-28 w-28 bg-gray-200 rounded-full mx-auto" />
        <div className="h-10 bg-gray-200 rounded-2xl" />
        <div className="h-10 bg-gray-200 rounded-2xl" />
        <div className="h-28 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat form pengubahan profil.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32">
      <EditHeader onBackClick={() => router.back()} />

      <PhotoUploader
        imageUrl={profile.profileImageUrl}
        onUploadClick={() => console.log("Choose profile photo from gallery...")}
      />

      <EditForm
        fullName={fullName}
        email={email}
        phone={phone}
        address={address}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onAddressChange={setAddress}
      />

      <MembershipBanner level={profile.ecoRole} />

      <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 shadow-lg flex items-center justify-center">
        <button
          onClick={handleSaveChanges}
          disabled={updateProfile.isPending}
          className="w-full bg-[#0D631B] hover:bg-[#0a4d15] active:scale-95 text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4 fill-current text-emerald-200" viewBox="0 0 24 24">
            <path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H16.17L19,7.83V19M12,10A3,3 0 1,0 12,16A3,3 0 0,0 12,10M8,6V8H15V6H8Z" />
          </svg>
          <span>{updateProfile.isPending ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <ErrorBoundary>
      <EditProfileContent />
    </ErrorBoundary>
  );
}
