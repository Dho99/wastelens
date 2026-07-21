import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MEDIA_URL_PATTERN = /^\/api\/dinas\/media\/([0-9a-f-]{36})$/i;
const OFFICER_ID_PATTERN = /^FLD-[0-9]{4}$/;

export async function POST(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const formData = await request.formData();
    const photo = formData.get("photo");
    if (!(photo instanceof File)) {
      return NextResponse.json({ error: "File gambar wajib dipilih", code: "PHOTO_REQUIRED" }, { status: 400 });
    }
    if (!ALLOWED_IMAGE_TYPES.has(photo.type)) {
      return NextResponse.json({ error: "Gunakan gambar JPG, PNG, atau WEBP", code: "PHOTO_TYPE" }, { status: 415 });
    }
    if (photo.size <= 0 || photo.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Ukuran gambar maksimal 2 MB", code: "PHOTO_SIZE" }, { status: 413 });
    }

    const id = crypto.randomUUID();
    const url = `/api/dinas/media/${id}`;
    const data = Buffer.from(await photo.arrayBuffer());
    const requestedKind = formData.get("kind");
    const officerId = String(formData.get("officerId") ?? "").trim().toUpperCase();
    if (requestedKind === "officer-profile" && !OFFICER_ID_PATTERN.test(officerId)) {
      return NextResponse.json({ error: "ID petugas tidak valid", code: "OFFICER_ID" }, { status: 400 });
    }
    const kind = requestedKind === "officer-profile" ? `officer-profile:${officerId}` : "admin-profile";
    const previousUrl = formData.get("previousUrl");
    const previousId = typeof previousUrl === "string" ? previousUrl.match(MEDIA_URL_PATTERN)?.[1] : undefined;

    await prisma.$transaction(async (transaction) => {
      await transaction.dlhMedia.create({
        data: {
          id,
          dinas_id: dinas.id,
          uploaded_by: dinas.userId,
          kind,
          mime_type: photo.type,
          size_bytes: photo.size,
          data,
        },
      });
      if (kind === "admin-profile") {
        await transaction.user.update({ where: { id: dinas.userId }, data: { image: url } });
      }
      if (previousId && previousId !== id) {
        await transaction.dlhMedia.deleteMany({ where: { id: previousId, dinas_id: dinas.id } });
      }
    });

    return NextResponse.json({ success: true, data: { id, url, mimeType: photo.type, size: photo.size } }, { status: 201 });
  } catch (error) {
    console.error("DLH media upload failed", error);
    return NextResponse.json({ error: "Gambar gagal disimpan ke database", code: "UPLOAD_FAILED" }, { status: 500 });
  }
}
