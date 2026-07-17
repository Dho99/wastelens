import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const { id } = await params;

    const kopdes = await prisma.kopdes.findUnique({
      where: { id },
    });

    if (!kopdes) {
      return NextResponse.json({ error: "Kopdes not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const produk = await prisma.produk.findMany({
      where: {
        kopdes_id: id,
        stok: { gt: 0 },
      },
      orderBy: { nama_barang: "asc" },
    });

    return NextResponse.json(produk, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 }
    );
  }
}
