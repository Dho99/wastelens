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

    const officers = await prisma.petugas.findMany({
      where: { dinas_id: dinas.id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { laporan: true } },
      },
      orderBy: { nama: "asc" },
    });

    return NextResponse.json({ success: true, data: officers });
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
    const { nama, no_hp, user_id } = body;

    if (!nama) {
      return NextResponse.json({ error: "nama wajib diisi", code: "VALIDATION" }, { status: 400 });
    }

    const officer = await prisma.petugas.create({
      data: {
        dinas_id: dinas.id,
        user_id: user_id ?? dinas.user_id,
        nama,
        no_hp: no_hp ?? "",
      },
    });

    return NextResponse.json({ success: true, data: officer }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
