import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_UPDATED_TEXT: Record<string, string> = {
    PENDING: "Menunggu verifikasi oleh petugas",
    DIJEMPUT: "Sampah sedang dalam proses penjemputan",
    SELESAI: "Laporan telah selesai diproses",
};

const getStatusUpdatedText = (status: string, createdAt: Date): string => {
    const diff = Date.now() - createdAt.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const prefix =
        hours < 1
            ? "Baru saja"
            : hours < 24
              ? `${hours} jam yang lalu`
              : `${Math.floor(hours / 24)} hari yang lalu`;

    if (STATUS_UPDATED_TEXT[status]) {
        return `Status diperbarui ${prefix} — ${STATUS_UPDATED_TEXT[status]}`;
    }
    return `Status diperbarui ${prefix}`;
};

const getLocationTitle = (lat: number, lng: number): string => {
    const latStr = lat.toFixed(4);
    const lngStr = lng.toFixed(4);
    return `${latStr}, ${lngStr}`;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const { id } = await params;

        const laporan = await prisma.laporan.findUnique({
            where: { id },
            include: {
                foto: true,
                transaksi_koin: { take: 1, select: { jumlah: true } },
            },
        });

        if (!laporan) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Laporan not found",
                    code: "NOT_FOUND",
                },
                { status: 404 },
            );
        }

        if (laporan.user_id !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Forbidden", code: "AUTH" },
                { status: 403 },
            );
        }

        const reportCode = `#REP-${laporan.id.slice(0, 5).toUpperCase()}`;
        const citizenPhotoUrl = laporan.foto_url;
        const aiPhotoUrl =
            laporan.foto.length > 1
                ? laporan.foto[1].url
                : (laporan.foto[0]?.url ?? "");
        const wasteTypes = laporan.kategori_ukuran
            ? [laporan.kategori_ukuran]
            : [];
        if (laporan.rekomendasi_kendaraan) {
            wasteTypes.push(laporan.rekomendasi_kendaraan);
        }

        const data = {
            id: laporan.id,
            reportCode,
            status: laporan.status as "SELESAI" | "PROSES" | "PERLU_DIPERIKSA",
            statusUpdatedText: getStatusUpdatedText(
                laporan.status,
                laporan.createdAt,
            ),
            citizenPhotoUrl,
            aiPhotoUrl,
            locationTitle: getLocationTitle(
                laporan.lokasi_lat,
                laporan.lokasi_lng,
            ),
            locationDetails: `Lat: ${laporan.lokasi_lat.toFixed(6)}, Lng: ${laporan.lokasi_lng.toFixed(6)}`,
            reportTime:
                new Date(laporan.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }) + " WIB",
            wasteTypes,
            pointsGained: laporan.transaksi_koin[0]?.jumlah ?? 0,
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { success: false, error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}
