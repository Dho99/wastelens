import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const koinGroup = await prisma.transaksiKoin.groupBy({
      by: ["user_id"],
      _sum: { jumlah: true },
      _count: { id: true },
      orderBy: { _sum: { jumlah: "desc" } },
      take: 10,
    });

    const userIds = koinGroup.map((entry) => entry.user_id);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, nama: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const result = koinGroup.map((entry) => ({
      nama: userMap.get(entry.user_id)?.nama ?? "Unknown",
      total_laporan: entry._count.id,
      total_koin: entry._sum.jumlah ?? 0,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 },
    );
  }
}
