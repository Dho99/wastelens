"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Info,
    UserCheck,
    AtSign,
    Phone,
    Save,
    Loader2,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateDinas } from "../../../hooks/useEntities";
import { SuccessView } from "../../../components/SuccessView";

export default function CreateDinasPage() {
    const router = useRouter();

    const [namaDinas, setNamaDinas] = useState("");
    const [kepalaDinas, setKepalaDinas] = useState("");
    const [alamatKantor, setAlamatKantor] = useState("");
    const [emailDinas, setEmailDinas] = useState("");
    const [nomorTelepon, setNomorTelepon] = useState("");
    const [statusOperasional, setStatusOperasional] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    // Region tags state
    const [wilayahList, setWilayahList] = useState<string[]>([
        "Zona Utara",
        "Zona Barat",
    ]);
    const [newWilayah, setNewWilayah] = useState("");
    const [showAddWilayah, setShowAddWilayah] = useState(false);

    const { mutateAsync: createDinas, isPending: loading } = useCreateDinas();

    function removeWilayah(tag: string) {
        setWilayahList((prev) => prev.filter((w) => w !== tag));
    }

    function handleAddWilayah() {
        if (newWilayah.trim() && !wilayahList.includes(newWilayah.trim())) {
            setWilayahList((prev) => [...prev, newWilayah.trim()]);
            setNewWilayah("");
            setShowAddWilayah(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!namaDinas.trim() || !emailDinas.trim() || !nomorTelepon.trim()) {
            toast.error("Nama Dinas, Email, dan Nomor Telepon wajib diisi");
            return;
        }

        try {
            await createDinas({
                nama_dinas: namaDinas.trim(),
                email: emailDinas.trim(),
                kontak: nomorTelepon.trim(),
            });
            setIsSuccess(true);
            toast.success("Data Dinas baru berhasil disimpan!");
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Gagal menyimpan data Dinas";
            toast.error(message);
        }
    }

    if (isSuccess) {
        return (
            <SuccessView
                title="Dinas Berhasil Ditambahkan"
                description="Silahkan cek data dinas yang telah ditambahkan di sistem WasteLens."
                buttonText="Kembali ke Manajemen Entitas"
                onButtonClick={() => router.push("/admin/entities")}
            />
        );
    }

    return (
        <div className="p-6 md:p-10 space-y-6 bg-[#f8fafc] min-h-screen text-[#0f172a] select-none pb-24 w-full mx-auto">
            {/* Top Header Row with Back Button */}
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => router.push("/admin/entities")}
                    aria-label="Kembali ke Manajemen Entitas"
                    className="p-2 rounded-full hover:bg-slate-200/80 text-[#0f172a] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                <div className="border-b border-slate-200/80 pb-5">
                    {/* Breadcrumbs */}
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                        <Link
                            href="/admin/entities"
                            className="hover:text-slate-600 transition-colors"
                        >
                            Manajemen Entitas
                        </Link>
                        <span>›</span>
                        <span className="text-[#287A38]">Tambah Dinas</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                        Tambah Data Dinas
                    </h1>
                    <p className="text-sm font-medium text-[#64748b] mt-1">
                        Lengkapi formulir di bawah ini untuk mendaftarkan
                        instansi kedinasan baru ke dalam ekosistem pengelolaan
                        limbah WasteLens.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Grid: Left Main (65%) & Right Contact (35%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Card: Informasi Utama */}
                    <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-xs space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#287A38] flex items-center justify-center">
                                <Info className="w-4 h-4" />
                            </div>
                            <h2 className="text-base font-extrabold text-[#0f172a] tracking-tight">
                                Informasi Utama
                            </h2>
                        </div>

                        {/* Row 1: Nama Dinas & Kepala Dinas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="namaDinas"
                                    className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                                >
                                    NAMA DINAS
                                </label>
                                <input
                                    id="namaDinas"
                                    type="text"
                                    value={namaDinas}
                                    onChange={(e) =>
                                        setNamaDinas(e.target.value)
                                    }
                                    placeholder="Contoh: Dinas Lingkungan Hidup Kota X"
                                    required
                                    disabled={loading}
                                    className="w-full bg-[#edf7fd] border border-slate-200/80 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="kepalaDinas"
                                    className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                                >
                                    KEPALA DINAS
                                </label>
                                <input
                                    id="kepalaDinas"
                                    type="text"
                                    value={kepalaDinas}
                                    onChange={(e) =>
                                        setKepalaDinas(e.target.value)
                                    }
                                    placeholder="Masukkan nama lengkap beserta gelar"
                                    disabled={loading}
                                    className="w-full bg-[#edf7fd] border border-slate-200/80 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Row 2: Alamat Kantor */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="alamatKantor"
                                className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                            >
                                ALAMAT KANTOR
                            </label>
                            <textarea
                                id="alamatKantor"
                                value={alamatKantor}
                                onChange={(e) =>
                                    setAlamatKantor(e.target.value)
                                }
                                placeholder="Jl. Raya Utama No. 123, Kel. Kebersihan, Kec. Lestari..."
                                rows={3}
                                disabled={loading}
                                className="w-full bg-[#edf7fd] border border-slate-200/80 rounded-2xl p-4 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50 resize-none"
                            />
                        </div>

                        {/* Row 3: Wilayah Cakupan & Status Operasional */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                            {/* Wilayah Cakupan Tags */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block">
                                    WILAYAH CAKUPAN
                                </label>
                                <div className="bg-[#edf7fd] border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center gap-2 min-h-[52px]">
                                    {wilayahList.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeWilayah(tag)
                                                }
                                                className="hover:text-red-600 transition-colors cursor-pointer"
                                            >
                                                <X className="w-3 h-3 stroke-[3]" />
                                            </button>
                                        </span>
                                    ))}

                                    {showAddWilayah ? (
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="text"
                                                value={newWilayah}
                                                onChange={(e) =>
                                                    setNewWilayah(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddWilayah();
                                                    }
                                                }}
                                                placeholder="Nama wilayah..."
                                                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-[#0f172a] focus:outline-none"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddWilayah}
                                                className="bg-[#287A38] text-white px-2.5 py-1 rounded-lg text-xs font-bold"
                                            >
                                                OK
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowAddWilayah(true)
                                            }
                                            className="text-[#287A38] hover:text-[#1f5d2b] text-xs font-extrabold flex items-center gap-1 hover:underline cursor-pointer ml-1"
                                        >
                                            <span>+ Tambah Wilayah</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Operasional Toggle */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block">
                                    STATUS OPERASIONAL
                                </label>
                                <div className="flex items-center gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStatusOperasional(
                                                (prev) => !prev,
                                            )
                                        }
                                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                                            statusOperasional
                                                ? "bg-[#287A38]"
                                                : "bg-slate-300"
                                        }`}
                                    >
                                        <span
                                            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                                                statusOperasional
                                                    ? "left-[26px]"
                                                    : "left-0.5"
                                            }`}
                                        />
                                    </button>
                                    <span className="text-sm font-bold text-[#0f172a]">
                                        {statusOperasional
                                            ? "Aktif"
                                            : "Non-Aktif"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Kontak & Akses */}
                    <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-xs space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#287A38] flex items-center justify-center">
                                <UserCheck className="w-4 h-4" />
                            </div>
                            <h2 className="text-base font-extrabold text-[#0f172a] tracking-tight">
                                Kontak & Akses
                            </h2>
                        </div>

                        {/* Email Dinas */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="emailDinas"
                                className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                            >
                                EMAIL DINAS
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <AtSign className="w-4 h-4" />
                                </div>
                                <input
                                    id="emailDinas"
                                    type="email"
                                    value={emailDinas}
                                    onChange={(e) =>
                                        setEmailDinas(e.target.value)
                                    }
                                    placeholder="admin@dinas.go.id"
                                    required
                                    disabled={loading}
                                    className="w-full bg-[#edf7fd] border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Nomor Telepon */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="nomorTelepon"
                                className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                            >
                                NOMOR TELEPON
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    id="nomorTelepon"
                                    type="text"
                                    value={nomorTelepon}
                                    onChange={(e) =>
                                        setNomorTelepon(e.target.value)
                                    }
                                    placeholder="(021) 1234-5678"
                                    required
                                    disabled={loading}
                                    className="w-full bg-[#edf7fd] border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Full-Width Action Container */}
                <div className="bg-[#f0f9ff] border border-slate-200/80 rounded-[20px] p-4 space-y-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#287A38] hover:bg-[#1f5d2b] text-white font-extrabold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>
                            {loading
                                ? "Menyimpan Entitas..."
                                : "Simpan Entitas"}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/admin/entities")}
                        disabled={loading}
                        className="w-full bg-[#e8f4fb] hover:bg-[#d8ecf8] text-[#0f172a] font-bold text-sm py-3.5 rounded-xl text-center transition-all cursor-pointer disabled:opacity-50"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}
