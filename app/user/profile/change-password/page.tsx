"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

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

  // Input states (initialized with mock bullet dots for initial render as per screenshot)
  const [currentPass, setCurrentPass] = useState("password123");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  // Compute validations
  const validations = validatePassword(currentPass, newPass, confirmPass);
  const isValid = validations.minLength && validations.containsMixed && validations.matchesConfirm;

  const handleSaveChanges = () => {
    if (!isValid) {
      alert("Pastikan semua syarat kata sandi terpenuhi!");
      return;
    }
    console.log("Saving password changes...");
    alert("Kata sandi berhasil diperbarui!");
    router.push("/user/profile");
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32">
      {/* 1. Header (Ubah Kata Sandi title & back arrow) */}
      <PasswordHeader onBackClick={() => router.back()} />

      {/* 2. Visual Banner card */}
      <VisualBanner />

      {/* 3. Password inputs list */}
      <PasswordForm
        currentPass={currentPass}
        newPass={newPass}
        confirmPass={confirmPass}
        onCurrentChange={setCurrentPass}
        onNewChange={setNewPass}
        onConfirmChange={setConfirmPass}
      />

      {/* 4. Password validation requirement checklist */}
      <RequirementsPanel validations={validations} />

      {/* 5. Save Changes Sticky Button */}
      <div className="fixed inset-x-0 bottom-0 z-30 max-w-screen-sm mx-auto w-full bg-white border-t border-gray-100 p-4 shadow-lg flex items-center justify-center">
        <button
          onClick={handleSaveChanges}
          disabled={!isValid}
          className={`w-full font-black text-xs py-4 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid
              ? "bg-[#0D631B] hover:bg-[#0a4d15] active:scale-95 text-white shadow-emerald-950/10"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          {/* MDI content-save-outline */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H16.17L19,7.83V19M12,10A3,3 0 1,0 12,16A3,3 0 0,0 12,10M8,6V8H15V6H8Z" />
          </svg>
          <span>Simpan Perubahan</span>
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
