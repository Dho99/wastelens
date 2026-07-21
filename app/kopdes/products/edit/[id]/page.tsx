"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductForm, type ProductFormData } from "../../components/ProductForm";

interface ProdukDetail {
  id: string;
  nama_barang: string;
  harga_koin: number;
  stok: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [initial, setInitial] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  // Fetch existing product
  useEffect(() => {
    fetch(`/api/kopdes/products/${productId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Gagal memuat produk");
        return data as ProdukDetail;
      })
      .then((data) => {
        setInitial({
          nama_barang: data.nama_barang,
          kategori: "",
          satuan: "",
          harga_koin: data.harga_koin,
          stok: data.stok,
          image: null,
          imagePreview: null,
        });
      })
      .catch((err) => {
        setFetchError(
          err instanceof Error ? err.message : "Gagal memuat produk",
        );
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (data: ProductFormData) => {
    setError("");
    setSubmitting(true);

    try {
      const body: Record<string, unknown> = {
        nama_barang: data.nama_barang,
        harga_koin: data.harga_koin,
        stok: data.stok,
      };

      if (data.kategori) body.kategori = data.kategori;
      if (data.satuan) body.satuan = data.satuan;

      const res = await fetch(`/api/kopdes/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Gagal memperbarui produk");
        setSubmitting(false);
        return;
      }

      router.push("/kopdes/products");
      router.refresh();
    } catch {
      setError("Gagal terhubung ke server");
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-5 p-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-100" />
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="h-72 w-full animate-pulse rounded-2xl bg-neutral-100 lg:w-[32%]" />
          <div className="h-96 flex-1 animate-pulse rounded-2xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  // Fetch error
  if (fetchError || !initial) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm font-medium text-red-700">
          {fetchError || "Produk tidak ditemukan"}
        </p>
        <button
          onClick={() => router.push("/kopdes/products")}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Kembali ke Daftar Produk
        </button>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      initial={initial}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/kopdes/products")}
      loading={submitting}
      error={error}
    />
  );
}
