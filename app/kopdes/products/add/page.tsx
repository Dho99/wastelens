"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm, type ProductFormData } from "../components/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: ProductFormData) => {
    setError("");
    setLoading(true);

    try {
      // Build payload — only send fields the API expects
      const body: Record<string, unknown> = {
        nama_barang: data.nama_barang,
        harga_koin: data.harga_koin,
        stok: data.stok,
      };

      // Optionally include kategori & satuan if the API supports it
      if (data.kategori) body.kategori = data.kategori;
      if (data.satuan) body.satuan = data.satuan;

      const res = await fetch("/api/kopdes/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Gagal menambah produk");
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

  return (
    <ProductForm
      mode="add"
      onSubmit={handleSubmit}
      onCancel={() => router.push("/kopdes/products")}
      loading={loading}
      error={error}
    />
  );
}
