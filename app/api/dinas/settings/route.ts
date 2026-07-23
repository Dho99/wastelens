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

    const [state, dinasProfile] = await Promise.all([
      prisma.dlhPortalState.findUnique({
        where: { dinas_id: dinas.id },
        select: { data: true },
      }),
      prisma.dinas.findUnique({
        where: { id: dinas.id },
        select: {
          nama_dinas: true,
          kontak: true,
          user: { select: { email: true, phoneNumber: true } },
          area_cakupan: { select: { nama_wilayah: true }, orderBy: { nama_wilayah: "asc" } },
        },
      }),
    ]);

    const savedSettings = ((state?.data as Record<string, unknown>)?.settings ?? {}) as Record<string, unknown>;
    const defaults = {
      agency: dinasProfile?.nama_dinas ?? dinas.name,
      region: dinasProfile?.area_cakupan.map((area) => area.nama_wilayah).join(", ") ?? "",
      email: dinasProfile?.user.email ?? "",
      phone: dinasProfile?.kontak || dinasProfile?.user.phoneNumber || "",
      autoDispatch: false,
      emailAlert: false,
      soundAlert: false,
    };
    const settings = { ...defaults, ...savedSettings };

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
