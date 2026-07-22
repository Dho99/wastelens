"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Info,
    Wallet,
    Search,
    Save,
    Loader2,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateKopdes } from "../../../hooks/useEntities";
import { SuccessView } from "../../../components/SuccessView";

export default function CreateKoperasiPage() {
    const router = useRouter();

    const [namaKoperasi, setNamaKoperasi] = useState("");
    const [ketuaKoperasi, setKetuaKoperasi] = useState("");
    const [alamatLengkap, setAlamatLengkap] = useState("");
    const [akunKasir, setAkunKasir] = useState("");
    const [emailKoperasi, setEmailKoperasi] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // Exchange items tags state
    const [jenisPenukaran, setJenisPenukaran] = useState<string[]>([
        "Sembako",
        "Kebutuhan Pokok",
        "Token Listrik",
    ]);
    const [newJenis, setNewJenis] = useState("");
    const [showAddJenis, setShowAddJenis] = useState(false);

    const { mutateAsync: createKopdes, isPending: loading } = useCreateKopdes();

    function removeJenis(tag: string) {
        setJenisPenukaran((prev) => prev.filter((j) => j !== tag));
    }

    function handleAddJenis() {
        if (newJenis.trim() && !jenisPenukaran.includes(newJenis.trim())) {
            setJenisPenukaran((prev) => [...prev, newJenis.trim()]);
            setNewJenis("");
            setShowAddJenis(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!namaKoperasi.trim() || !alamatLengkap.trim()) {
            toast.error("Nama Koperasi dan Alamat Wajib diisi");
            return;
        }

        try {
            const generatedEmail =
                emailKoperasi.trim() ||
                `${namaKoperasi.toLowerCase().replace(/[^a-z0-0]/g, "")}@koperasi.org`;
            await createKopdes({
                nama: namaKoperasi.trim(),
                alamat: alamatLengkap.trim(),
                email: generatedEmail,
            });
            setIsSuccess(true);
            toast.success("Data Koperasi baru berhasil disimpan!");
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Gagal menyimpan data Koperasi";
            toast.error(message);
        }
    }

    if (isSuccess) {
        return (
            <SuccessView
                title="Koperasi Berhasil Ditambahkan"
                description="Silahkan cek data koperasi yang telah ditambahkan di sistem WasteLens."
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
                        <span className="text-[#287A38]">Tambah Koperasi</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                        Tambah Data Koperasi
                    </h1>
                    <p className="text-sm font-medium text-[#64748b] mt-1">
                        Pastikan data yang dimasukkan telah divalidasi oleh
                        otoritas setempat.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card 1: Informasi Utama */}
                <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-xs space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#287A38] flex items-center justify-center">
                            <Info className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-extrabold text-[#0f172a] tracking-tight">
                            Informasi Utama
                        </h2>
                    </div>

                    {/* Row 1: Nama Koperasi & Ketua Koperasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="namaKoperasi"
                                className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                            >
                                NAMA KOPERASI
                            </label>
                            <input
                                id="namaKoperasi"
                                type="text"
                                value={namaKoperasi}
                                onChange={(e) =>
                                    setNamaKoperasi(e.target.value)
                                }
                                placeholder="Contoh: Koperasi Hijau Lestari"
                                required
                                disabled={loading}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="ketuaKoperasi"
                                className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                            >
                                KETUA KOPERASI
                            </label>
                            <input
                                id="ketuaKoperasi"
                                type="text"
                                value={ketuaKoperasi}
                                onChange={(e) =>
                                    setKetuaKoperasi(e.target.value)
                                }
                                placeholder="Nama Lengkap Tanpa Gelar"
                                disabled={loading}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Row 2: Alamat Lengkap */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="alamatLengkap"
                            className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                        >
                            ALAMAT LENGKAP
                        </label>
                        <textarea
                            id="alamatLengkap"
                            value={alamatLengkap}
                            onChange={(e) => setAlamatLengkap(e.target.value)}
                            placeholder="Jl. Raya Waste No. 88, Blok C..."
                            rows={3}
                            required
                            disabled={loading}
                            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Optional Email Address for Login */}
                    <div className="space-y-1.5 pt-1">
                        <label
                            htmlFor="emailKoperasi"
                            className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                        >
                            EMAIL KOPERASI (UNTUK AKUN LOGIN)
                        </label>
                        <input
                            id="emailKoperasi"
                            type="email"
                            value={emailKoperasi}
                            onChange={(e) => setEmailKoperasi(e.target.value)}
                            placeholder="admin@koperasihan.org"
                            disabled={loading}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Card 2: Detail Operasional */}
                <div className="bg-white border border-slate-200/80 rounded-[24px] p-6 shadow-xs space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#287A38] flex items-center justify-center">
                            <Wallet className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-extrabold text-[#0f172a] tracking-tight">
                            Detail Operasional
                        </h2>
                    </div>

                    {/* Akun Kasir Utama Search Input */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="akunKasir"
                            className="text-xs font-bold text-[#475569] uppercase tracking-wider block"
                        >
                            AKUN KASIR UTAMA
                        </label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                id="akunKasir"
                                type="text"
                                value={akunKasir}
                                onChange={(e) => setAkunKasir(e.target.value)}
                                placeholder="Cari atau tambahkan ID Kasir"
                                disabled={loading}
                                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-semibold text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#287A38] transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Jenis Penukaran Tersedia Tags */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block">
                            JENIS PENUKARAN TERSEDIA
                        </label>
                        <div className="bg-[#edf7fd] border border-slate-200/80 rounded-2xl p-3.5 flex flex-wrap items-center gap-2.5 min-h-[56px]">
                            {jenisPenukaran.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-[#287A38] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                                >
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeJenis(tag)}
                                        className="hover:text-red-200 transition-colors cursor-pointer"
                                    >
                                        <X className="w-3 h-3 stroke-[3]" />
                                    </button>
                                </span>
                            ))}

                            {showAddJenis ? (
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        value={newJenis}
                                        onChange={(e) =>
                                            setNewJenis(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddJenis();
                                            }
                                        }}
                                        placeholder="Nama jenis..."
                                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-[#0f172a] focus:outline-none"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddJenis}
                                        className="bg-[#287A38] text-white px-2.5 py-1 rounded-lg text-xs font-bold"
                                    >
                                        OK
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowAddJenis(true)}
                                    className="text-[#287A38] hover:text-[#1f5d2b] text-xs font-extrabold flex items-center gap-1 hover:underline cursor-pointer ml-1"
                                >
                                    <span>+ Tambah Jenis</span>
                                </button>
                            )}
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
