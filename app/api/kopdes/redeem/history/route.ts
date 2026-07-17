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

    const userId = session.user.id;
    const role = (session.user as { role?: string }).role;
    if (role !== "kopdes") {
      return NextResponse.json({ error: "Forbidden", code: "AUTH" }, { status: 403 });
    }

    const kopdes = await prisma.kopdes.findFirst({
      where: { user_id: userId },
      select: { id: true },
    });

    if (!kopdes) {
      return NextResponse.json({ error: "Kopdes not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const skip = (page - 1) * limit;

    const [penukaran, total] = await Promise.all([
      prisma.penukaran.findMany({
        where: {
          produk: { kopdes_id: kopdes.id },
        },
        include: {
          produk: { select: { nama_barang: true } },
          user: { select: { nama: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.penukaran.count({
        where: {
          produk: { kopdes_id: kopdes.id },
        },
      }),
    ]);

    return NextResponse.json(
      {
        data: penukaran.map((p) => ({
          id: p.id,
          user_nama: p.user.nama,
          produk_nama: p.produk.nama_barang,
          jumlah_koin: p.jumlah_koin,
          status: p.status,
          redeemed_at: p.redeemed_at,
          created_at: p.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
