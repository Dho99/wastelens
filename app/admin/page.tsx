"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Flag, CircleDollarSign, ArrowLeftRight } from "lucide-react";

type Summary = {
  totalUsers: number;
  totalReports: number;
  totalCoinTx: number;
  totalRedemptions: number;
};

const cards = [
  { label: "Total Pengguna", key: "totalUsers" as const, icon: <Users size={28} />, href: "/admin/users", color: "bg-blue-500" },
  { label: "Total Laporan", key: "totalReports" as const, icon: <Flag size={28} />, href: "/admin/reports", color: "bg-amber-500" },
  { label: "Transaksi Koin", key: "totalCoinTx" as const, icon: <CircleDollarSign size={28} />, href: "/admin/transactions/coins", color: "bg-emerald-500" },
  { label: "Penukaran Produk", key: "totalRedemptions" as const, icon: <ArrowLeftRight size={28} />, href: "/admin/transactions/products", color: "bg-purple-500" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch("/api/admin/reports?limit=1");
        if (!res.ok) return;
        const [users, reports, coins, redemptions] = await Promise.all([
          fetch("/api/admin/users?limit=1").then(r => r.json()),
          fetch("/api/admin/reports?limit=1").then(r => r.json()),
          fetch("/api/admin/transactions/coins?limit=1").then(r => r.json()),
          fetch("/api/admin/transactions/products?limit=1").then(r => r.json()),
        ]);
        setSummary({
          totalUsers: users.pagination?.total ?? 0,
          totalReports: reports.pagination?.total ?? 0,
          totalCoinTx: coins.pagination?.total ?? 0,
          totalRedemptions: redemptions.pagination?.total ?? 0,
        });
      } catch {}
    }
    loadSummary();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <button
            key={card.key}
            onClick={() => router.push(card.href)}
            className="rounded-xl p-5 text-white flex items-center gap-4 hover:brightness-110 transition cursor-pointer text-left"
            style={{ backgroundColor: card.color.replace("bg-", "#").replace("-500", "") }}
          >
            <div className="p-3 rounded-lg bg-white/20">{card.icon}</div>
            <div>
              <p className="text-sm opacity-80">{card.label}</p>
              <p className="text-3xl font-bold">{summary?.[card.key] ?? "..."}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
