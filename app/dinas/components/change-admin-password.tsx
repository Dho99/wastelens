"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  LockKeyhole,
  Save,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { updateDlhStore, useDlhStore } from "@/lib/dlh-store";

type PasswordField = "current" | "next" | "confirm";

export function ChangeAdminPassword() {
  const router = useRouter();
  const store = useDlhStore();
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({
    current: false,
    next: false,
    confirm: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const checks = useMemo(
    () => ({
      length: newPassword.length >= 12,
      number: /\d/.test(newPassword),
      symbol: /[^A-Za-z0-9]/.test(newPassword),
      mixed: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    }),
    [newPassword],
  );
  const strength = Object.values(checks).filter(Boolean).length;
  const strengthLabel =
    strength <= 1
      ? "Lemah"
      : strength === 2
        ? "Cukup"
        : strength === 3
          ? "Kuat"
          : "Sangat Kuat";

  const toggle = (field: PasswordField) =>
    setVisible((current) => ({ ...current, [field]: !current[field] }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!Object.values(checks).every(Boolean)) {
      setError("Kata sandi baru harus memenuhi seluruh persyaratan keamanan.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    const data = new FormData(event.currentTarget);
    const currentPassword = String(data.get("currentPassword"));
    if (currentPassword === newPassword) {
      setError("Kata sandi baru tidak boleh sama dengan kata sandi saat ini.");
      return;
    }

    setSaving(true);
    if (process.env.NODE_ENV !== "development") {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (result.error) {
        setError(
          result.error.message ??
            "Kata sandi saat ini salah atau perubahan gagal.",
        );
        setSaving(false);
        return;
      }
    }
    updateDlhStore((draft) => {
      draft.admin.passwordUpdatedAt = "baru saja";
    });
    setSaving(false);
    setSuccess(true);
  };

  return (
      <>
      <div className="flex min-w-0 flex-1 flex-col bg-[#f4fbff]">
        <header className="flex h-14 shrink-0 items-center border-b border-[#c7d6cc] px-5 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali"
            className="rounded-full p-2 hover:bg-white"
          >
            <ArrowLeft className="size-5" />
          </button>
          <Link
            href="/dinas/notifications"
            aria-label="Notifikasi"
            className="ml-auto rounded-full p-2 hover:bg-white"
          >
            <Bell className="size-5" />
          </Link>
          <span className="relative ml-4 size-9 overflow-hidden rounded-full border-2 border-[#087529] bg-[#dceef5]">
            <Image
              src={store.admin.photo ?? "/images/dlh-field-officer.png"}
              alt={store.admin.name}
              fill
              className="object-cover object-top"
              sizes="36px"
              unoptimized={Boolean(store.admin.photo?.startsWith("data:") || store.admin.photo?.startsWith("/api/dinas/media/"))}
            />
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-[1160px]">
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#536159]">
              <span>Keamanan</span>
              <span>›</span>
              <span className="font-bold text-[#087529]">Ganti Kata Sandi</span>
            </nav>
            <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              Ubah Kredensial Akses
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#667169]">
              Perbarui kata sandi Anda secara berkala untuk menjaga keamanan
              data operasional WasteLens.
            </p>

            {success ? (
              <section className="mt-7 max-w-2xl rounded-[24px] border border-[#bcebd1] bg-white p-8 text-center shadow-sm">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#daf3e5] text-[#087529]">
                  <CheckCircle2 className="size-8" />
                </span>
                <h2 className="mt-5 text-xl font-extrabold">
                  Kata sandi berhasil diperbarui
                </h2>
                <p className="mt-2 text-sm text-[#667169]">
                  Sesi lain telah ditutup untuk membantu menjaga keamanan akun
                  Anda.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/dinas/accounts")}
                  className="mt-6 h-11 rounded-full bg-[#087529] px-8 text-sm font-bold text-white"
                >
                  Kembali ke Profil
                </button>
              </section>
            ) : (
              <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_380px]">
                <form
                  onSubmit={submit}
                  className="rounded-[24px] border border-[#bdcbbd] bg-white p-6 shadow-sm sm:p-8"
                >
                  {error && (
                    <div
                      role="alert"
                      className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                    >
                      {error}
                    </div>
                  )}
                  <PasswordInput
                    label="Kata Sandi Saat Ini"
                    name="currentPassword"
                    visible={visible.current}
                    onToggle={() => toggle("current")}
                    icon={<LockKeyhole />}
                    placeholder="Masukkan kata sandi saat ini"
                  />
                  <div className="my-6 border-t border-[#d4ded7]" />
                  <PasswordInput
                    label="Kata Sandi Baru"
                    name="newPassword"
                    value={newPassword}
                    onChange={setNewPassword}
                    visible={visible.next}
                    onToggle={() => toggle("next")}
                    icon={<ShieldCheck />}
                    placeholder="Masukkan minimal 12 karakter"
                  />
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>Kekuatan Kata Sandi</span>
                      <span
                        className={
                          strength >= 3 ? "text-[#087529]" : "text-amber-600"
                        }
                      >
                        {strengthLabel}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <span
                          key={level}
                          className={`h-1.5 rounded-full ${strength >= level ? "bg-[#087529]" : "bg-[#dce8ed]"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <PasswordInput
                      label="Konfirmasi Kata Sandi Baru"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      visible={visible.confirm}
                      onToggle={() => toggle("confirm")}
                      icon={<CheckCircle2 />}
                      placeholder="Ulangi kata sandi baru"
                    />
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#087529] px-8 text-sm font-bold text-white shadow-md disabled:opacity-60"
                    >
                      <Save className="size-4" />
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/dinas/accounts")}
                      className="h-12 rounded-full border-2 border-[#bdcbbd] px-8 text-sm font-bold text-[#465148]"
                    >
                      Batal
                    </button>
                  </div>
                </form>

                <aside className="relative overflow-hidden rounded-[24px] bg-[#102027] p-7 text-white shadow-sm">
                  <span className="absolute -right-12 -top-14 size-36 rounded-full bg-[#29433f]/70" />
                  <h2 className="relative flex items-center gap-3 text-lg font-extrabold">
                    <Lightbulb className="size-5 text-[#8ef28e]" />
                    Tips Kata Sandi Kuat
                  </h2>
                  <ul className="relative mt-6 space-y-5 text-sm leading-6 text-white/80">
                    <Tip valid={checks.length}>
                      Gunakan kombinasi minimal 12 karakter alfanumerik.
                    </Tip>
                    <Tip valid={checks.number && checks.symbol}>
                      Sertakan simbol khusus dan angka.
                    </Tip>
                    <Tip valid={checks.mixed}>
                      Gunakan gabungan huruf besar dan kecil.
                    </Tip>
                    <Tip
                      valid={
                        newPassword.length > 0 &&
                        newPassword !== confirmPassword
                      }
                    >
                      Jangan gunakan kata sandi yang sama dengan akun lain.
                    </Tip>
                  </ul>
                </aside>
              </div>
            )}
          </div>
        </main>
      </div>
      </>
  );
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
  icon,
  placeholder,
}: {
  label: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-bold text-[#26312a]">
      {label}
      <span className="relative mt-2 block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#536159] [&_svg]:size-5">
          {icon}
        </span>
        <input
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={
            onChange ? (event) => onChange(event.target.value) : undefined
          }
          required
          minLength={name === "currentPassword" ? 8 : 12}
          autoComplete={
            name === "currentPassword" ? "current-password" : "new-password"
          }
          placeholder={placeholder}
          className="h-12 w-full rounded-full border-2 border-[#bdcbbd] bg-[#f4fbff] pl-12 pr-12 text-sm font-normal outline-none placeholder:text-[#87919d] focus:border-[#087529]"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Sembunyikan ${label}` : `Tampilkan ${label}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#536159]"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </span>
    </label>
  );
}

function Tip({
  children,
  valid,
}: {
  children: React.ReactNode;
  valid: boolean;
}) {
  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${valid ? "border-[#8ef28e] text-[#8ef28e]" : "border-white/50 text-white/50"}`}
      >
        <Check className="size-3" />
      </span>
      <span>{children}</span>
    </li>
  );
}
