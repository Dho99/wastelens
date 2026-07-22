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

    const state = await prisma.dlhPortalState.findUnique({
      where: { dinas_id: dinas.id },
      select: { data: true },
    });

    const settings = (state?.data as Record<string, unknown>)?.settings ?? {};

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json();

    const existing = await prisma.dlhPortalState.findUnique({
      where: { dinas_id: dinas.id },
    });

    const currentData = (existing?.data as Record<string, unknown>) ?? {};

    await prisma.dlhPortalState.upsert({
      where: { dinas_id: dinas.id },
      create: {
        dinas_id: dinas.id,
        data: { ...currentData, settings: body },
      },
      update: {
        data: { ...currentData, settings: body },
      },
    });

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
