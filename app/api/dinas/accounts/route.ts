import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
        user: { select: { id: true, name: true, email: true, image: true, phoneNumber: true } },
      },
      orderBy: { nama: "asc" },
    });

    const accounts = officers.map((o) => ({
      id: o.id,
      userId: o.user_id,
      name: o.user.name,
      email: o.user.email,
      phone: o.no_hp ?? o.user.phoneNumber ?? "",
      role: "Petugas Lapangan" as const,
      active: true,
      image: o.user.image,
    }));

    return NextResponse.json({ success: true, data: accounts });
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
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email, dan password wajib diisi", code: "VALIDATION" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar", code: "CONFLICT" }, { status: 409 });
    }

    const newUser = await auth.api.signUpEmail({
      headers: request.headers,
      body: { name, email, password },
    });

    await prisma.petugas.create({
      data: {
        dinas_id: dinas.id,
        user_id: newUser.user.id,
        nama: name,
        no_hp: phone ?? "",
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: newUser.user.id, name, email, phone: phone ?? "", role: "Petugas Lapangan", active: true },
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat akun";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 400 });
  }
}
