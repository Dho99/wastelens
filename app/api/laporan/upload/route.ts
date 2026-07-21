import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadFile, UploadError } from "@/server/modules/upload/upload.service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const formData = await request.formData();
    const photo = formData.get("photo");

    if (!photo || !(photo instanceof File)) {
      return NextResponse.json(
        { error: "File foto diperlukan", code: "PHOTO_REQUIRED" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await photo.arrayBuffer());

    const result = await uploadFile(session.user.id, buffer, photo.type);

    return NextResponse.json({
      success: true,
      data: {
        temporaryImageId: result.temporaryImageId,
        url: result.secureUrl,
        secureUrl: result.secureUrl,
        publicId: result.publicId,
        expiresAt: result.expiresAt,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
