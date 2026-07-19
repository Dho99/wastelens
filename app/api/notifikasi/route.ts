import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const markRead = searchParams.get("markRead");

    if (markRead) {
      await prisma.notifikasi.updateMany({
        where: { id: markRead, user_id: userId },
        data: { status_baca: true },
      });
    }

    const where: Record<string, unknown> = { user_id: userId };
    if (unreadOnly) {
      where.status_baca = false;
    }

    const notifications = await prisma.notifikasi.findMany({
      where,
      orderBy: { id: "desc" },
      take: limit,
      select: {
        id: true,
        pesan: true,
        status_baca: true,
        laporan_id: true,
      },
    });

    const unreadCount = await prisma.notifikasi.count({
      where: { user_id: userId, status_baca: false },
    });

    return NextResponse.json({
      success: true,
      data: { notifications, unreadCount },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
