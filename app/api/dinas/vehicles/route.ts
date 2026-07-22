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

    const vehicles = await prisma.kendaraan.findMany({
      where: { dinas_id: dinas.id },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json();
    const { jenis, kapasitas } = body;

    if (!jenis || !kapasitas) {
      return NextResponse.json({ error: "jenis dan kapasitas wajib diisi", code: "VALIDATION" }, { status: 400 });
    }

    const vehicle = await prisma.kendaraan.create({
      data: {
        dinas_id: dinas.id,
        jenis,
        kapasitas: Number(kapasitas),
        current_load: 0,
      },
    });

    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
