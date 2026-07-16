"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import type { DashboardData } from "./(dashboard)/types/dashboard";
import { Greeting } from "./(dashboard)/components/Greeting";
import { BalanceCard } from "./(dashboard)/components/BalanceCard";
import { ReportCTA } from "./(dashboard)/components/ReportCTA";
import { ContributionStats } from "./(dashboard)/components/ContributionStats";
import { RecentActivities } from "./(dashboard)/components/RecentActivities";
import { EnvironmentHeroes } from "./(dashboard)/components/EnvironmentHeroes";
import { NearestPartners } from "./(dashboard)/components/NearestPartners";
import { SkeletonLoader } from "./(dashboard)/components/SkeletonLoader";
import { apiFetch } from "@/lib/api-client";
import { dashboardService } from "./(dashboard)/services/dashboardService";

export default function UserDashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { getDashboardData } = dashboardService;

    // const fetchDashboardData = useCallback(async () => {
    //     try {
    //         const response = await apiFetch<DashboardData>(getDashboardData);
    //         setData(response);
    //     } catch (error) {
    //         console.error("Error fetching dashboard data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    // useEffect(() => {
    //     fetchDashboardData();
    // }, [fetchDashboardData]);

    if (loading) {
        return <SkeletonLoader />;
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-gray-500">
                Gagal memuat data dashboard.
            </div>
        );
    }

    // Fallback to session user name if mock data name is absent
    const displayName = session?.user?.name || data.user.name;

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-12">
            {/* 1. Greeting Component */}
            <Greeting name={displayName} greeting={data.user.greeting} />

            {/* 2. Balance Card Component */}
            <BalanceCard
                coins={data.user.coins}
                onTukarReward={() => router.push("/user/exchange")}
                onRiwayat={() => router.push("/user/history")}
            />

            {/* 3. Report CTA Component */}
            <ReportCTA onReportClick={() => router.push("/user/scan")} />

            {/* 4. Contribution Stats Component */}
            <ContributionStats
                sent={data.stats.sent}
                completed={data.stats.completed}
                processed={data.stats.processed}
                needsReview={data.stats.needsReview}
            />

            {/* 5. Recent Activities Component */}
            <RecentActivities
                activities={data.activities}
                onViewAll={() => router.push("/user/history")}
            />

            {/* 6. Environment Heroes Leaderboard Component */}
            <EnvironmentHeroes
                heroes={data.heroes}
                onViewFullLeaderboard={() => router.push("/user/history")}
            />

            {/* 7. Nearest Partners Component */}
            <NearestPartners
                partners={data.partners}
                onPartnerClick={(partnerId) => {
                    console.log(`Navigate to partner: ${partnerId}`);
                    router.push("/user/exchange");
                }}
            />
        </div>
    );
}
