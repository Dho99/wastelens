import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const userId = session.user.id;

        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get("lat") ?? "");
        const lng = parseFloat(searchParams.get("lng") ?? "");

        const [userData, earnedThisWeek, recentPenukaran, kopdesList] =
            await Promise.all([
                prisma.user.findUnique({
                    where: { id: userId },
                    select: { saldo_koin: true },
                }),
                prisma.transaksiKoin.aggregate({
                    where: {
                        user_id: userId,
                        jenis: "EARN",
                        laporan: {
                            createdAt: {
                                gte: new Date(
                                    new Date().setDate(
                                        new Date().getDate() - 7,
                                    ),
                                ),
                            },
                        },
                    },
                    _sum: { jumlah: true },
                }),
                prisma.penukaran.findMany({
                    where: { user_id: userId },
                    include: {
                        produk: {
                            select: { nama_barang: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                }),
                prisma.kopdes.findMany({
                    include: { _count: { select: { produk: true } } },
                    take: 10,
                }),
            ]);

        if (!userData) {
            return NextResponse.json(
                { success: false, error: "User not found", code: "NOT_FOUND" },
                { status: 404 },
            );
        }

        const partners = kopdesList.map((k) => ({
            id: k.id,
            name: k.nama,
            distance:
                isNaN(lat) || isNaN(lng)
                    ? ""
                    : `${Math.round(Math.random() * 2 + 0.1 * 10) / 10}km`,
            rewardCount: k._count.produk,
            isOpen: true,
            type: "STORE" as const,
        }));

        const history = recentPenukaran.map((p) => ({
            id: p.id,
            title: p.produk.nama_barang,
            dateText: new Date(p.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            }),
            status:
                p.status === "REDEEMED"
                    ? ("BERHASIL" as const)
                    : p.status === "PENDING"
                      ? ("PROSES" as const)
                      : ("GAGAL" as const),
            coinsSpent: p.jumlah_koin,
            imageUrl: "",
        }));

        const data = {
            coins: userData.saldo_koin,
            growthThisWeek: earnedThisWeek._sum.jumlah ?? 0,
            partners,
            history,
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.log(error);
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { success: false, error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}
