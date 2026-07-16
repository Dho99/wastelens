"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { ScanLine, Package, LogOut } from "lucide-react";

interface DashboardStats {
  nama: string;
  total_produk: number;
  total_redeemed_hari_ini: number;
  total_penukaran: number;
}

export default function KopdesDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/kopdes/dashboard")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-32 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  const menuCards = [
    {
      label: "Scan Kode QR",
      desc: "Pindai QR code penukaran dari warga",
      icon: <ScanLine className="size-8" />,
      href: "/kopdes/scan",
      color: "bg-emerald-600 text-white hover:bg-emerald-700",
    },
    {
      label: "Kelola Produk",
      desc: "Tambah atau lihat daftar barang etalase",
      icon: <Package className="size-8" />,
      href: "/kopdes/products",
      color: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      label: "Logout",
      desc: "Keluar dari aplikasi Kopdes",
      icon: <LogOut className="size-8" />,
      href: null,
      color: "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold">
          {stats?.nama ?? session?.user?.name ?? "Kopdes"}
        </h1>
        <p className="text-sm text-neutral-500">Koperasi Desa — Panel Manajemen</p>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{stats.total_produk}</p>
            <p className="mt-1 text-xs text-neutral-500">Total Produk</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.total_redeemed_hari_ini}</p>
            <p className="mt-1 text-xs text-neutral-500">Ditukar Hari Ini</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{stats.total_penukaran}</p>
            <p className="mt-1 text-xs text-neutral-500">Total Transaksi</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700">Pilih Menu Utama</h2>
        {menuCards.map((card) => (
          <button
            key={card.label}
            onClick={() => (card.onClick ? card.onClick() : router.push(card.href!))}
            disabled={loggingOut}
            className={`flex w-full items-center gap-4 rounded-xl p-5 text-left transition-colors ${card.color}`}
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-black/10">
              {card.icon}
            </div>
            <div>
              <p className="font-semibold">{card.label}</p>
              <p className="mt-0.5 text-sm opacity-80">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
