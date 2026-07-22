"use client";

import { useRouter } from "next/navigation";
import {
    Users,
    Flag,
    CircleDollarSign,
    ArrowLeftRight,
    Loader2,
} from "lucide-react";
import type { Summary } from "./types/dashboard";
import { useDashboard } from "./hooks/useDashboard";

const cards: {
    label: string;
    key: keyof Summary;
    icon: React.ReactNode;
    href: string;
    color: string;
}[] = [
    {
        label: "Total Pengguna",
        key: "totalUsers",
        icon: <Users size={28} />,
        href: "/admin/users",
        color: "bg-blue-500",
    },
    {
        label: "Total Laporan",
        key: "totalReports",
        icon: <Flag size={28} />,
        href: "/admin/reports",
        color: "bg-amber-500",
    },
    {
        label: "Transaksi Koin",
        key: "totalCoinTx",
        icon: <CircleDollarSign size={28} />,
        href: "/admin/transactions/coins",
        color: "bg-emerald-500",
    },
    {
        label: "Penukaran Produk",
        key: "totalRedemptions",
        icon: <ArrowLeftRight size={28} />,
        href: "/admin/transactions/products",
        color: "bg-purple-500",
    },
];

export default function AdminDashboardPage() {
    const router = useRouter();
    const { data: summary, isLoading } = useDashboard();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#1E7D38] animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-black">
                    {cards.map((card) => (
                        <button
                            key={card.key}
                            onClick={() => router.push(card.href)}
                            className="rounded-xl p-5 text-white flex items-center gap-4 hover:brightness-110 transition cursor-pointer text-left"
                            style={{
                                backgroundColor: card.color
                                    .replace("bg-", "#")
                                    .replace("-500", ""),
                            }}
                        >
                            <div className="p-3 rounded-lg bg-white/20">
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-sm opacity-80">
                                    {card.label}
                                </p>
                                <p className="text-3xl font-bold">
                                    {summary?.[card.key] ?? "..."}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
