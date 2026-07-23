import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const dinas = await getRequestDinas(request);
  if (!dinas) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: "Media tidak valid" }, { status: 400 });

  const media = await prisma.dlhMedia.findFirst({
    where: { id, dinas_id: dinas.id },
    select: { data: true, mime_type: true, size_bytes: true },
  });
  if (!media) return NextResponse.json({ error: "Media tidak ditemukan" }, { status: 404 });

  return new NextResponse(Buffer.from(media.data), {
    headers: {
      "Content-Type": media.mime_type,
      "Content-Length": String(media.size_bytes),
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const dinas = await getRequestDinas(request);
  if (!dinas) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: "Media tidak valid" }, { status: 400 });

  const result = await prisma.dlhMedia.deleteMany({ where: { id, dinas_id: dinas.id } });
  if (!result.count) return NextResponse.json({ error: "Media tidak ditemukan" }, { status: 404 });
  await prisma.user.updateMany({ where: { id: dinas.userId, image: `/api/dinas/media/${id}` }, data: { image: null } });

  return NextResponse.json({ success: true });
}
