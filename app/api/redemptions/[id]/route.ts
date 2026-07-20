import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRedemptionDetail } from "@/server/modules/redemption/redemption.service";
import { RedemptionError } from "@/server/modules/redemption/redemption.errors";

export async function GET(
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

        const { id } = await params;

        const result = await getRedemptionDetail(
            id,
            session.user.id,
            (session.user as { role?: string }).role ?? "user",
        );

        console.log("[Result]", result);

        const responseData = {
            id: result.id,
            status: result.status,
            product: result.product,
            koperasi: result.koperasi,
            quantity: result.quantity,
            unitCoinPrice: result.unitCoinPrice,
            totalCoins: result.totalCoins,
            qrisData: result.status === "PENDING" ? result.qrPayload : null,
            createdAt: result.createdAt,
            expiresAt: result.expiresAt,
            redeemedAt: result.redeemedAt,
            cancelledAt: result.cancelledAt,
            expiredAt: result.expiredAt,
        };

        return NextResponse.json(
            {
                success: true,
                data: responseData,
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
