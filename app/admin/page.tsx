"use client";

import { useRouter } from "next/navigation";
import { Users, Flag, Banknote, Package, Loader2 } from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import { MetricCard } from "./components/MetricCard";
import { WeeklyReportChart } from "./components/WeeklyReportChart";
import { WasteDistributionChart } from "./components/WasteDistributionChart";

export default function AdminDashboardPage() {
    const router = useRouter();
    const { data, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader2 className="w-9 h-9 text-[#287A38] animate-spin" />
                <p className="text-sm font-semibold text-[#64748b]">
                    Memuat dashboard...
                </p>
            </div>
        );
    }

    const summary = data?.summary ?? {
        totalUsers: 9,
        totalReports: 5,
        totalCoinTx: 3,
        totalRedemptions: 2,
    };

    const weeklyReports = data?.weeklyReports ?? [
        { day: "Sen", value: 12 },
        { day: "Sel", value: 19 },
        { day: "Rab", value: 15 },
        { day: "Kam", value: 25 },
        { day: "Jum", value: 22 },
        { day: "Sab", value: 30 },
        { day: "Min", value: 28 },
    ];

    const wasteDistribution = data?.wasteDistribution ?? [
        {
            id: "aman",
            label: "Aman",
            weightKg: 21.5,
            percentage: 78,
            color: "#287A38",
        },
        {
            id: "bahaya",
            label: "Bahaya",
            weightKg: 6.2,
            percentage: 16,
            color: "#005F4B",
        },
        {
            id: "lainnya",
            label: "Lainnya",
            weightKg: 1.8,
            percentage: 6,
            color: "#9FE1C3",
        },
    ];

    return (
        <div className="p-8 md:p-10 space-y-8 bg-[#f8fafc] min-h-screen text-[#0f172a] select-none">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight">
                    Dashboard
                </h1>
                <p className="text-sm md:text-base font-medium text-[#64748b] mt-1.5">
                    Selamat datang kembali, Ringkasan performa WasteLens hari
                    ini.
                </p>
            </div>

            {/* Summary Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                    title="Total Pengguna"
                    value={summary.totalUsers}
                    icon={<Users className="w-6 h-6" />}
                    iconBgColor="bg-[#c6f6d5]"
                    iconTextColor="text-[#22543d]"
                    onClick={() => router.push("/admin/users")}
                />
                <MetricCard
                    title="Total Laporan"
                    value={summary.totalReports}
                    icon={<Flag className="w-6 h-6 fill-current" />}
                    iconBgColor="bg-[#b2f5ea]"
                    iconTextColor="text-[#234e52]"
                    onClick={() => router.push("/admin/reports")}
                />
                <MetricCard
                    title="Transaksi Koin"
                    value={summary.totalCoinTx}
                    icon={<Banknote className="w-6 h-6" />}
                    iconBgColor="bg-[#fefcbf]"
                    iconTextColor="text-[#744210]"
                    onClick={() => router.push("/admin/reports")}
                />
                <MetricCard
                    title="Penukaran Produk"
                    value={summary.totalRedemptions}
                    icon={<Package className="w-6 h-6" />}
                    iconBgColor="bg-[#c6f6d5]"
                    iconTextColor="text-[#1a4731]"
                    onClick={() => router.push("/admin/reports")}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8">
                    <WeeklyReportChart data={weeklyReports} />
                </div>
                <div className="lg:col-span-4">
                    <WasteDistributionChart items={wasteDistribution} />
                </div>
            </div>
        </div>
    );
}
