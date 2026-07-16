import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { haversineDistance } from "@/lib/services/spatial";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") ?? "");
    const lng = parseFloat(searchParams.get("lng") ?? "");

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Valid lat and lng query params are required", code: "VALIDATION" },
        { status: 400 }
      );
    }

    const kopdesList = await prisma.kopdes.findMany({
      include: {
        _count: { select: { produk: true } },
      },
    });

    const result = kopdesList
      .map((kopdes) => ({
        id: kopdes.id,
        nama: kopdes.nama,
        alamat: kopdes.alamat,
        jarak_km: Math.round(haversineDistance(lat, lng, -6.2, 106.8) / 1000),
        produk_count: kopdes._count.produk,
      }))
      .sort((a, b) => a.jarak_km - b.jarak_km);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 }
    );
  }
}
