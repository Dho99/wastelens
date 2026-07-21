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

    const dinasList = await prisma.dinas.findMany({
      include: {
        user: {
          select: {
            email: true,
            status: true,
          }
        }
      },
      orderBy: { nama_dinas: "asc" },
    });

    // Flatten presentation
    const flattened = dinasList.map((d) => ({
      id: d.id,
      nama_dinas: d.nama_dinas,
      kontak: d.kontak,
      email: d.user?.email ?? "-",
      status: d.user?.status ?? "active",
      user_id: d.user_id,
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
    const { nama_dinas, kontak, email } = body;

    if (!nama_dinas || !kontak || !email) {
      return NextResponse.json({ error: "Nama dinas, kontak, dan email wajib diisi" }, { status: 400 });
    }

    // Check unique email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    // Auto-create associated user account
    const signUpBody = {
      name: nama_dinas,
      email: email,
      password: "defaultpassword123",
      nama: nama_dinas,
      role: "dinas",
    };

    const signUpResult = await auth.api.signUpEmail({
      body: signUpBody,
      headers: request.headers,
      asResponse: false,
    });

    const userId = (signUpResult as { user?: { id: string } })?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Gagal membuat akun user Dinas" }, { status: 500 });
    }

    // Create Dinas
    const newDinas = await prisma.dinas.create({
      data: {
        user_id: userId,
        nama_dinas: nama_dinas.trim(),
        kontak: kontak.trim(),
      }
    });

    return NextResponse.json({ success: true, data: newDinas }, { status: 201 });
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
    const { id, nama_dinas, kontak } = body;

    if (!id || !nama_dinas || !kontak) {
      return NextResponse.json({ error: "ID, nama dinas, dan kontak wajib diisi" }, { status: 400 });
    }

    const dinas = await prisma.dinas.findUnique({ where: { id } });
    if (!dinas) {
      return NextResponse.json({ error: "Dinas tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.dinas.update({
      where: { id },
      data: {
        nama_dinas: nama_dinas.trim(),
        kontak: kontak.trim(),
      }
    });

    // Also update associated user name
    await prisma.user.update({
      where: { id: dinas.user_id },
      data: { name: nama_dinas.trim() }
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

    const dinas = await prisma.dinas.findUnique({ where: { id } });
    if (!dinas) {
      return NextResponse.json({ error: "Dinas tidak ditemukan" }, { status: 404 });
    }

    // Delete Dinas (linked user will cascade delete due to prisma schema Cascade)
    await prisma.user.delete({
      where: { id: dinas.user_id }
    });

    return NextResponse.json({ success: true, message: "Dinas berhasil dihapus" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
