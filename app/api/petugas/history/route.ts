import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", code: "AUTH" },
        { status: 401 },
      );
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "petugas") {
      return NextResponse.json(
        { error: "Forbidden", code: "AUTH" },
        { status: 403 },
      );
    }

    const petugas = await prisma.petugas.findFirst({
      where: { user_id: session.user.id },
      select: { id: true },
    });

    if (!petugas) {
      return NextResponse.json(
        { error: "Petugas not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const search = searchParams.get("search") ?? "";
    const filter = searchParams.get("filter") ?? "all";
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      petugas_id: petugas.id,
      status: "SELESAI",
    };

    if (search) {
      where.OR = [
        { address_text: { contains: search, mode: "insensitive" } },
        { id: { equals: search } },
      ];
    }

    if (filter === "today") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      where.updatedAt = { gte: todayStart, lte: todayEnd };
    } else if (filter === "week") {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date();
      weekEnd.setHours(23, 59, 59, 999);
      where.updatedAt = { gte: weekStart, lte: weekEnd };
    }

    const [tasks, total, totalLoad] = await Promise.all([
      prisma.laporan.findMany({
        where,
        include: {
          user: { select: { name: true } },
          verifikasi_pickup: {
            select: { waktu: true },
            orderBy: { waktu: "desc" },
            take: 1,
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.laporan.count({ where }),
      prisma.laporan.aggregate({
        where: { petugas_id: petugas.id, status: "SELESAI" },
        _sum: { estimated_load_unit: true },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          tasks: tasks.map((t) => ({
            id: t.id,
            address: t.address_text ?? "Alamat tidak tersedia",
            kategori_ukuran: t.kategori_ukuran,
            waste_types: t.waste_types,
            estimated_load_unit: t.estimated_load_unit,
            updatedAt: t.updatedAt,
            user: t.user,
            verifikasi_pickup: t.verifikasi_pickup,
          })),
          pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit),
          },
          summary: {
            total_tasks: total,
            total_load: totalLoad._sum.estimated_load_unit ?? 0,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 },
    );
  }
}
