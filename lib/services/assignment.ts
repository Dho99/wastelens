import { prisma } from "@/lib/prisma";
import { findDinasByDistrict } from "./spatial";
import type { LAPORAN_STATUS } from "@/lib/constants/laporan-status";

export const LOAD_ESTIMATES_KG: Record<string, number> = {
    SMALL: 25,
    MEDIUM: 100,
    LARGE: 300,
    UNCERTAIN: 0,
} as const;

function computeEstimatedLoadKg(kategoriUkuran: string): number {
    return (
        LOAD_ESTIMATES_KG[kategoriUkuran.toUpperCase()] ??
        LOAD_ESTIMATES_KG.UNCERTAIN
    );
}

export async function autoAssignDinas(district: string | null): Promise<{
    dinas_id: string | null;
    petugas_id: string | null;
    kendaraan_id: string | null;
}> {
    if (!district || district.trim() === "") {
        return { dinas_id: null, petugas_id: null, kendaraan_id: null };
    }

    const dinas = await findDinasByDistrict(district);
    if (!dinas) {
        return { dinas_id: null, petugas_id: null, kendaraan_id: null };
    }

    return { dinas_id: dinas.dinasId, petugas_id: null, kendaraan_id: null };
}

export async function assignKendaraan(
    dinasId: string,
    rekomendasiKendaraan: string | null,
    kategoriUkuran: string,
): Promise<{
    kendaraan_id: string | null;
    petugas_id: string | null;
    estimatedLoadKg: number;
}> {
    const vehicleType = rekomendasiKendaraan ?? fallbackVehicle(kategoriUkuran);
    const estimatedLoad = computeEstimatedLoadKg(kategoriUkuran);

    const available = await prisma.$queryRawUnsafe<
        Array<{ id: string; current_load: number; kapasitas: number }>
    >(
        `SELECT id, current_load, kapasitas FROM "KENDARAAN"
     WHERE dinas_id = $1::uuid
       AND jenis = $2
       AND (current_load + $3) <= kapasitas
     ORDER BY current_load ASC
     LIMIT 1
     FOR UPDATE`,
        dinasId,
        vehicleType,
        estimatedLoad,
    );

    if (!available || available.length === 0) {
        return {
            kendaraan_id: null,
            petugas_id: null,
            estimatedLoadKg: estimatedLoad,
        };
    }

    const vehicle = available[0];

    await prisma.kendaraan.update({
        where: { id: vehicle.id },
        data: { current_load: { increment: estimatedLoad } },
    });

    const petugas = await prisma.petugas.findFirst({
        where: { dinas_id: dinasId },
        orderBy: { id: "asc" },
    });

    return {
        kendaraan_id: vehicle.id,
        petugas_id: petugas?.id ?? null,
        estimatedLoadKg: estimatedLoad,
    };
}

export function fallbackVehicle(kategoriUkuran: string): string {
    switch (kategoriUkuran.toLowerCase()) {
        case "small":
            return "pickup";
        case "medium":
            return "tossa";
        case "large":
            return "truck";
        default:
            return "pickup";
    }
}

export function computeAssignedLoadKg(kategoriUkuran: string): number {
    return computeEstimatedLoadKg(kategoriUkuran);
}

export async function assignPetugasByLoad(
    dinasId: string,
): Promise<string | null> {
    const officers = await prisma.petugas.findMany({
        where: { dinas_id: dinasId },
        select: { id: true },
    });

    if (officers.length === 0) return null;

    const taskCounts = await Promise.all(
        officers.map((o) =>
            prisma.laporan.count({
                where: {
                    petugas_id: o.id,
                    status: {
                        in: [LAPORAN_STATUS.PENDING, LAPORAN_STATUS.DIJEMPUT],
                    },
                },
            }),
        ),
    );

    const indexed = officers.map((o, i) => ({
        id: o.id,
        count: taskCounts[i],
    }));
    indexed.sort((a, b) => a.count - b.count);

    return indexed[0].id;
}

export async function getAvailableVehiclesForDinas(dinasId: string) {
    return prisma.kendaraan.findMany({
        where: { dinas_id: dinasId },
        select: {
            id: true,
            jenis: true,
            kapasitas: true,
            current_load: true,
        },
    });
}

export async function getAvailableOfficersForDinas(dinasId: string) {
    const officers = await prisma.petugas.findMany({
        where: { dinas_id: dinasId },
        select: { id: true, nama: true },
    });

    const taskCounts = await Promise.all(
        officers.map((o) =>
            prisma.laporan.count({
                where: {
                    petugas_id: o.id,
                    status: {
                        in: [LAPORAN_STATUS.PENDING, LAPORAN_STATUS.DIJEMPUT],
                    },
                },
            }),
        ),
    );

    return officers.map((o, i) => ({
        id: o.id,
        nama: o.nama,
        activeTaskCount: taskCounts[i],
    }));
}
