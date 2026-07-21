import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRedemption } from "@/server/modules/redemption/redemption.service";
import { createRedemptionSchema } from "@/server/modules/redemption/redemption.schema";
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

        const userStatus = (session.user as { status?: string }).status;
        if (userStatus !== "active") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Akun tidak aktif",
                    code: "ACCOUNT_INACTIVE",
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
        const parsed = createRedemptionSchema.safeParse(body);
        if (!parsed.success) {
            const firstError = parsed.error.issues[0];
            const errorCode = firstError.path.includes("quantity")
                ? "INVALID_QUANTITY"
                : "INVALID_REQUEST";
            return NextResponse.json(
                {
                    success: false,
                    error: firstError.message,
                    code: errorCode,
                },
                { status: 400 },
            );
        }

        const { productId, quantity } = parsed.data;

        const result = await createRedemption({
            userId: session.user.id,
            productId,
            quantity,
            idempotencyKey,
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: result.redemptionId,
                    redemptionId: result.redemptionId,
                    status: result.status,
                    qrisData: result.qrPayload,
                    expiresAt: result.expiresAt,
                },
            },
            { status: 201 },
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
            error instanceof Error
                ? error.message
                : "Terjadi kesalahan internal";
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
