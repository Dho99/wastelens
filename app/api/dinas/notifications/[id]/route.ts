import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    const existing = await prisma.notifikasi.findFirst({
      where: { id, user_id: dinas.user_id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Notifikasi tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    const updated = await prisma.notifikasi.update({
      where: { id },
      data: { status_baca: body.status_baca ?? true },
    });

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

    const existing = await prisma.notifikasi.findFirst({
      where: { id, user_id: dinas.user_id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Notifikasi tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.notifikasi.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
