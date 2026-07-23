import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const kendaraanId = request.nextUrl.searchParams.get("kendaraanId");
    const routes = await prisma.dispatchRoute.findMany({
      where: {
        dinas_id: dinas.id,
        ...(kendaraanId ? { kendaraan_id: kendaraanId } : {}),
        status: { in: ["DRAFT", "CONFIRMED", "IN_PROGRESS"] },
      },
      include: {
        kendaraan: { select: { id: true, jenis: true, kapasitas: true, current_load: true } },
        petugas: { select: { id: true, nama: true } },
        laporan: {
          where: { status: { in: ["PENDING", "DIJEMPUT"] } },
          orderBy: { route_order: "asc" },
          select: {
            id: true,
            route_order: true,
            status: true,
            lokasi_lat: true,
            lokasi_lng: true,
            address_text: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ success: true, data: routes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
