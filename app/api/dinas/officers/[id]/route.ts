import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";

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

    const officer = await prisma.petugas.findFirst({
      where: { id, dinas_id: dinas.id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { laporan: true } },
      },
    });
    if (!officer) {
      return NextResponse.json({ error: "Petugas tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: officer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
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
    const { nama, no_hp } = body;

    const existing = await prisma.petugas.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Petugas tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (nama !== undefined) updateData.nama = nama;
    if (no_hp !== undefined) updateData.no_hp = no_hp;

    const updated = await prisma.petugas.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
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

    const existing = await prisma.petugas.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Petugas tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.petugas.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
