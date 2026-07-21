import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LAPORAN_STATUS } from "@/lib/constants/laporan-status";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
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

        const role = (session.user as { role?: string }).role;
        if (role !== "petugas") {
            return NextResponse.json(
                { error: "Forbidden", code: "AUTH" },
                { status: 403 },
            );
        }

        const petugas = await prisma.petugas.findFirst({
            where: { user_id: session.user.id },
            select: { id: true },
        });

        if (!petugas) {
            return NextResponse.json(
                { error: "Petugas not found", code: "NOT_FOUND" },
                { status: 404 },
            );
        }

        const { id } = await params;

        const laporan = await prisma.laporan.findFirst({
            where: {
                id,
                petugas_id: petugas.id,
            },
            include: {
                user: { select: { id: true, name: true } },
                kendaraan: { select: { id: true, jenis: true } },
                dinas: { select: { id: true, nama_dinas: true } },
                foto: { select: { url: true } },
                verifikasi_pickup: {
                    select: {
                        id: true,
                        foto_sebelum: true,
                        foto_sesudah: true,
                        waktu: true,
                    },
                    orderBy: { waktu: "desc" },
                    take: 1,
                },
            },
        });

        if (!laporan) {
            return NextResponse.json(
                { error: "Task not found", code: "NOT_FOUND" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                ...laporan,
                status_label:
                    laporan.status === LAPORAN_STATUS.PENDING
                        ? "Menunggu Diproses"
                        : laporan.status,
            },
            { status: 200 },
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
