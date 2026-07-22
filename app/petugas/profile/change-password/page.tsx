"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import {
  mdiLockOutline,
  mdiLockReset,
  mdiEyeOutline,
  mdiEyeOffOutline,
  mdiCheckCircle,
} from "@mdi/js";
import { useChangePassword } from "../../hooks/useChangePassword";

export default function ChangePasswordPage() {
  const router = useRouter();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const tooShort = newPassword.length > 0 && newPassword.length < 8;
  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword &&
    !changePassword.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setSuccess(true);
    } catch {
      // error handled via changePassword.isError
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-8 font-sans">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-primary/20">
          <Icon path={mdiCheckCircle} className="size-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-primary">Kata Sandi Diperbarui</h2>
        <p className="mt-2 text-center text-sm text-neutral-500">
          Kata sandi Anda telah berhasil diubah.
        </p>
        <button
          onClick={() => router.push("/petugas/profile")}
          className="mt-8 w-full rounded-full bg-primary py-3.5 text-[15px] font-semibold text-white shadow-md transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          Kembali ke Profil
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen pb-10 pt-6 font-sans">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Icon path={mdiLockReset} className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-800">Ganti Kata Sandi</h2>
            <p className="text-[12px] text-neutral-500">
              Perbarui kata sandi akun Anda
            </p>
          </div>
        </div>

        {/* Error */}
        {changePassword.isError && (
          <div className="rounded-xl bg-red-50 p-3 text-[13px] text-red-700">
            {changePassword.error instanceof Error
              ? changePassword.error.message
              : "Gagal mengubah kata sandi. Periksa kata sandi saat ini."}
          </div>
        )}

        {/* Current Password */}
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block text-[13px] font-medium text-neutral-600"
          >
            Kata Sandi Saat Ini
          </label>
          <div className="flex h-12 items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <Icon path={mdiLockOutline} className="size-5 shrink-0 text-neutral-400" />
            <input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-full w-full bg-transparent text-[14px] text-neutral-800 outline-none placeholder:text-neutral-300"
              placeholder="Masukkan kata sandi saat ini"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="shrink-0 text-neutral-400"
              aria-label={showCurrent ? "Sembunyikan" : "Tampilkan"}
            >
              <Icon
                path={showCurrent ? mdiEyeOffOutline : mdiEyeOutline}
                className="size-5"
              />
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="mb-2 block text-[13px] font-medium text-neutral-600"
          >
            Kata Sandi Baru
          </label>
          <div className="flex h-12 items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <Icon path={mdiLockReset} className="size-5 shrink-0 text-neutral-400" />
            <input
              id="newPassword"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-full w-full bg-transparent text-[14px] text-neutral-800 outline-none placeholder:text-neutral-300"
              placeholder="Minimal 8 karakter"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="shrink-0 text-neutral-400"
              aria-label={showNew ? "Sembunyikan" : "Tampilkan"}
            >
              <Icon
                path={showNew ? mdiEyeOffOutline : mdiEyeOutline}
                className="size-5"
              />
            </button>
          </div>
          {tooShort && (
            <p className="mt-1.5 text-[11px] text-red-500">
              Kata sandi minimal 8 karakter
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-[13px] font-medium text-neutral-600"
          >
            Konfirmasi Kata Sandi Baru
          </label>
          <div className="flex h-12 items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <Icon path={mdiLockReset} className="size-5 shrink-0 text-neutral-400" />
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-full w-full bg-transparent text-[14px] text-neutral-800 outline-none placeholder:text-neutral-300"
              placeholder="Ulangi kata sandi baru"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="shrink-0 text-neutral-400"
              aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}
            >
              <Icon
                path={showConfirm ? mdiEyeOffOutline : mdiEyeOutline}
                className="size-5"
              />
            </button>
          </div>
          {passwordMismatch && (
            <p className="mt-1.5 text-[11px] text-red-500">
              Kata sandi tidak cocok
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-white shadow-md transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {changePassword.isPending ? (
            "Menyimpan..."
          ) : (
            <>
              <Icon path={mdiLockReset} className="size-5" />
              Simpan Kata Sandi
            </>
          )}
        </button>
      </div>
    </form>
  );
}
