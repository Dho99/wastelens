"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Loader2, CheckCircle } from "lucide-react";

const ROLES = ["user", "petugas", "kopdes", "dinas", "admin"] as const;
const ROLE_LABELS: Record<string, string> = {
  user: "Warga",
  petugas: "Petugas",
  kopdes: "Kopdes",
  dinas: "Dinas",
  admin: "Admin",
};

type DinasOption = {
  id: string;
  nama_dinas: string;
  kontak: string;
};

export default function AddUserPage() {
  const router = useRouter();

  // Common fields
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Dinas fields (petugas role)
  const [dinasList, setDinasList] = useState<DinasOption[]>([]);
  const [dinasId, setDinasId] = useState("");

  // Dinas fields (dinas role)
  const [namaDinas, setNamaDinas] = useState("");
  const [kontakDinas, setKontakDinas] = useState("");

  // Kopdes fields
  const [kopdesNama, setKopdesNama] = useState("");
  const [kopdesAlamat, setKopdesAlamat] = useState("");

  // State
  const [loading, setLoading] = useState(false);
  const [loadingDinas, setLoadingDinas] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDinas = useCallback(async () => {
    setLoadingDinas(true);
    try {
      const res = await fetch("/api/admin/dinas");
      if (res.ok) {
        const data: DinasOption[] = await res.json();
        setDinasList(data);
        if (data.length > 0) setDinasId(data[0].id);
      }
    } catch {
    } finally {
      setLoadingDinas(false);
    }
  }, []);

  useEffect(() => {
    if (role === "petugas") {
      // fetchDinas is stable (useCallback with []), and role is the
      // only trigger; suppressing the rule matches the codebase convention.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDinas();
    }
  }, [role, fetchDinas]);

  function resetForm() {
    setNama("");
    setEmail("");
    setPassword("");
    setRole("user");
    setDinasId("");
    setNamaDinas("");
    setKontakDinas("");
    setKopdesNama("");
    setKopdesAlamat("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic client-side validation
    if (role === "petugas" && !dinasId) {
      setError("Pilih Dinas terlebih dahulu");
      return;
    }
    if (role === "dinas") {
      if (!namaDinas.trim()) { setError("Nama Dinas wajib diisi"); return; }
      if (!kontakDinas.trim()) { setError("Kontak Dinas wajib diisi"); return; }
    }
    if (role === "kopdes") {
      if (!kopdesNama.trim()) { setError("Nama Kopdes wajib diisi"); return; }
      if (!kopdesAlamat.trim()) { setError("Alamat Kopdes wajib diisi"); return; }
    }

    setLoading(true);

    const body: Record<string, string> = {
      nama: nama.trim(),
      email: email.trim(),
      password,
      role,
    };

    if (role === "petugas") body.dinas_id = dinasId;
    if (role === "dinas") {
      body.nama_dinas = namaDinas.trim();
      body.kontak_dinas = kontakDinas.trim();
    }
    if (role === "kopdes") {
      body.kopdes_nama = kopdesNama.trim();
      body.kopdes_alamat = kopdesAlamat.trim();
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Gagal membuat pengguna");
        setLoading(false);
        return;
      }

      setSuccess(json.message ?? "Pengguna berhasil dibuat");
      resetForm();

      setTimeout(() => router.push("/admin/users"), 1200);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6 lg:p-8">
      {/* Header */}
      <Link
        href="/admin/users"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Pengguna
      </Link>

      <h1 className="mb-8 text-2xl font-bold">Tambah Pengguna</h1>

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama */}
        <div>
          <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Nama Lengkap
          </label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="off"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            placeholder="nama@email.com"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            autoComplete="new-password"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            placeholder="Minimal 8 karakter"
          />
        </div>

        {/* Role selector */}
        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Role
          </label>
          <div className="relative">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full appearance-none rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>
        </div>

        {/* ── Role-specific fields ──────────────────── */}

        {/* Petugas: Dinas dropdown */}
        {role === "petugas" && (
          <div>
            <label htmlFor="dinas" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Dinas
            </label>
            {loadingDinas ? (
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm text-neutral-400">
                <Loader2 size={14} className="animate-spin" />
                Memuat daftar Dinas...
              </div>
            ) : dinasList.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                Belum ada Dinas. Silakan buat Dinas terlebih dahulu.
              </div>
            ) : (
              <div className="relative">
                <select
                  id="dinas"
                  value={dinasId}
                  onChange={(e) => setDinasId(e.target.value)}
                  disabled={loading}
                  className="w-full appearance-none rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {dinasList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama_dinas}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            )}
          </div>
        )}

        {/* Dinas role: nama & kontak */}
        {role === "dinas" && (
          <>
            <div>
              <label htmlFor="nama_dinas" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Nama Dinas
              </label>
              <input
                id="nama_dinas"
                type="text"
                value={namaDinas}
                onChange={(e) => setNamaDinas(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                placeholder="Contoh: Dinas Lingkungan Hidup"
              />
            </div>
            <div>
              <label htmlFor="kontak_dinas" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Kontak
              </label>
              <input
                id="kontak_dinas"
                type="text"
                value={kontakDinas}
                onChange={(e) => setKontakDinas(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                placeholder="Contoh: 0812-3456-7890"
              />
            </div>
          </>
        )}

        {/* Kopdes role: nama & alamat */}
        {role === "kopdes" && (
          <>
            <div>
              <label htmlFor="kopdes_nama" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Nama Kopdes
              </label>
              <input
                id="kopdes_nama"
                type="text"
                value={kopdesNama}
                onChange={(e) => setKopdesNama(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                placeholder="Contoh: Koperasi Maju Bersama"
              />
            </div>
            <div>
              <label htmlFor="kopdes_alamat" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Alamat
              </label>
              <textarea
                id="kopdes_alamat"
                value={kopdesAlamat}
                onChange={(e) => setKopdesAlamat(e.target.value)}
                required
                disabled={loading}
                rows={2}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 resize-none"
                placeholder="Masukkan alamat lengkap"
              />
            </div>
          </>
        )}

        {/* Submit & Cancel */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/admin/users"
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
