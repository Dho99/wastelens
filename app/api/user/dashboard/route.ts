import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
    DashboardData,
    UserProfile,
    ContributionStats,
    RecentActivity,
    EnvironmentHero,
    NearestPartner,
} from "@/app/user/(dashboard)/types/dashboard";

const STATUS_MAP: Record<string, RecentActivity["status"]> = {
    PENDING: "PERLU_DIPERIKSA",
    DIJEMPUT: "DIPROSES",
    SELESAI: "SELESAI",
};

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 10) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized", code: "AUTH" }, { status: 401 });
        }

        const userId = session.user.id;

        const userData = await prisma.user.findUnique({
            where: { id: userId },
            select: { nama: true, saldo_koin: true, image: true },
        });

        if (!userData) {
            return NextResponse.json({ success: false, error: "User not found", code: "NOT_FOUND" }, { status: 404 });
        }

        const [laporanCounts, recentLaporan, leaderboardData, kopdesList] = await Promise.all([
            prisma.laporan.groupBy({
                by: ["status"],
                where: { user_id: userId },
                _count: true,
            }),
            prisma.laporan.findMany({
                where: { user_id: userId },
                include: {
                    foto: { take: 1, select: { url: true } },
                    transaksi_koin: { take: 1, select: { jumlah: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 5,
            }),
            prisma.transaksiKoin.groupBy({
                by: ["user_id"],
                _sum: { jumlah: true },
                orderBy: { _sum: { jumlah: "desc" } },
                take: 3,
            }),
            prisma.kopdes.findMany({
                select: { id: true, nama: true, alamat: true },
                take: 5,
            }),
        ]);

        const statusCount: Record<string, number> = {};
        for (const item of laporanCounts) {
            statusCount[item.status] = item._count;
        }

        const stats: ContributionStats = {
            sent: statusCount["PENDING"] ?? 0,
            completed: statusCount["SELESAI"] ?? 0,
            processed: statusCount["DIJEMPUT"] ?? 0,
            needsReview: 0,
        };

        const activities: RecentActivity[] = recentLaporan.map((l) => ({
            id: l.id,
            location: `${l.lokasi_lat.toFixed(4)}, ${l.lokasi_lng.toFixed(4)}`,
            time: l.createdAt.toISOString(),
            status: STATUS_MAP[l.status] ?? "PERLU_DIPERIKSA",
            points: l.transaksi_koin[0]?.jumlah ?? 0,
            imageUrl: l.foto[0]?.url ?? "",
        }));

        const leaderboardUserIds = leaderboardData.map((e) => e.user_id);
        const users = await prisma.user.findMany({
            where: { id: { in: leaderboardUserIds } },
            select: { id: true, nama: true, image: true },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));

        const heroes: EnvironmentHero[] = leaderboardData.map((entry, i) => ({
            rank: i + 1,
            name: userMap.get(entry.user_id)?.nama ?? "Unknown",
            avatarUrl: userMap.get(entry.user_id)?.image ?? "",
            isTop: i === 0,
            totalCoins: entry._sum.jumlah ?? 0,
        }));

        const partners: NearestPartner[] = kopdesList.map((k) => ({
            id: k.id,
            name: k.nama,
            distance: "",
            description: k.alamat,
            imageUrl: "",
        }));

        const userProfile: UserProfile = {
            name: userData.nama,
            greeting: getGreeting(),
            coins: userData.saldo_koin,
            avatarUrl: userData.image ?? "",
        };

        const dashboardData: DashboardData = {
            user: userProfile,
            stats,
            activities,
            heroes,
            partners,
        };

        return NextResponse.json({ success: true, data: dashboardData }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ success: false, error: message, code: "INTERNAL" }, { status: 500 });
    }
}
