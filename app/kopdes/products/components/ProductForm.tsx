"use client";

import { useState, useRef } from "react";
import {
  CloudUpload,
  Lightbulb,
  FileText,
  Coins,
  Save,
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FormMode = "add" | "edit";

export interface ProductFormData {
  nama_barang: string;
  kategori: string;
  satuan: string;
  harga_koin: number;
  stok: number;
  image: File | null;
  imagePreview: string | null; // existing image URL in edit mode
}

export interface ProductFormProps {
  mode: FormMode;
  initial?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const KATEGORI_OPTIONS = [
  "Sembako",
  "Alat Tulis",
  "Perlengkapan Rumah",
  "Makanan Ringan",
  "Minuman",
  "Lainnya",
];

const SATUAN_OPTIONS = [
  "pcs (Satuan/Biji)",
  "kg (Kilogram)",
  "liter (Liter)",
  "dus (Kardus)",
  "pack (Bungkus)",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductForm({
  mode,
  initial,
  onSubmit,
  onCancel,
  loading = false,
  error,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [namaBarang, setNamaBarang] = useState(initial?.nama_barang ?? "");
  const [kategori, setKategori] = useState(initial?.kategori ?? "");
  const [satuan, setSatuan] = useState(initial?.satuan ?? "");
  const [hargaKoin, setHargaKoin] = useState(
    initial?.harga_koin != null ? String(initial.harga_koin) : "",
  );
  const [stok, setStok] = useState(initial?.stok ?? 0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initial?.imagePreview ?? null,
  );

  // Derived
  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Produk" : "Tambah Produk Baru";
  const subtitle = isEdit
    ? "Perbarui detail barang di bawah ini untuk memperbaharui inventaris koperasi WasteLens."
    : "Lengkapi detail barang di bawah ini untuk menambahkan inventaris baru ke sistem koperasi WasteLens.";
  const submitLabel = isEdit ? "Simpan Perubahan" : "Simpan Produk";

  // -------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStepper = (delta: number) => {
    setStok((prev) => Math.max(0, prev + delta));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      nama_barang: namaBarang,
      kategori,
      satuan,
      harga_koin: parseInt(hargaKoin, 10) || 0,
      stok,
      image,
      imagePreview,
    });
  };

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------

  return (
    <main className="relative min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe]">
      {/* Background decoration ring */}
      <div className="pointer-events-none fixed bottom-0 right-0 z-0 size-[500px] translate-x-1/4 translate-y-1/4">
        <div className="absolute inset-0 rounded-full border-[60px] border-primary/5" />
        <div className="absolute inset-16 rounded-full border-[40px] border-primary/3" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] p-4 sm:p-6">
        {/* =========================================================== */}
        {/* Header */}
        {/* =========================================================== */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-[30px]">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[#53635a] max-w-2xl">{subtitle}</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* ======================================================= */}
            {/* LEFT COLUMN */}
            {/* ======================================================= */}
            <div className="flex flex-col gap-5 lg:w-[32%]">
              {/* Foto Produk card */}
              <div className="rounded-2xl border border-[#b7cbbd] bg-white p-5">
                <p className="mb-4 text-sm font-semibold">Foto Produk</p>

                {imagePreview ? (
                  <div className="relative mb-3 overflow-hidden rounded-xl">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute right-2 top-2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white hover:bg-black/70 transition-colors"
                    >
                      Ganti
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#c5d1c8] bg-[#f9fcfd] px-4 py-10 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <CloudUpload className="size-8 text-neutral-300" />
                    <div>
                      <p className="text-sm font-medium text-neutral-500">
                        Tarik dan lepas gambar
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        Maks. 2MB (JPG, PNG)
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-[#b7cbbd] bg-white px-4 py-2 text-xs font-semibold text-[#536159] hover:bg-neutral-50 transition-colors"
                    >
                      Pilih Berkas
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <p className="mt-4 text-[11px] italic text-neutral-400 leading-relaxed">
                  Gunakan foto yang jernih dengan latar belakang polos untuk
                  memudahkan identifikasi saat transaksi POS.
                </p>
              </div>

              {/* Tips Inventaris card */}
              <div className="rounded-2xl bg-primary p-5 text-white">
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="size-5 text-white/80" />
                  <h3 className="text-sm font-extrabold">Tips Inventaris</h3>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-white/85">
                  Pastikan satuan barang (kg, liter, pcs) sudah sesuai dengan
                  timbangan digital koperasi untuk akurasi data stok otomatis.
                </p>
              </div>
            </div>

            {/* ======================================================= */}
            {/* RIGHT COLUMN */}
            {/* ======================================================= */}
            <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-[#b7cbbd] bg-white p-5 sm:p-6">
              {/* --- Section 1: Informasi Umum --- */}
              <section>
                <div className="flex items-center gap-2.5">
                  <FileText className="size-5 text-primary" />
                  <h2 className="text-sm font-extrabold text-primary">
                    Informasi Umum
                  </h2>
                </div>
                <hr className="mt-3 border-[#c5d1c8]" />

                <div className="mt-5 space-y-4">
                  {/* Nama Barang */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                      Nama Barang
                    </label>
                    <input
                      type="text"
                      value={namaBarang}
                      onChange={(e) => setNamaBarang(e.target.value)}
                      required
                      placeholder="Contoh: Beras Cianjur Premium"
                      className="w-full rounded-xl border border-[#b7cbbd] bg-[#f9fcfd] px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {/* Kategori + Satuan side by side */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                        Kategori
                      </label>
                      <div className="relative">
                        <select
                          value={kategori}
                          onChange={(e) => setKategori(e.target.value)}
                          required
                          className="w-full appearance-none rounded-xl border border-[#b7cbbd] bg-[#f9fcfd] px-4 py-3 pr-10 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10"
                        >
                          <option value="" disabled>
                            Pilih Kategori
                          </option>
                          {KATEGORI_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                        Satuan
                      </label>
                      <div className="relative">
                        <select
                          value={satuan}
                          onChange={(e) => setSatuan(e.target.value)}
                          required
                          className="w-full appearance-none rounded-xl border border-[#b7cbbd] bg-[#f9fcfd] px-4 py-3 pr-10 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10"
                        >
                          <option value="" disabled>
                            Pilih Satuan
                          </option>
                          {SATUAN_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* --- Section 2: Harga & Stok --- */}
              <section>
                <div className="flex items-center gap-2.5">
                  <Coins className="size-5 text-primary" />
                  <h2 className="text-sm font-extrabold text-primary">
                    Harga &amp; Stok
                  </h2>
                </div>
                <hr className="mt-3 border-[#c5d1c8]" />

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Harga Koin */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                      Harga (Koin)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                        K
                      </span>
                      <input
                        type="number"
                        value={hargaKoin}
                        onChange={(e) => setHargaKoin(e.target.value)}
                        required
                        min={0}
                        placeholder="0"
                        className="w-full rounded-xl border border-[#b7cbbd] bg-[#f9fcfd] py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-neutral-400">
                      *1 Koin setara Rp 1.000,-
                    </p>
                  </div>

                  {/* Stok Awal — Stepper */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                      Stok Awal
                    </label>
                    <div className="flex items-center gap-0 rounded-xl border border-[#b7cbbd] bg-[#f9fcfd] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleStepper(-1)}
                        className="flex size-11 shrink-0 items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="flex-1 text-center text-sm font-bold tabular-nums">
                        {stok}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStepper(1)}
                        className="flex size-11 shrink-0 items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* --- Footer buttons --- */}
              <hr className="border-[#c5d1c8]" />
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-full border border-[#b7cbbd] bg-white px-6 py-3 text-sm font-semibold text-[#536159] hover:bg-neutral-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Save className="size-4" />
                  {loading ? "Menyimpan..." : submitLabel}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
