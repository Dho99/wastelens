import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { confirmRedemption } from "@/server/modules/redemption/redemption.service";
import { confirmRedemptionSchema } from "@/server/modules/redemption/redemption.schema";
import { RedemptionError } from "@/server/modules/redemption/redemption.errors";
import { isValidIdempotencyKey } from "@/lib/idempotency";

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

    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!idempotencyKey || !isValidIdempotencyKey(idempotencyKey)) {
      return NextResponse.json(
        {
          success: false,
          error: "Idempotency-Key wajib berupa UUID",
          code: "IDEMPOTENCY_KEY_REQUIRED",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = confirmRedemptionSchema.safeParse(body);
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

    const result = await confirmRedemption(
      parsed.data.token,
      session.user.id,
      idempotencyKey,
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
