"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  X,
  UserPlus,
  ChevronDown,
  Eye,
  EyeOff,
  Save,
  Info,
  ShieldCheck,
  HelpCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { EntityDinas } from "../../types/entities";
import { useDinasList } from "../../hooks/useEntities";
import { useCreateUser } from "../../hooks/useUsers";
import { SuccessView } from "../../components/SuccessView";

const ROLES = [
  { value: "user", label: "Warga" },
  { value: "petugas", label: "Petugas" },
  { value: "kopdes", label: "Kopdes" },
  { value: "dinas", label: "Dinas" },
] as const;

export default function AddUserPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string>("user");
  const [roleOpen, setRoleOpen] = useState(false);
  const [sendActivation, setSendActivation] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Role specific state
  const [dinasId, setDinasId] = useState("");
  const [namaDinas, setNamaDinas] = useState("");
  const [kontakDinas, setKontakDinas] = useState("");
  const [kopdesNama, setKopdesNama] = useState("");
  const [kopdesAlamat, setKopdesAlamat] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: dinasList, isLoading: loadingDinas } = useDinasList();
  const { mutateAsync: createUser, isPending: loading } = useCreateUser();

  function resetForm() {
    setNama("");
    setEmail("");
    setPassword("");
    setRole("user");
    setSendActivation(false);
    setDinasId("");
    setNamaDinas("");
    setKontakDinas("");
    setKopdesNama("");
    setKopdesAlamat("");
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nama.trim() || !email.trim() || !password) {
      setError("Semua field wajib diisi");
      toast.error("Semua field wajib diisi");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      toast.error("Password minimal 8 karakter");
      return;
    }

    if (role === "petugas" && !dinasId) {
      setError("Pilih Dinas terlebih dahulu");
      toast.error("Pilih Dinas terlebih dahulu");
      return;
    }

    if (role === "dinas") {
      if (!namaDinas.trim() || !kontakDinas.trim()) {
        setError("Nama Dinas dan Kontak wajib diisi");
        toast.error("Nama Dinas dan Kontak wajib diisi");
        return;
      }
    }

    if (role === "kopdes") {
      if (!kopdesNama.trim() || !kopdesAlamat.trim()) {
        setError("Nama Kopdes dan Alamat wajib diisi");
        toast.error("Nama Kopdes dan Alamat wajib diisi");
        return;
      }
    }

    const body: Record<string, string | boolean> = {
      nama: nama.trim(),
      email: email.trim(),
      password,
      role,
      send_activation: sendActivation,
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
      await createUser(body);
      setIsSuccess(true);
      toast.success("Pengguna baru berhasil ditambahkan!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menambahkan pengguna";
      setError(message);
      toast.error(message);
    }
  }

  const selectedRoleLabel = ROLES.find((r) => r.value === role)?.label ?? "Pilih Peran Pengguna";

  if (isSuccess) {
    return (
      <SuccessView
        title="User Berhasil Ditambahkan"
        description="Silahkan cek data user yang telah ditambahkan di sistem WasteLens."
        buttonText="Kembali ke Kelola User"
        onButtonClick={() => router.push("/admin/users")}
      />
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-6 bg-[#f8fafc] text-[#0f172a] select-none pb-24 max-w-6xl mx-auto">
      
      {/* Top Header Row with Back Button & Cancel Pill Button */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            aria-label="Kembali ke Kelola User"
            className="p-2 rounded-full hover:bg-slate-200/80 text-[#0f172a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="border-b border-slate-200/80 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Pendaftaran Pengguna Baru
            </h1>
            <p className="text-sm font-medium text-[#64748b] mt-1">
              Silakan lengkapi formulir di bawah ini untuk menambahkan pengguna ke sistem WasteLens.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="bg-[#c53030] hover:bg-[#9b2c2c] text-white text-xs font-black px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-xs self-start md:self-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[3]" />
            Batal
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-xs">
          <CheckCircle className="w-5 h-5 text-[#287A38] shrink-0" />
          <span className="font-bold">{success}</span>
        </div>
      )}

      {/* Error Notification Alert */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-xs font-bold">
          {error}
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-[24px] p-6 md:p-8 shadow-xs space-y-6">
        
        {/* Card Title Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <UserPlus className="w-5 h-5 text-[#287A38]" />
          <h2 className="text-lg font-extrabold text-[#0f172a] tracking-tight">
            Informasi Akun
          </h2>
        </div>

        {/* 2-Column Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Field 1: Full Name */}
          <div className="space-y-2">
            <label htmlFor="nama" className="text-xs font-bold text-[#475569] block tracking-tight">
              Full Name
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              required
              disabled={loading}
              className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
            />
          </div>

          {/* Field 2: Email Address */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold text-[#475569] block tracking-tight">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi.santoso@wastenews.com"
              required
              disabled={loading}
              className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
            />
          </div>

          {/* Field 3: Role Selection Custom Dropdown */}
          <div className="space-y-2 relative">
            <label htmlFor="role" className="text-xs font-bold text-[#475569] block tracking-tight">
              Role Selection
            </label>
            <div className="relative">
              <button
                type="button"
                id="role"
                disabled={loading}
                onClick={() => setRoleOpen((prev) => !prev)}
                className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm font-bold text-[#0f172a] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all cursor-pointer disabled:opacity-50 text-left"
              >
                <span>{selectedRoleLabel}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${roleOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Custom Options List matching mockup with green indicator dots */}
              {roleOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-1.5 space-y-1">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => {
                        setRole(r.value);
                        setRoleOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${
                        role === r.value
                          ? "bg-slate-50 text-[#0f172a]"
                          : "text-[#475569] hover:bg-slate-50 hover:text-[#0f172a]"
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#287A38]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Field 4: Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold text-[#475569] block tracking-tight">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 pr-12 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] font-medium text-[#94a3b8] italic tracking-tight mt-1">
              Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
            </p>
          </div>

        </div>

        {/* Dynamic Fields Based on Selected Role */}
        {role === "petugas" && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label htmlFor="dinasId" className="text-xs font-bold text-[#475569] block tracking-tight">
              Pilih Dinas Pengampu
            </label>
            {loadingDinas ? (
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#287A38]" />
                Memuat daftar Dinas...
              </div>
            ) : !dinasList || dinasList.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800">
                Belum ada Dinas terdaftar. Silakan buat Dinas di Manajemen Entitas terlebih dahulu.
              </div>
            ) : (
              <select
                id="dinasId"
                value={dinasId}
                onChange={(e) => setDinasId(e.target.value)}
                disabled={loading}
                className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all"
              >
                <option value="">-- Pilih Dinas --</option>
                {dinasList.map((d: EntityDinas) => (
                  <option key={d.id} value={d.id}>
                    {d.nama_dinas}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {role === "dinas" && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="namaDinas" className="text-xs font-bold text-[#475569] block">
                Nama Dinas
              </label>
              <input
                id="namaDinas"
                type="text"
                value={namaDinas}
                onChange={(e) => setNamaDinas(e.target.value)}
                placeholder="Contoh: Dinas Lingkungan Hidup"
                className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm font-semibold text-[#0f172a]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="kontakDinas" className="text-xs font-bold text-[#475569] block">
                Kontak Dinas
              </label>
              <input
                id="kontakDinas"
                type="text"
                value={kontakDinas}
                onChange={(e) => setKontakDinas(e.target.value)}
                placeholder="Contoh: 0812-3456-7890"
                className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm font-semibold text-[#0f172a]"
              />
            </div>
          </div>
        )}

        {role === "kopdes" && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="kopdesNama" className="text-xs font-bold text-[#475569] block">
                Nama Kopdes
              </label>
              <input
                id="kopdesNama"
                type="text"
                value={kopdesNama}
                onChange={(e) => setKopdesNama(e.target.value)}
                placeholder="Contoh: Koperasi Sampah Bank Mandiri"
                className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm font-semibold text-[#0f172a]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="kopdesAlamat" className="text-xs font-bold text-[#475569] block">
                Alamat Kopdes
              </label>
              <input
                id="kopdesAlamat"
                type="text"
                value={kopdesAlamat}
                onChange={(e) => setKopdesAlamat(e.target.value)}
                placeholder="Masukkan alamat lengkap Kopdes"
                className="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm font-semibold text-[#0f172a]"
              />
            </div>
          </div>
        )}

        {/* Card Footer Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          {/* Left Checkbox */}
          <label className="flex items-center gap-2.5 text-xs font-bold text-[#475569] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sendActivation}
              onChange={(e) => setSendActivation(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#287A38] focus:ring-[#287A38] cursor-pointer"
            />
            <span>Kirim undangan aktivasi ke email pengguna</span>
          </label>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="bg-[#fef08a] hover:bg-[#fde047] text-[#854d0e] font-black text-xs px-6 py-2.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#287A38] hover:bg-[#1f5d2b] text-white font-black text-xs px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? "Menyimpan..." : "Simpan User"}</span>
            </button>
          </div>
        </div>

      </form>

      {/* Bottom 3 Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* Card 1: Izin Akses */}
        <div className="bg-[#e6f4ea] border border-[#a7f3d0] rounded-2xl p-4.5 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#065f46]" />
            <h4 className="font-extrabold text-xs text-[#065f46] tracking-tight">
              Izin Akses
            </h4>
          </div>
          <p className="text-[11px] font-semibold text-[#047857] leading-snug">
            Pastikan memilih peran yang sesuai untuk membatasi akses data sensitif.
          </p>
        </div>

        {/* Card 2: Kebijakan Password */}
        <div className="bg-[#e0f2fe] border border-[#bae6fd] rounded-2xl p-4.5 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#075985]" />
            <h4 className="font-extrabold text-xs text-[#075985] tracking-tight">
              Kebijakan Password
            </h4>
          </div>
          <p className="text-[11px] font-semibold text-[#0369a1] leading-snug">
            Password dienkripsi secara otomatis menggunakan standar industri AES-256.
          </p>
        </div>

        {/* Card 3: Bantuan Admin */}
        <div className="bg-[#f1f5f9] border border-[#cbd5e1] rounded-2xl p-4.5 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#334155]" />
            <h4 className="font-extrabold text-xs text-[#334155] tracking-tight">
              Bantuan Admin
            </h4>
          </div>
          <p className="text-[11px] font-semibold text-[#475569] leading-snug">
            Butuh bantuan? Hubungi pusat dukungan IT di extension 204.
          </p>
        </div>

      </div>

    </div>
  );
}
