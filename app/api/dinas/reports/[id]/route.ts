import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/server/websocket/notify.service";
import {
  createReportAssignedEvent,
  createReportStatusUpdatedEvent,
} from "@/server/websocket/websocket.events";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const dinas = await getRequestDinas(_request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const report = await prisma.laporan.findFirst({
      where: { id, dinas_id: dinas.id },
      include: {
        user: { select: { name: true, phoneNumber: true } },
        foto: { select: { url: true, mime_type: true } },
        verifikasi_pickup: { orderBy: { waktu: "desc" }, take: 1 },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Laporan tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}

function statusMessage(status: string): string {
  if (status === "DITOLAK") {
    return "Laporan Anda ditolak.";
  }
  return `Status laporan Anda diperbarui menjadi ${status}.`;
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const dinas = await getRequestDinas(_request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = await _request.json();
    const { petugasId, kendaraanId, status } = body;

    const existing = await prisma.laporan.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Laporan tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    if (kendaraanId) {
      const activeRoute = await prisma.dispatchRoute.findFirst({
        where: {
          dinas_id: dinas.id,
          kendaraan_id: kendaraanId,
          status: "IN_PROGRESS",
        },
        select: { id: true },
      });
      if (activeRoute) {
        return NextResponse.json(
          {
            error:
              "Kendaraan sedang menjalankan rute aktif. Pilih kendaraan lain atau masukkan laporan ke perencanaan berikutnya.",
            code: "ROUTE_IN_PROGRESS",
          },
          { status: 409 },
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (petugasId !== undefined) updateData.petugas_id = petugasId || null;
    if (kendaraanId !== undefined) updateData.kendaraan_id = kendaraanId || null;
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.laporan.update({
      where: { id },
      data: updateData,
    });

    const petugasChanged =
      petugasId !== undefined && petugasId && petugasId !== existing.petugas_id;
    const statusChanged =
      status !== undefined && status !== existing.status;

    if (petugasChanged) {
      const petugas = await prisma.petugas.findUnique({
        where: { id: petugasId },
        select: { user_id: true },
      });

      const assignedEvent = createReportAssignedEvent({
        laporanId: id,
        petugasId,
      });

      if (petugas?.user_id) {
        await notifyUser({
          userId: petugas.user_id,
          laporanId: id,
          pesan: "Laporan pickup baru ditugaskan kepada Anda. Segera periksa daftar tugas.",
          event: assignedEvent,
        });
      }

      if (existing.user_id) {
        await notifyUser({
          userId: existing.user_id,
          laporanId: id,
          pesan: "Laporan Anda telah dijadwalkan untuk dijemput.",
          event: assignedEvent,
        });
      }
    }

    if (statusChanged && existing.user_id) {
      await notifyUser({
        userId: existing.user_id,
        laporanId: id,
        pesan: statusMessage(status),
        event: createReportStatusUpdatedEvent({
          laporanId: id,
          status,
        }),
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const dinas = await getRequestDinas(_request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const existing = await prisma.laporan.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Laporan tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.laporan.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
