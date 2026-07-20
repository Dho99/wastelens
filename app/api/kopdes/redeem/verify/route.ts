import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    verifyRedemptionPayload,
    type RedemptionPayload,
} from "@/lib/services/qr";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const userId = session.user.id;
        const role = (session.user as { role?: string }).role;
        if (role !== "kopdes") {
            return NextResponse.json(
                { error: "Forbidden", code: "AUTH" },
                { status: 403 },
            );
        }

        const kopdes = await prisma.kopdes.findFirst({
            where: { user_id: userId },
            select: { id: true },
        });

        if (!kopdes) {
            return NextResponse.json(
                { error: "Kopdes not found", code: "NOT_FOUND" },
                { status: 404 },
            );
        }

        const body = await request.json();
        const { qr_payload } = body as { qr_payload: RedemptionPayload };

        if (!qr_payload) {
            return NextResponse.json(
                { error: "qr_payload is required", code: "VALIDATION" },
                { status: 400 },
            );
        }

        if (!verifyRedemptionPayload(qr_payload)) {
            return NextResponse.json(
                {
                    error: "QR code tidak valid (signature mismatch)",
                    code: "INVALID_QR",
                },
                { status: 400 },
            );
        }

        const now = Date.now();
        const qrAge = now - qr_payload.timestamp;
        const qrMaxAge = 24 * 60 * 60 * 1000;

        if (qrAge > qrMaxAge) {
            return NextResponse.json(
                { error: "QR code sudah kedaluwarsa", code: "QR_EXPIRED" },
                { status: 400 },
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            const penukaran = await tx.penukaran.findUnique({
                where: { id: qr_payload.penukaran_id },
                include: {
                    produk: {
                        select: {
                            id: true,
                            nama_barang: true,
                            stok: true,
                            kopdes_id: true,
                        },
                    },
                    user: { select: { id: true, name: true } },
                },
            });

            if (!penukaran) {
                throw {
                    status: 404,
                    code: "NOT_FOUND",
                    message: "Penukaran tidak ditemukan",
                };
            }

            if (penukaran.produk.kopdes_id !== kopdes.id) {
                throw {
                    status: 400,
                    code: "FORBIDDEN",
                    message: "Produk bukan milik kopdes ini",
                };
            }

            if (penukaran.status !== "PENDING") {
                throw {
                    status: 400,
                    code: "ALREADY_REDEEMED",
                    message: `Penukaran sudah ${penukaran.status.toLowerCase()} sebelumnya`,
                };
            }

            if (penukaran.produk.stok < 1) {
                throw {
                    status: 400,
                    code: "OUT_OF_STOCK",
                    message: "Stok produk habis",
                };
            }

            const updated = await tx.penukaran.update({
                where: { id: penukaran.id },
                data: {
                    status: "REDEEMED",
                    redeemed_at: new Date(),
                },
            });

            await tx.produk.update({
                where: { id: penukaran.produk.id },
                data: { stok: { decrement: 1 } },
            });

            return {
                penukaran_id: updated.id,
                status: updated.status,
                redeemed_at: updated.redeemed_at,
                produk: {
                    nama_barang: penukaran.produk.nama_barang,
                    jumlah_koin: penukaran.jumlah_koin,
                },
                user: {
                    nama: penukaran.user.name,
                },
            };
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        if (error && typeof error === "object" && "status" in error) {
            const e = error as {
                status: number;
                code: string;
                message: string;
            };
            return NextResponse.json(
                { error: e.message, code: e.code },
                { status: e.status },
            );
        }
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}
