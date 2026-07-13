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
      select: { id: true, nama: true },
    });

    if (!kopdes) {
      return NextResponse.json({ error: "Kopdes not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total_produk, total_redeemed_hari_ini, total_penukaran] = await Promise.all([
      prisma.produk.count({ where: { kopdes_id: kopdes.id } }),
      prisma.penukaran.count({
        where: {
          produk: { kopdes_id: kopdes.id },
          status: "REDEEMED",
          redeemed_at: { gte: todayStart },
        },
      }),
      prisma.penukaran.count({
        where: {
          produk: { kopdes_id: kopdes.id },
        },
      }),
    ]);

    return NextResponse.json(
      {
        kopdes_id: kopdes.id,
        nama: kopdes.nama,
        total_produk,
        total_redeemed_hari_ini,
        total_penukaran,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
