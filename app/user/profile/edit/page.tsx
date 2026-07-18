"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getEditProfileDummyData, EditProfileFormData } from "./services/editProfileService";

// Slices
import { EditHeader } from "./components/EditHeader";
import { PhotoUploader } from "./components/PhotoUploader";
import { EditForm } from "./components/EditForm";
import { MembershipBanner } from "./components/MembershipBanner";

function EditProfileContent() {
  const router = useRouter();
  const [formData, setFormData] = useState<EditProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    // Load initial profile editing dataset from service layer
    const data = getEditProfileDummyData();
    setFormData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const handleSaveChanges = () => {
    console.log("Saving user profile updates...", formData);
    alert("Perubahan profil berhasil disimpan!");
    router.push("/user/profile");
  };

  if (loading) {
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

  if (!formData) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat form pengubahan profil.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32">
      {/* 1. Header (Edit Profil title & back arrow) */}
      <EditHeader onBackClick={() => router.back()} />

      {/* 2. Photo Uploader area */}
      <PhotoUploader
        imageUrl={formData.profileImageUrl}
        onUploadClick={() => console.log("Choose profile photo from gallery...")}
      />

      {/* 3. Text inputs fields */}
      <EditForm
        fullName={formData.fullName}
        email={formData.email}
        phone={formData.phone}
        address={formData.address}
        onFullNameChange={(val) => setFormData((prev) => prev ? { ...prev, fullName: val } : null)}
        onEmailChange={(val) => setFormData((prev) => prev ? { ...prev, email: val } : null)}
        onPhoneChange={(val) => setFormData((prev) => prev ? { ...prev, phone: val } : null)}
        onAddressChange={(val) => setFormData((prev) => prev ? { ...prev, address: val } : null)}
      />

      {/* 4. Ecological Level Membership Badge */}
      <MembershipBanner level={formData.membershipLevel} />

      {/* 5. Save Changes Sticky Button */}
      <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 shadow-lg flex items-center justify-center">
        <button
          onClick={handleSaveChanges}
          className="w-full bg-[#0D631B] hover:bg-[#0a4d15] active:scale-95 text-white font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          {/* MDI content-save-outline */}
          <svg className="w-4 h-4 fill-current text-emerald-200" viewBox="0 0 24 24">
            <path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H16.17L19,7.83V19M12,10A3,3 0 1,0 12,16A3,3 0 0,0 12,10M8,6V8H15V6H8Z" />
          </svg>
          <span>Simpan Perubahan</span>
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
