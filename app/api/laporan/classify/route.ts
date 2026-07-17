import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { classifyWasteImage } from "@/lib/services/vision";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json();
    const { image, mimeType } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required", code: "VALIDATION" },
        { status: 400 }
      );
    }

    const result = await classifyWasteImage(image, mimeType ?? "image/jpeg");

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "AI_SERVICE" },
      { status: 502 }
    );
  }
}
