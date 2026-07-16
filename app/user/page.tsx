"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    getDashboardDummyData,
    DashboardData,
} from "./services/dashboardService";
import { Greeting } from "./components/Greeting";
import { BalanceCard } from "./components/BalanceCard";
import { ReportCTA } from "./components/ReportCTA";
import { ContributionStats } from "./components/ContributionStats";
import { RecentActivities } from "./components/RecentActivities";
import { EnvironmentHeroes } from "./components/EnvironmentHeroes";
import { NearestPartners } from "./components/NearestPartners";
import { SkeletonLoader } from "./components/SkeletonLoader";

export default function UserDashboardPage() {
    const mockData = getDashboardDummyData();
    const { data: session } = useSession();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(mockData);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     setLoading(false);
    // }, []);

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
