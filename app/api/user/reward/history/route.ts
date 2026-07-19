import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const userId = session.user.id;

    const penukaran = await prisma.penukaran.findMany({
      where: { user_id: userId },
      include: {
        produk: {
          select: {
            nama_barang: true,
            kopdes: { select: { nama: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const grouped: Record<string, typeof penukaran> = {};
    for (const p of penukaran) {
      const date = new Date(p.createdAt);
      const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    }

    const data = Object.entries(grouped).map(([monthYear, items]) => ({
      monthYear,
      items: items.map((p) => ({
        id: p.id,
        title: p.produk.nama_barang,
        status: p.status === "REDEEMED" ? "BERHASIL" as const : p.status === "PENDING" ? "PROSES" as const : "KADALUARSA" as const,
        merchantName: p.produk.kopdes?.nama ?? "",
        merchantType: "STORE" as const,
        timestampText: new Date(p.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        coinsSpent: p.jumlah_koin,
        imageUrl: "",
      })),
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message, code: "INTERNAL" }, { status: 500 });
  }
}
