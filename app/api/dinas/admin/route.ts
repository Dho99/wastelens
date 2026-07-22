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

    const user = await prisma.user.findUnique({
      where: { id: dinas.user_id },
      select: { id: true, name: true, email: true, image: true, phoneNumber: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        dinasId: dinas.id,
        dinasName: dinas.nama_dinas,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phoneNumber } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Tidak ada data yang diupdate", code: "VALIDATION" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: dinas.user_id },
      data: updateData,
      select: { id: true, name: true, email: true, image: true, phoneNumber: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
