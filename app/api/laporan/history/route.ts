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

    const userId = session.user.id;

    const laporan = await prisma.laporan.findMany({
      where: { user_id: userId },
      include: {
        foto: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(laporan, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 }
    );
  }
}
