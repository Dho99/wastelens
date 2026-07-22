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

    const vehicle = await prisma.kendaraan.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!vehicle) {
      return NextResponse.json({ error: "Kendaraan tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: vehicle });
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
    const { jenis, kapasitas, current_load } = body;

    const existing = await prisma.kendaraan.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Kendaraan tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (jenis !== undefined) updateData.jenis = jenis;
    if (kapasitas !== undefined) updateData.kapasitas = Number(kapasitas);
    if (current_load !== undefined) updateData.current_load = Number(current_load);

    const updated = await prisma.kendaraan.update({
      where: { id },
      data: updateData,
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

    const existing = await prisma.kendaraan.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Kendaraan tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.kendaraan.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
