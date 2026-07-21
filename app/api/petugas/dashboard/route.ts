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

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [totalTasks, selesaiHariIni, recentTasks] = await Promise.all([
      prisma.laporan.count({
        where: {
          petugas_id: petugas.id,
          status: { not: "SELESAI" },
        },
      }),
      prisma.laporan.count({
        where: {
          petugas_id: petugas.id,
          status: "SELESAI",
          updatedAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      prisma.laporan.findMany({
        where: {
          petugas_id: petugas.id,
          status: { not: "SELESAI" },
        },
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          total_tasks: totalTasks,
          selesai_hari_ini: selesaiHariIni,
          tersisa: totalTasks,
          recent_tasks: recentTasks.map((task) => ({
            id: task.id,
            address: task.address_text ?? "Alamat tidak tersedia",
            status: task.status,
            waste_types: task.waste_types,
            kategori_ukuran: task.kategori_ukuran,
            priority_level: task.priority_level,
            foto_url: task.foto_url,
            lokasi_lat: task.lokasi_lat,
            lokasi_lng: task.lokasi_lng,
            createdAt: task.createdAt,
            user: task.user,
          })),
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
