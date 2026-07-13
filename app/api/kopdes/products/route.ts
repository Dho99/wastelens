import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

        const produk = await prisma.produk.findMany({
            where: { kopdes_id: kopdes.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(produk, { status: 200 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}

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
        const { nama_barang, harga_koin, stok } = body;

        if (
            !nama_barang ||
            typeof harga_koin !== "number" ||
            typeof stok !== "number"
        ) {
            return NextResponse.json(
                {
                    error: "nama_barang, harga_koin, and stok are required",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }

        if (harga_koin < 0 || stok < 0) {
            return NextResponse.json(
                {
                    error: "harga_koin and stok must be non-negative",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }

        const produk = await prisma.produk.create({
            data: {
                kopdes_id: kopdes.id,
                nama_barang,
                harga_koin,
                stok,
            },
        });

        return NextResponse.json(
            { id: produk.id, nama_barang: produk.nama_barang },
            { status: 201 },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}
