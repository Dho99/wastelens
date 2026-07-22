import { NextRequest, NextResponse } from "next/server";
import { expirePendingRedemptions } from "@/server/modules/redemption/redemption.service";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          code: "FORBIDDEN",
        },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const limit =
      typeof (body as { limit?: number }).limit === "number"
        ? (body as { limit: number }).limit
        : 50;

    const result = await expirePendingRedemptions(limit);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
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
