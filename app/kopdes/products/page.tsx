"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface ProdukItem {
    id: string;
    nama_barang: string;
    harga_koin: number;
    stok: number;
    createdAt: string;
}

export default function ProductsPage() {
    const router = useRouter();
    const [produk, setProduk] = useState<ProdukItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/kopdes/products")
            .then((r) => r.json())
            .then((data) => setProduk(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-3 p-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-16 animate-pulse rounded-lg bg-neutral-100"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Daftar Barang / Etalase</h2>
                <button
                    onClick={() => router.push("/kopdes/products/add")}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="size-4" />
                    Tambah
                </button>
            </div>

            {produk?.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-200 p-8 text-center">
                    <p className="text-sm font-medium text-neutral-500">
                        Belum ada produk
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                        Tambah produk melalui tombol Tambah atau unggah file
                        Excel
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {produk?.length > 0 &&
                        produk?.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border bg-white p-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.nama_barang}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        {item.harga_koin} koin
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                            item.stok > 0
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-600"
                                        }`}
                                    >
                                        Stok: {item.stok}
                                    </span>
                                    <p className="mt-1 text-xs text-neutral-400">
                                        {new Date(
                                            item.createdAt,
                                        ).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
