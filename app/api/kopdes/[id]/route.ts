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

    const kopdes = await prisma.kopdes.findUnique({
      where: { id },
      include: {
        produk: {
          where: { stok: { gt: 0 } },
          orderBy: { nama_barang: "asc" },
        },
      },
    });

    if (!kopdes) {
      return NextResponse.json({ success: false, error: "Kopdes not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const data = {
      id: kopdes.id,
      name: kopdes.nama,
      address: kopdes.alamat,
      isOpen: true,
      rating: 4.5,
      coverImageUrl: "",
      products: kopdes.produk.map((p) => ({
        id: p.id,
        name: p.nama_barang,
        category: "LAINNYA" as const,
        coinsPrice: p.harga_koin,
        imageUrl: "",
      })),
    };

    const categoryOrder = ["SEMBAKO", "KEBERSIHAN", "LAINNYA"] as const;
    data.products.sort(
      (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
    );

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message, code: "INTERNAL" }, { status: 500 });
  }
}
