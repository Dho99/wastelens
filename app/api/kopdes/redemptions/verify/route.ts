import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyRedemptionToken } from "@/server/modules/redemption/redemption.service";
import { verifyRedemptionSchema } from "@/server/modules/redemption/redemption.schema";
import { RedemptionError } from "@/server/modules/redemption/redemption.errors";

export async function POST(request: NextRequest) {
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
    if (role !== "kopdes") {
      return NextResponse.json(
        {
          success: false,
          error: "Akses ditolak",
          code: "FORBIDDEN",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parsed = verifyRedemptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Token tidak valid",
          code: "QR_INVALID",
        },
        { status: 400 },
      );
    }

    const result = await verifyRedemptionToken(
      parsed.data.token,
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
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
