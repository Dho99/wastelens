import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const dinas = await getRequestDinas(request);
        if (!dinas) {
            return NextResponse.json(
                { error: "Akses DLH tidak ditemukan", code: "AUTH" },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number(searchParams.get("limit")) || 50),
        );

        const where: Record<string, unknown> = { dinas_id: dinas.id };
        if (status && status !== "Semua") where.status = status;

        const [reports, total] = await Promise.all([
            prisma.laporan.findMany({
                where,
                include: {
                    user: { select: { name: true } },
                    foto: { select: { url: true } },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.laporan.count({ where }),
        ]);

        // console.log(reports);

        return NextResponse.json({
            success: true,
            data: reports,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}
