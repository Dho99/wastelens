"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";

type InputMode = "manual" | "upload";

function AddProductContent() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mode, setMode] = useState<InputMode>("manual");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [nama, setNama] = useState("");
    const [harga, setHarga] = useState("");
    const [stok, setStok] = useState("");

    const [uploadResult, setUploadResult] = useState<{
        inserted: number;
        errors: string[];
    } | null>(null);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/kopdes/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama_barang: nama,
                    harga_koin: parseInt(harga, 10),
                    stok: parseInt(stok, 10),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Gagal menambah produk");
                setLoading(false);
                return;
            }

            router.push("/kopdes/products");
            router.refresh();
        } catch {
            setError("Gagal terhubung ke server");
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        setLoading(true);
        setUploadResult(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/kopdes/products/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Gagal mengunggah file");
                setLoading(false);
                return;
            }

            setUploadResult(data);
            setLoading(false);
        } catch {
            setError("Gagal terhubung ke server");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <h2 className="text-lg font-bold">Tambah Produk</h2>

            <div className="flex gap-2 rounded-lg bg-neutral-100 p-1">
                <button
                    onClick={() => setMode("manual")}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        mode === "manual"
                            ? "bg-white shadow-sm"
                            : "text-neutral-500 hover:text-neutral-700"
                    }`}
                >
                    Input Manual
                </button>
                <button
                    onClick={() => setMode("upload")}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        mode === "upload"
                            ? "bg-white shadow-sm"
                            : "text-neutral-500 hover:text-neutral-700"
                    }`}
                >
                    Upload Excel
                </button>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {mode === "manual" && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700">
                            Nama Barang
                        </label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Beras 5kg"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700">
                            Harga Koin
                        </label>
                        <input
                            type="number"
                            value={harga}
                            onChange={(e) => setHarga(e.target.value)}
                            required
                            min={0}
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="200"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700">
                            Stok
                        </label>
                        <input
                            type="number"
                            value={stok}
                            onChange={(e) => setStok(e.target.value)}
                            required
                            min={0}
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="50"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("/kopdes/products")}
                            className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Menyimpan..." : "Simpan Produk"}
                        </button>
                    </div>
                </form>
            )}

            {mode === "upload" && (
                <div className="space-y-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                    >
                        <svg
                            className="mb-2 size-8 text-neutral-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-sm font-medium text-neutral-600">
                            Klik untuk unggah file .csv atau .xlsx
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                            Format: nama_barang, harga_koin, stok
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={handleFileUpload}
                    />

                    {loading && (
                        <div className="text-center text-sm text-neutral-500">
                            Memproses file...
                        </div>
                    )}

                    {uploadResult && (
                        <div className="rounded-xl border bg-white p-4">
                            <p className="text-sm font-medium text-green-700">
                                Berhasil: {uploadResult.inserted} produk
                                ditambahkan
                            </p>
                            {uploadResult.errors.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs font-medium text-red-600">
                                        Gagal:
                                    </p>
                                    {uploadResult.errors.map((err, i) => (
                                        <p
                                            key={i}
                                            className="text-xs text-red-500"
                                        >
                                            {err}
                                        </p>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    setUploadResult(null);
                                    router.refresh();
                                    router.push("/kopdes/products");
                                }}
                                className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                            >
                                Lihat Daftar Produk
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => router.push("/kopdes/products")}
                        className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AddProductPage() {
    return (
        <ErrorBoundary>
            <AddProductContent />
        </ErrorBoundary>
    );
}
