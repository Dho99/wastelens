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

    const officer = await prisma.petugas.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!officer) {
      return NextResponse.json({ error: "Akun tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    if (body.name !== undefined || body.email !== undefined) {
      const userUpdate: Record<string, unknown> = {};
      if (body.name !== undefined) userUpdate.name = body.name;
      if (body.email !== undefined) userUpdate.email = body.email;
      await prisma.user.update({
        where: { id: officer.user_id },
        data: userUpdate,
      });
    }

    if (body.no_hp !== undefined) {
      await prisma.petugas.update({
        where: { id },
        data: { no_hp: body.no_hp },
      });
    }

    return NextResponse.json({ success: true });
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

    const officer = await prisma.petugas.findFirst({
      where: { id, dinas_id: dinas.id },
    });
    if (!officer) {
      return NextResponse.json({ error: "Akun tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.petugas.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
