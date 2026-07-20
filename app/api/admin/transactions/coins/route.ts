import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const skip = (page - 1) * limit;
    const userId = searchParams.get("userId") ?? undefined;

    const where: Record<string, unknown> = {};
    if (userId) where.user_id = userId;

    const [data, total] = await Promise.all([
      prisma.transaksiKoin.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          laporan: { select: { id: true } },
        },
      }),
      prisma.transaksiKoin.count({ where }),
    ]);

    const mappedData = data.map((tx) => ({
      ...tx,
      user: {
        id: tx.user.id,
        nama: tx.user.name,
      }
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: mappedData,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
