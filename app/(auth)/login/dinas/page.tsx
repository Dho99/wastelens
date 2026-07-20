"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Eye,
  EyeOff,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { signIn, signOut } from "@/lib/auth-client";

export default function DinasLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });

      if (result.error) {
        setError("Email atau kata sandi tidak sesuai.");
        return;
      }

      const role = (result.data?.user as { role?: string } | undefined)?.role;
      if (role !== "dinas") {
        await signOut();
        setError("Akun ini tidak memiliki akses sebagai Dinas Lingkungan Hidup.");
        return;
      }

      router.replace("/dinas");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke layanan. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#edf7f2] text-[#17251e] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/images/dlh-fleet-truck.png"
          alt="Armada operasional Dinas Lingkungan Hidup"
          fill
          priority
          className="object-cover"
          sizes="54vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#064e2a]/95 via-[#096a38]/82 to-[#0c442b]/55" />

        <div className="relative z-10 flex items-center gap-3 px-12 py-10 text-white">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <Leaf className="size-6" />
          </span>
          <div>
            <p className="text-lg font-extrabold tracking-[-0.02em]">WasteLens</p>
            <p className="text-xs text-white/70">Government Environmental Portal</p>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl px-12 pb-14 text-white">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
            <ShieldCheck className="size-4" /> Portal resmi operasional DLH
          </span>
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-[-0.04em] xl:text-5xl">
            Respons cepat untuk lingkungan yang lebih bersih.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
            Pantau laporan masyarakat, tugaskan petugas dan armada, serta kelola
            seluruh operasional kebersihan dalam satu dashboard.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="w-full max-w-[470px]">
          <div className="mb-9 flex items-center gap-3 lg:hidden">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#d7f2e2] text-[#087237]">
              <Leaf className="size-6" />
            </span>
            <div>
              <p className="font-extrabold text-[#07672f]">WasteLens</p>
              <p className="text-xs text-[#6b7c73]">Portal Pemerintah</p>
            </div>
          </div>

          <div className="mb-8">
            <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#dff4e8] text-[#087237]">
              <Building2 className="size-6" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#168447]">
              Dinas Lingkungan Hidup
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
              Masuk ke Portal DLH
            </h2>
            <p className="mt-3 leading-6 text-[#6b7c73]">
              Gunakan akun dinas yang telah terdaftar untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="dinas-email" className="mb-2 block text-sm font-bold">
                Email dinas
              </label>
              <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#c8d9d0] bg-white px-4 transition focus-within:border-[#168447] focus-within:ring-4 focus-within:ring-[#168447]/10">
                <Mail className="size-5 shrink-0 text-[#6d8076]" />
                <input
                  id="dinas-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  placeholder="nama@dinas.go.id"
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#9aa9a1]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dinas-password" className="mb-2 block text-sm font-bold">
                Kata sandi
              </label>
              <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#c8d9d0] bg-white px-4 transition focus-within:border-[#168447] focus-within:ring-4 focus-within:ring-[#168447]/10">
                <LockKeyhole className="size-5 shrink-0 text-[#6d8076]" />
                <input
                  id="dinas-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#9aa9a1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-lg p-1 text-[#6d8076] transition hover:bg-[#edf7f2] hover:text-[#087237]"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-[#596c62]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="size-4 accent-[#168447]"
              />
              Ingat saya di perangkat ini
            </label>

            <button
              type="submit"
              disabled={loading || !email.trim() || password.length < 8}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#087237] px-5 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(8,114,55,0.2)] transition hover:bg-[#065f2e] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading && <LoaderCircle className="size-5 animate-spin" />}
              {loading ? "Memverifikasi akun..." : "Masuk ke Dashboard DLH"}
            </button>
          </form>

          <div className="mt-8 border-t border-[#d8e5de] pt-6 text-center text-sm text-[#6b7c73]">
            Bukan akun DLH?{" "}
            <Link href="/login" className="font-bold text-[#087237] hover:underline">
              Masuk ke WasteLens
            </Link>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#839087]">
            <ShieldCheck className="size-4" /> Akses dilindungi dan hanya untuk pengguna berwenang
          </p>
        </div>
      </section>
    </main>
  );
}
