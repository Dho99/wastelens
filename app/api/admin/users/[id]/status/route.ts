import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { status: newStatus } = body;

    if (!newStatus || !["active", "nonaktif"].includes(newStatus)) {
      return NextResponse.json(
        { error: "status must be 'active' or 'nonaktif'", code: "VALIDATION" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found", code: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({ message: "Status akun berhasil diubah" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
