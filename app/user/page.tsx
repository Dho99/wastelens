"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Greeting } from "./(dashboard)/components/Greeting";
import { BalanceCard } from "./(dashboard)/components/BalanceCard";
import { ReportCTA } from "./(dashboard)/components/ReportCTA";
import { ContributionStats } from "./(dashboard)/components/ContributionStats";
import { RecentActivities } from "./(dashboard)/components/RecentActivities";
import { EnvironmentHeroes } from "./(dashboard)/components/EnvironmentHeroes";
import { NearestPartners } from "./(dashboard)/components/NearestPartners";
import { SkeletonLoader } from "./(dashboard)/components/SkeletonLoader";
import { useDashboard } from "./(dashboard)/hooks/useDashboard";

export default function UserDashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { data, isLoading, isError } = useDashboard();

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (isError || !data) {
        return (
            <div className="p-8 text-center text-gray-500">
                Gagal memuat data dashboard.
            </div>
        );
    }

    const displayName = session?.user?.name || data.user.name;

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-12">
            <Greeting name={displayName} greeting={data.user.greeting} />

            <BalanceCard
                coins={data.user.coins}
                onTukarReward={() => router.push("/user/exchange")}
                onRiwayat={() => router.push("/user/history")}
            />

            <ReportCTA onReportClick={() => router.push("/user/scan")} />

            <ContributionStats
                sent={data.stats.sent}
                completed={data.stats.completed}
                processed={data.stats.processed}
                needsReview={data.stats.needsReview}
            />

            <RecentActivities
                activities={data.activities}
                onViewAll={() => router.push("/user/history")}
            />

            <EnvironmentHeroes
                heroes={data.heroes}
                onViewFullLeaderboard={() => router.push("/user/history")}
            />

            <NearestPartners
                partners={data.partners}
                onPartnerClick={() => router.push("/user/exchange")}
            />
        </div>
    );
}
