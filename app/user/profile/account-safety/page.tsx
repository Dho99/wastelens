"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { useSafety } from "./hooks/useSafety";

// Slices
import { SafetyHeader } from "./components/SafetyHeader";
import { ProtectCard } from "./components/ProtectCard";
import { SafetyOptionsList } from "./components/SafetyOptionsList";
import { EncryptionNotice } from "./components/EncryptionNotice";

function AccountSafetyContent() {
  const router = useRouter();
  const { data, isLoading } = useSafety();
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat keamanan akun.
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12">
      <SafetyHeader onBackClick={() => router.back()} />
      <ProtectCard />
      <SafetyOptionsList
        lastPasswordChangeText={data.lastPasswordChangeText}
        twoFactorEnabled={data.twoFactorEnabled}
        activeDevicesCount={data.activeDevicesCount}
        onPasswordClick={() => router.push("/user/profile/change-password")}
        onManageDevicesClick={() => console.log("Navigate to Manage Devices...")}
        onDeleteAccountClick={() => console.log("Confirm Account Deletion...")}
      />
      <EncryptionNotice />
    </div>
  );
}

export default function AccountSafetyPage() {
  return (
    <ErrorBoundary>
      <AccountSafetyContent />
    </ErrorBoundary>
  );
}
