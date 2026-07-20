"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Download,
  Coins,
  Pencil,
  Trash2,
  ClipboardList,
  TriangleAlert,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProdukItem {
  id: string;
  nama_barang: string;
  harga_koin: number;
  stok: number;
  createdAt: string;
}

const LOW_STOCK_THRESHOLD = 10;
const ITEMS_PER_PAGE = 6;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDisplayId(index: number) {
  return `#BRG-${String(index + 1).padStart(3, "0")}`;
}

function stokBadge(stok: number) {
  if (stok < LOW_STOCK_THRESHOLD) {
    return "bg-amber-100 text-amber-800";
  }
  return "bg-primary/15 text-primary";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProductsPage() {
  const router = useRouter();
  const [produk, setProduk] = useState<ProdukItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & pagination
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // -----------------------------------------------------------------------
  // Data fetch
  // -----------------------------------------------------------------------

  useEffect(() => {
    fetch("/api/kopdes/products")
      .then((r) => r.json())
      .then((data) => setProduk(Array.isArray(data) ? data : []))
      .catch(() => setProduk([]))
      .finally(() => setLoading(false));
  }, []);

  // -----------------------------------------------------------------------
  // Derived
  // -----------------------------------------------------------------------

  const filtered = useMemo(() => {
    if (!query.trim()) return produk;
    const q = query.toLowerCase();
    return produk.filter(
      (p) =>
        p.nama_barang.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }, [produk, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  // Reset page when query changes
  useEffect(() => setPage(1), [query]);

  // Stat cards
  const totalVarian = produk.length;
  const stokRendah = produk.filter((p) => p.stok < LOW_STOCK_THRESHOLD).length;

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-100" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}
        </div>
        <div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6">
      <div className="mx-auto max-w-[1300px] space-y-6">
        {/* =============================================================== */}
        {/* HEADER */}
        {/* =============================================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-[30px]">
              Inventaris Produk
            </h1>
            <p className="mt-1 text-sm text-[#53635a]">
              Pantau dan kelola stok barang koperasi desa Anda.
            </p>
          </div>
          <button
            onClick={() => router.push("/kopdes/products/add")}
            className="flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors sm:self-auto"
          >
            <PlusCircle className="size-4" />
            Tambah Produk
          </button>
        </div>

        {/* =============================================================== */}
        {/* STAT CARDS */}
        {/* =============================================================== */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Card 1 — Total Varian */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0d7377] p-5 text-white">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/70">
              Total Varian Produk
            </p>
            <p className="mt-2 text-3xl font-extrabold">{totalVarian} Item</p>
            <ClipboardList className="absolute -bottom-2 -right-2 size-24 text-white/10" />
          </div>

          {/* Card 2 — Stok Rendah */}
          <div className="relative overflow-hidden rounded-2xl bg-[#8b6f47] p-5 text-white">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/70">
              Produk Stok Rendah
            </p>
            <p className="mt-2 text-3xl font-extrabold">{stokRendah} Item</p>
            <TriangleAlert className="absolute -bottom-2 -right-2 size-24 text-white/10" />
          </div>

          {/* Card 3 — Pengiriman Tertunda */}
          <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-white">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/70">
              Pengiriman Tertunda
            </p>
            <p className="mt-2 text-3xl font-extrabold">3 Pesanan</p>
            <Truck className="absolute -bottom-2 -right-2 size-24 text-white/10" />
          </div>
        </div>

        {/* =============================================================== */}
        {/* TOOLBAR */}
        {/* =============================================================== */}
        <div className="flex flex-col gap-3 rounded-[24px] border border-[#b7cbbd] bg-white/55 p-4 sm:flex-row">
          <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-[#e8f6fd] px-5">
            <Search className="size-5 shrink-0 text-[#46594f]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#7c8792]"
              placeholder="Cari nama barang atau ID..."
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#b7cbbd] bg-white px-4 py-2.5 text-xs font-semibold text-[#536159] hover:bg-neutral-50 transition-colors"
            >
              <SlidersHorizontal className="size-4" />
              Kategori
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#b7cbbd] bg-white px-4 py-2.5 text-xs font-semibold text-[#536159] hover:bg-neutral-50 transition-colors"
            >
              <Download className="size-4" />
              Export
            </button>
          </div>
        </div>

        {/* =============================================================== */}
        {/* PRODUCT TABLE */}
        {/* =============================================================== */}
        <section className="overflow-hidden rounded-[24px] border border-[#b7cbbd] bg-white/35">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead className="bg-[#deeff8] text-[11px] font-extrabold uppercase tracking-wide text-[#4c5d54]">
                <tr>
                  <th className="px-6 py-5">ID Barang</th>
                  <th className="px-6 py-5">Nama Barang</th>
                  <th className="px-6 py-5">Harga Koin</th>
                  <th className="px-6 py-5">Stok Tersedia</th>
                  <th className="px-6 py-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item, idx) => {
                  const globalIdx = produk.findIndex((p) => p.id === item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`border-t border-[#becdbf] text-sm ${
                        idx % 2 === 0 ? "bg-white/60" : "bg-[#f8fcfd]"
                      }`}
                    >
                      {/* ID */}
                      <td className="px-6 py-5 font-mono text-xs font-semibold text-neutral-500">
                        {formatDisplayId(globalIdx)}
                      </td>

                      {/* Nama Barang */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
                            <svg
                              className="size-5 text-neutral-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                              />
                            </svg>
                          </div>
                          <span className="font-semibold">
                            {item.nama_barang}
                          </span>
                        </div>
                      </td>

                      {/* Harga Koin */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <Coins className="size-4 text-amber-600" />
                          <span className="font-extrabold text-primary">
                            {item.harga_koin.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>

                      {/* Stok */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold ${stokBadge(item.stok)}`}
                        >
                          {item.stok} Unit
                          {item.stok < LOW_STOCK_THRESHOLD && " (Low)"}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            aria-label="Edit"
                            onClick={() =>
                              router.push(`/kopdes/products/edit/${item.id}`)
                            }
                            className="grid size-8 place-items-center rounded-lg border border-[#b9cabc] text-[#465148] hover:bg-white transition-colors"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete"
                            className="grid size-8 place-items-center rounded-lg border border-[#b9cabc] text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty state */}
            {!filtered.length && (
              <div className="py-14 text-center text-sm text-[#68756e]">
                {produk.length === 0
                  ? "Belum ada produk. Tambah produk melalui tombol Tambah Produk."
                  : "Tidak ada produk yang cocok."}
              </div>
            )}
          </div>

          {/* ============================================================= */}
          {/* Table Footer — Pagination */}
          {/* ============================================================= */}
          <footer className="flex flex-col gap-4 border-t border-[#becdbf] px-6 py-4 text-xs text-[#536159] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Menampilkan{" "}
              {filtered.length
                ? (safePage - 1) * ITEMS_PER_PAGE + 1
                : 0}
              –
              {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} dari{" "}
              {filtered.length} barang
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="grid size-8 place-items-center rounded-lg border border-[#b9cabc] text-[#465148] hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`grid size-8 place-items-center rounded-lg text-xs font-bold transition-colors ${
                      pageNum === safePage
                        ? "bg-primary text-white"
                        : "border border-[#b9cabc] text-[#465148] hover:bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="grid size-8 place-items-center rounded-lg border border-[#b9cabc] text-[#465148] hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
