import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { autoAssignDinas, assignKendaraan } from "@/lib/services/assignment";
import {
    createReport,
    ReportError,
} from "@/server/modules/reports/report.service";
import { reverseGeocode } from "@/server/modules/location/reverse-geocode.service";
import { triggerUserEvent } from "@/server/websocket/pusher.service";
import { notifyUser } from "@/server/websocket/notify.service";
import { createReportCreatedEvent } from "@/server/websocket/websocket.events";
import { LAPORAN_STATUS } from "@/lib/constants/laporan-status";

const KOIN_PER_LAPORAN = 10;

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const userId = session.user.id;
        const body = await request.json();

        if (body.clientRequestId && body.temporaryImageId) {
            return handleNewPayload(body, userId);
        }

        return handleLegacyPayload(body, userId);
    } catch (error) {
        if (error instanceof ReportError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                    errorCode: error.code,
                },
                { status: 409 },
            );
        }
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { success: false, message, errorCode: "INTERNAL_SERVER_ERROR" },
            { status: 500 },
        );
    }
}
async function handleNewPayload(body: Record<string, unknown>, userId: string) {
    const result = await createReport({
        userId,
        temporaryImageId: body.temporaryImageId as string,
        clientRequestId: body.clientRequestId as string,
        analysis: body.analysis as {
            sizeCategory: string;
            wasteTypes: string[];
            drainageRisk: boolean;
            accessObstructionRisk: boolean;
            confidence: number;
            needsManualReview: boolean;
        },
        location: body.location as {
            browser: {
                latitude: number;
                longitude: number;
                accuracyMeters: number;
                capturedAt: string;
            };
            exif: {
                latitude: number | null;
                longitude: number | null;
                timestamp: string | null;
            };
            verification: {
                distanceDifferenceMeters: number | null;
                riskFlags: string[];
            };
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Laporan berhasil dibuat",
            data: {
                reportId: result.reportId,
                status: result.status,
                priority: {
                    score: result.priorityScore,
                    level: result.priorityLevel,
                },
                estimatedLoadUnit: result.estimatedLoadUnit,
                rewardStatus: result.rewardStatus,
                address: result.address,
            },
        },
        { status: 201 },
    );
}

async function handleLegacyPayload(
    body: Record<string, unknown>,
    userId: string,
) {
    const { image, lat, lng, kategori_ukuran, rekomendasi_kendaraan } =
        body as {
            image?: string;
            lat?: unknown;
            lng?: unknown;
            kategori_ukuran?: string;
            rekomendasi_kendaraan?: string;
        };

    if (
        !image ||
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        !kategori_ukuran
    ) {
        return NextResponse.json(
            {
                error: "image, lat, lng, and kategori_ukuran are required",
                code: "VALIDATION",
            },
            { status: 400 },
        );
    }

    const result = await prisma.$transaction(async (tx) => {
        const address = await reverseGeocode(lat, lng);
        const district = address?.district ?? null;
        const { dinas_id, petugas_id } = await autoAssignDinas(district);

        const kendaraanResult = dinas_id
            ? await assignKendaraan(
                  dinas_id,
                  rekomendasi_kendaraan ?? null,
                  kategori_ukuran,
              )
            : { kendaraan_id: null, petugas_id: null, estimatedLoadKg: 0 };

        const laporan = await tx.laporan.create({
            data: {
                user_id: userId,
                dinas_id,
                petugas_id: kendaraanResult.petugas_id ?? petugas_id,
                kendaraan_id: kendaraanResult.kendaraan_id,
                foto_url: image,
                lokasi_lat: lat,
                lokasi_lng: lng,
                kategori_ukuran,
                rekomendasi_kendaraan: rekomendasi_kendaraan ?? null,
                status: LAPORAN_STATUS.PENDING,
                assigned_load_kg: kendaraanResult.kendaraan_id
                    ? kendaraanResult.estimatedLoadKg
                    : null,
                load_released_at: null,
            },
        });

        await tx.foto.create({
            data: {
                laporan_id: laporan.id,
                url: image,
            },
        });

        return laporan;
    });

    const createdEvent = createReportCreatedEvent({
        laporanId: result.id,
        status: result.status,
    });

    triggerUserEvent(userId, createdEvent);

    if (result.dinas_id) {
        const dinas = await prisma.dinas.findUnique({
            where: { id: result.dinas_id },
            select: { user_id: true },
        });
        if (dinas?.user_id) {
            await notifyUser({
                userId: dinas.user_id,
                laporanId: result.id,
                pesan: "Laporan sampah baru masuk dan menunggu penanganan.",
                event: createdEvent,
            });
        }
    }

    return NextResponse.json(
        { id: result.id, status: result.status },
        { status: 201 },
    );
}
