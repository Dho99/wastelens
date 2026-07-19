import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cancelRedemption } from "@/server/modules/redemption/redemption.service";
import { RedemptionError } from "@/server/modules/redemption/redemption.errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Silakan login terlebih dahulu",
          code: "UNAUTHENTICATED",
        },
        { status: 401 },
      );
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "user") {
      return NextResponse.json(
        {
          success: false,
          error: "Akses ditolak",
          code: "FORBIDDEN",
        },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = (body as { reason?: string }).reason;

    await cancelRedemption(id, session.user.id, reason);

    return NextResponse.json(
      {
        success: true,
        data: null,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof RedemptionError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.errorCode,
        },
        { status: error.statusCode },
      );
    }
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
