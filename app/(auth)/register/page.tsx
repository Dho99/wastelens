"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-600">
            <svg
              className="size-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold">Daftar Akun</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Buat akun baru untuk mulai menggunakan Sampah
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="nama"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Nama Lengkap
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Nama Anda"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Minimal 8 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-600 hover:text-emerald-700"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
