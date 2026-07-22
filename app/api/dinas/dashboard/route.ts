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

    const [activeReports, vehicles, officers] = await Promise.all([
      prisma.laporan.findMany({
        where: {
          dinas_id: dinas.id,
          petugas_id: null,
          kendaraan_id: null,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.kendaraan.findMany({
        where: { dinas_id: dinas.id },
      }),
      prisma.petugas.findMany({
        where: { dinas_id: dinas.id },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          _count: { select: { laporan: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { activeReports, vehicles, officers },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
