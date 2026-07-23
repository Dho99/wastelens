import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";
import { LAPORAN_STATUS } from "@/lib/constants/laporan-status";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const [activeReports, assignedReports, vehicles, officers, dispatchRoutes] = await Promise.all([
      prisma.laporan.findMany({
        where: {
          dinas_id: dinas.id,
          status: { in: [LAPORAN_STATUS.ANALYZED, LAPORAN_STATUS.WAITING] },
          petugas_id: null,
          kendaraan_id: null,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.laporan.findMany({
        where: {
          dinas_id: dinas.id,
          status: { in: [LAPORAN_STATUS.PENDING, LAPORAN_STATUS.DIJEMPUT] },
          petugas_id: { not: null },
          kendaraan_id: { not: null },
          route_order: { not: null },
        },
        orderBy: [
          { petugas_id: "asc" },
          { kendaraan_id: "asc" },
          { route_order: { sort: "asc", nulls: "last" } },
          { createdAt: "asc" },
        ],
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
      prisma.dispatchRoute.findMany({
        where: {
          dinas_id: dinas.id,
          status: { in: ["DRAFT", "CONFIRMED", "IN_PROGRESS"] },
        },
        select: {
          id: true,
          petugas_id: true,
          kendaraan_id: true,
          status: true,
          route_geometry: true,
          estimated_distance_km: true,
          estimated_duration_minutes: true,
          routing_source: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { activeReports, assignedReports, vehicles, officers, dispatchRoutes },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
