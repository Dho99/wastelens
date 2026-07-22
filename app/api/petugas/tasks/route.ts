import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LAPORAN_STATUS } from "@/lib/constants/laporan-status";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "petugas") {
      return NextResponse.json({ error: "Forbidden", code: "AUTH" }, { status: 403 });
    }

    const petugas = await prisma.petugas.findFirst({
      where: { user_id: session.user.id },
      select: { id: true },
    });

    if (!petugas) {
      return NextResponse.json({ error: "Petugas not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const skip = (page - 1) * limit;

    const [laporan, total] = await Promise.all([
      prisma.laporan.findMany({
        where: {
          petugas_id: petugas.id,
          status: { not: LAPORAN_STATUS.SELESAI },
        },
        include: {
          user: { select: { name: true } },
          kendaraan: { select: { jenis: true } },
          dinas: { select: { nama_dinas: true } },
        },
        orderBy: [
          { route_order: { sort: "asc", nulls: "last" } },
          { priority_score: { sort: "desc", nulls: "last" } },
          { createdAt: "asc" },
        ],
        skip,
        take: limit,
      }),
      prisma.laporan.count({
        where: {
          petugas_id: petugas.id,
          status: { not: LAPORAN_STATUS.SELESAI },
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: laporan.map((l) => ({
          id: l.id,
          user_id: l.user_id,
          dinas_id: l.dinas_id,
          petugas_id: l.petugas_id,
          kendaraan_id: l.kendaraan_id,
          foto_url: l.foto_url,
          lokasi_lat: l.lokasi_lat,
          lokasi_lng: l.lokasi_lng,
          kategori_ukuran: l.kategori_ukuran,
          rekomendasi_kendaraan: l.rekomendasi_kendaraan,
          status: l.status,
          status_label: l.status === LAPORAN_STATUS.PENDING ? "Menunggu Diproses" : l.status,
          route_order: (l as unknown as Record<string, unknown>).route_order ?? null,
          priority_score: (l as unknown as Record<string, unknown>).priority_score ?? null,
          createdAt: l.createdAt,
          user: l.user,
          kendaraan: l.kendaraan,
          dinas: l.dinas,
        })),
        pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
