import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const { id } = await params;

    const penukaran = await prisma.penukaran.findUnique({
      where: { id },
      include: {
        produk: {
          include: {
            kopdes: {
              select: { nama: true, alamat: true },
            },
          },
        },
      },
    });

    if (!penukaran) {
      return NextResponse.json({ success: false, error: "Penukaran not found", code: "NOT_FOUND" }, { status: 404 });
    }

    if (penukaran.user_id !== session.user.id) {
      return NextResponse.json({ success: false, error: "Forbidden", code: "AUTH" }, { status: 403 });
    }

    const statusMap: Record<string, "Selesai" | "PROSES" | "BATAL"> = {
      REDEEMED: "Selesai",
      PENDING: "PROSES",
      EXPIRED: "BATAL",
    };

    const data = {
      id: penukaran.id,
      itemName: penukaran.produk.nama_barang,
      itemPrice: penukaran.jumlah_koin,
      itemImageUrl: "",
      status: statusMap[penukaran.status] ?? "BATAL",
      merchantName: penukaran.produk.kopdes.nama,
      timestampText: new Date(penukaran.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      transactionId: `WL-RED-${penukaran.id.slice(0, 4).toUpperCase()}`,
      storeLocation: penukaran.produk.kopdes.alamat,
      validUntil: penukaran.status === "PENDING"
        ? new Date(
            new Date(penukaran.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        : penukaran.redeemed_at
          ? new Date(penukaran.redeemed_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
          : "-",
      tipsDescription:
        "Setelah habis digunakan, jangan buang kemasannya! Cuci bersih dan bawa kembali ke bank sampah terdekat untuk mendapatkan poin tambahan.",
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message, code: "INTERNAL" }, { status: 500 });
  }
}
