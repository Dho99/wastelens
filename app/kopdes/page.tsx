"use client";

import { useEffect, useMemo, useState } from "react";
import { Coins, Search, ShoppingBag } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Transaction {
  date: string;
  name: string;
  items: number;
  coins: string;
  status: "Berhasil" | "Gagal" | "Tertunda";
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const sampleData: Transaction[] = [
  { date: "16/7/2026", name: "Agus Supriyadi", items: 1, coins: "+420", status: "Berhasil" },
  { date: "16/7/2026", name: "Ratna Mutia", items: 4, coins: "+16.000", status: "Berhasil" },
  { date: "16/7/2026", name: "Dedi Kusuma", items: 2, coins: "+750", status: "Berhasil" },
  { date: "15/7/2026", name: "Siti Nurhaliza", items: 3, coins: "+2.100", status: "Berhasil" },
  { date: "15/7/2026", name: "Bambang Hermanto", items: 1, coins: "+350", status: "Berhasil" },
  { date: "14/7/2026", name: "Lina Marlina", items: 5, coins: "+8.500", status: "Berhasil" },
  { date: "14/7/2026", name: "Hendra Gunawan", items: 2, coins: "+620", status: "Gagal" },
  { date: "13/7/2026", name: "Rini Setiawati", items: 1, coins: "+180", status: "Berhasil" },
];

const STATS = {
  totalCoins: "85.4M IDR",
  todayTransactions: "142 Nota",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusBadge = (status: Transaction["status"]) => {
  const map: Record<Transaction["status"], string> = {
    Berhasil: "bg-primary/20 text-primary",
    Gagal: "bg-red-100 text-red-700",
    Tertunda: "bg-amber-100 text-amber-700",
  };
  return map[status];
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function KopdesDashboardPage() {
  // Search state with basic debounce
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter
  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return sampleData;
    const q = debouncedQuery.toLowerCase();
    return sampleData.filter(
      (tx) =>
        tx.name.toLowerCase().includes(q) ||
        tx.date.includes(q) ||
        tx.coins.includes(q) ||
        tx.status.toLowerCase().includes(q),
    );
  }, [debouncedQuery]);

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6">
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* ---- Header ---- */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-[30px]">
            Portal Pengelolaan Sampah
          </h1>
          <p className="mt-2 text-sm text-[#53635a]">
            Pantau performa pengelolaan sampah desa hari ini.
          </p>
        </div>

        {/* ---- Stat Cards ---- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#fef3c7] text-amber-700 [&_svg]:size-6">
              <Coins />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#667169]">
                Koin Terdistribusi
              </p>
              <p className="text-xl font-extrabold text-[#3f5248]">
                {STATS.totalCoins}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#dbeafe] text-blue-700 [&_svg]:size-6">
              <ShoppingBag />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#667169]">
                Transaksi Hari Ini
              </p>
              <p className="text-xl font-extrabold text-[#3f5248]">
                {STATS.todayTransactions}
              </p>
            </div>
          </div>
        </div>

        {/* ---- Search Bar ---- */}
        <section className="flex flex-col gap-4">
          <label className="flex h-12 min-w-0 items-center gap-3 rounded-full bg-[#e8f6fd] border border-[#b7cbbd] px-5">
            <Search className="size-5 shrink-0 text-[#46594f]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#7c8792]"
              placeholder="Cari data nasabah..."
            />
          </label>
        </section>

        {/* ---- Data Table ---- */}
        <section className="overflow-hidden rounded-[24px] border border-[#b7cbbd] bg-white/35">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-[#deeff8] text-xs font-extrabold uppercase tracking-wide text-[#4c5d54]">
                <tr>
                  <th className="px-6 py-5">Tanggal Transaksi</th>
                  <th className="px-6 py-5">Nasabah</th>
                  <th className="px-6 py-5 text-center">Jumlah Barang</th>
                  <th className="px-6 py-5">Koin Diterima</th>
                  <th className="px-6 py-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, idx) => (
                  <tr
                    key={`${tx.date}-${tx.name}-${idx}`}
                    className="border-t border-[#becdbf] text-sm"
                  >
                    <td className="px-6 py-5 font-semibold">{tx.date}</td>
                    <td className="px-6 py-5 font-semibold">{tx.name}</td>
                    <td className="px-6 py-5 text-center">{tx.items}</td>
                    <td className="px-6 py-5 font-extrabold text-primary">
                      {tx.coins}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-[10px] font-extrabold ${statusBadge(tx.status)}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="py-14 text-center text-sm text-[#68756e]">
                Tidak ada transaksi yang cocok.
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between border-t border-[#becdbf] px-6 py-4 text-xs text-[#536159]">
            <p>
              Menampilkan {filtered.length} dari {sampleData.length} transaksi
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
