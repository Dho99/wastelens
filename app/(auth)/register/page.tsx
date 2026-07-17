"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { Eye, EyeClosed, Lock, Mail, User } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await signUp.email({
      name: nama,
      email,
      password,
      nama,
      role: "user",
    } as never);

    if (err) {
      setError(err.message ?? "Gagal mendaftar.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center mb-8">
          <h1 className="mt-4 text-xl font-bold text-primary mb-2">WasteLens</h1>
          <div className="w-14 h-1 bg-primary rounded-full m-auto mb-8" />
          <p className="text-xl text-neutral-950 mb-2">Buat akun baru</p>
          <p className="text-neutral-700">Langkah awal untuk lingkungan yang lebih bersih dan berkelanjutan.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="nama"
              className="mb-1 block text-sm font-medium text-neutral-700 ms-4"
            >
              Nama Lengkap
            </label>
            <div className="border border-neutral-300 rounded-full group flex items-center px-4 focus-within:border-primary focus-within:ring-1">
              <User size={18} className="text-neutral-500" />
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full px-2 py-2.5 outline-none"
                placeholder="Nama Anda"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-neutral-700 ms-4"
            >
              Email
            </label>
            <div className="border border-neutral-300 rounded-full group flex items-center px-4 focus-within:border-primary focus-within:ring-1">
              <Mail size={18} className="text-neutral-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-2 py-2.5 outline-none"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-neutral-700 ms-4"
            >
              Password
            </label>
            <div className="border border-neutral-300 rounded-full group flex items-center px-4 focus-within:border-primary focus-within:ring-1">
              <Lock size={18} className="text-neutral-500" />
              <input
                id="password"
                type={seePassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 outline-none"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setSeePassword(!seePassword)} className="cursor-pointer">
                {seePassword ?
                  <EyeClosed className="text-neutral-500" /> :
                  <Eye className="text-neutral-500" />
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
          <div className="h-px flex-1 bg-neutral-300" />
          <span>Atau masuk dengan</span>
          <div className="h-px flex-1 bg-neutral-300" />
        </div>

        <button
          type="button"
          disabled={loading}
          className="w-full rounded-full px-4 py-2.5 font-semibold cursor-pointer border border-neutral-300 flex items-center justify-center gap-2"
        >
          <Image src={"/icon/gugel.svg"} alt="google" width={20} height={20} />
          {loading ? "Memproses..." : "Google"}
        </button>

        <p className="text-center text-sm text-neutral-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
