import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const kopdesList = await prisma.kopdes.findMany({
      include: {
        user: {
          select: {
            email: true,
            status: true,
          }
        }
      },
      orderBy: { nama: "asc" },
    });

    // Flatten representation
    const flattened = kopdesList.map((k) => ({
      id: k.id,
      nama: k.nama,
      alamat: k.alamat,
      email: k.user.email,
      status: k.user.status,
      user_id: k.user_id,
    }));

    return NextResponse.json({ success: true, data: flattened });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const adminRole = (session.user as { role?: string }).role;
    if (adminRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { nama, alamat, email } = body;

    if (!nama || !alamat || !email) {
      return NextResponse.json({ error: "Nama, alamat, dan email wajib diisi" }, { status: 400 });
    }

    // Check unique email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    // Auto-create a linked user account
    const signUpBody = {
      name: nama,
      email: email,
      password: "defaultpassword123", // secure fallback
      nama: nama,
      role: "kopdes",
    };

    const signUpResult = await auth.api.signUpEmail({
      body: signUpBody,
      headers: request.headers,
      asResponse: false,
    });

    const userId = (signUpResult as { user?: { id: string } })?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Gagal membuat akun user Koperasi" }, { status: 500 });
    }

    // Create Kopdes
    const newKopdes = await prisma.kopdes.create({
      data: {
        user_id: userId,
        nama: nama.trim(),
        alamat: alamat.trim(),
      }
    });

    return NextResponse.json({ success: true, data: newKopdes }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const adminRole = (session.user as { role?: string }).role;
    if (adminRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, nama, alamat } = body;

    if (!id || !nama || !alamat) {
      return NextResponse.json({ error: "ID, nama, dan alamat wajib diisi" }, { status: 400 });
    }

    const kopdes = await prisma.kopdes.findUnique({ where: { id } });
    if (!kopdes) {
      return NextResponse.json({ error: "Koperasi tidak ditemukan" }, { status: 404 });
    }

    // Update Kopdes name and address
    const updated = await prisma.kopdes.update({
      where: { id },
      data: {
        nama: nama.trim(),
        alamat: alamat.trim(),
      }
    });

    // Also update associated user name
    await prisma.user.update({
      where: { id: kopdes.user_id },
      data: { name: nama.trim() }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const adminRole = (session.user as { role?: string }).role;
    if (adminRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID wajib disertakan" }, { status: 400 });
    }

    const kopdes = await prisma.kopdes.findUnique({ where: { id } });
    if (!kopdes) {
      return NextResponse.json({ error: "Koperasi tidak ditemukan" }, { status: 404 });
    }

    // Delete Kopdes (linked user will cascade delete due to prisma schema Cascade)
    await prisma.user.delete({
      where: { id: kopdes.user_id }
    });

    return NextResponse.json({ success: true, message: "Koperasi berhasil dihapus" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
