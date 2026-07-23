import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", code: "AUTH" },
        { status: 401 },
      );
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "petugas") {
      return NextResponse.json(
        { error: "Forbidden", code: "AUTH" },
        { status: 403 },
      );
    }

    const petugas = await prisma.petugas.findFirst({
      where: { user_id: session.user.id },
      include: {
        dinas: {
          include: { area_cakupan: { take: 1 } },
        },
        user: { select: { name: true, email: true, image: true } },
      },
    });

    if (!petugas) {
      return NextResponse.json(
        { error: "Petugas not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const tugasSelesai = await prisma.laporan.count({
      where: {
        petugas_id: petugas.id,
        status: "SELESAI",
      },
    });

    const zone = petugas.dinas?.area_cakupan?.[0]?.nama_wilayah ?? null;

    return NextResponse.json(
      {
        success: true,
        data: {
          id: petugas.id,
          nama: petugas.nama,
          no_hp: petugas.no_hp,
          email: petugas.user?.email ?? null,
          image: petugas.user?.image ?? null,
          zone,
          tugas_selesai: tugasSelesai,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", code: "AUTH" },
        { status: 401 },
      );
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "petugas") {
      return NextResponse.json(
        { error: "Forbidden", code: "AUTH" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { nama, no_hp } = body;

    if (!nama && !no_hp) {
      return NextResponse.json(
        {
          error: "Minimal satu field (nama atau no_hp) harus diisi",
          code: "VALIDATION",
        },
        { status: 400 },
      );
    }

    const petugas = await prisma.petugas.findFirst({
      where: { user_id: session.user.id },
      select: { id: true },
    });

    if (!petugas) {
      return NextResponse.json(
        { error: "Petugas not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    // Update petugas.nama and user.name atomically to keep them in sync
    const [updated] = await prisma.$transaction([
      prisma.petugas.update({
        where: { id: petugas.id },
        data: {
          ...(nama !== undefined ? { nama } : {}),
          ...(no_hp !== undefined ? { no_hp } : {}),
        },
        include: {
          dinas: {
            include: { area_cakupan: { take: 1 } },
          },
          user: { select: { name: true, email: true, image: true } },
        },
      }),
      ...(nama !== undefined
        ? [
            prisma.user.update({
              where: { id: session.user.id },
              data: { name: nama },
            }),
          ]
        : []),
    ]);

    const tugasSelesai = await prisma.laporan.count({
      where: {
        petugas_id: updated.id,
        status: "SELESAI",
      },
    });

    const zone = updated.dinas?.area_cakupan?.[0]?.nama_wilayah ?? null;

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated.id,
          nama: updated.nama,
          no_hp: updated.no_hp,
          email: updated.user?.email ?? null,
          image: updated.user?.image ?? null,
          zone,
          tugas_selesai: tugasSelesai,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 },
    );
  }
}
