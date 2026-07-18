"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { toast } from "sonner";
import { useChangePassword } from "./hooks/useChangePassword";

// Services
import { validatePassword } from "./services/passwordService";

// Slices
import { PasswordHeader } from "./components/PasswordHeader";
import { VisualBanner } from "./components/VisualBanner";
import { PasswordForm } from "./components/PasswordForm";
import { RequirementsPanel } from "./components/RequirementsPanel";

function ChangePasswordContent() {
  const router = useRouter();
  const { setHideTabBar } = useTabBar();
  const changePassword = useChangePassword();

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const validations = validatePassword(currentPass, newPass, confirmPass);
  const isValid = validations.minLength && validations.containsMixed && validations.matchesConfirm;

  const handleSaveChanges = async () => {
    if (!isValid) {
      toast.error("Pastikan semua syarat kata sandi terpenuhi!");
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword: currentPass, newPassword: newPass });
      toast.success("Kata sandi berhasil diperbarui!");
      router.push("/user/profile");
    } catch {
      toast.error("Gagal mengubah kata sandi. Periksa kata sandi saat ini.");
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32">
      <PasswordHeader onBackClick={() => router.back()} />
      <VisualBanner />
      <PasswordForm
        currentPass={currentPass}
        newPass={newPass}
        confirmPass={confirmPass}
        onCurrentChange={setCurrentPass}
        onNewChange={setNewPass}
        onConfirmChange={setConfirmPass}
      />
      <RequirementsPanel validations={validations} />

      <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 shadow-lg flex items-center justify-center">
        <button
          onClick={handleSaveChanges}
          disabled={!isValid || changePassword.isPending}
          className={`w-full font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid && !changePassword.isPending
              ? "bg-[#0D631B] hover:bg-[#0a4d15] active:scale-95 text-white shadow-emerald-950/10"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H16.17L19,7.83V19M12,10A3,3 0 1,0 12,16A3,3 0 0,0 12,10M8,6V8H15V6H8Z" />
          </svg>
          <span>{changePassword.isPending ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <ErrorBoundary>
      <ChangePasswordContent />
    </ErrorBoundary>
  );
}
