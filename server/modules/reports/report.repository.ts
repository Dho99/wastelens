import { prisma } from "@/lib/prisma";

export async function findReportByClientRequestId(clientRequestId: string) {
  return prisma.laporan.findFirst({
    where: { client_request_id: clientRequestId },
    select: { id: true },
  });
}

export async function countActiveReportsInRadius(
  lat: number,
  lng: number,
  radiusMeters: number,
  excludeReportId?: string,
): Promise<number> {
  const reports = await prisma.laporan.findMany({
    where: {
      status: { in: ["WAITING", "ANALYZED", "PENDING", "DIJEMPUT"] },
      id: excludeReportId ? { not: excludeReportId } : undefined,
    },
    select: { lokasi_lat: true, lokasi_lng: true },
  });

  let count = 0;
  for (const r of reports) {
    const dist = haversineDistance(lat, lng, r.lokasi_lat, r.lokasi_lng);
    if (dist <= radiusMeters) count++;
  }
  return count;
}

type AddressInput = {
  address_text?: string | null;
  road_name?: string | null;
  district?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
};

export async function createLaporan(
  data: {
    user_id: string;
    foto_url: string;
    lokasi_lat: number;
    lokasi_lng: number;
    kategori_ukuran: string;
    status: string;
    photo_hash: string;
    photo_mime_type: string;
    photo_size_bytes: number;
    waste_types: string[];
    drainage_risk: boolean;
    access_obstruction_risk: boolean;
    visual_indicators: string[];
    confidence: number;
    needs_manual_review: boolean;
    analysis_provider: string;
    priority_score: number | null;
    priority_level: string | null;
    estimated_load_unit: number | null;
    client_request_id: string;
    lokasi_accuracy: number;
    lokasi_confirmed_lat: number;
    lokasi_confirmed_lng: number;
    lokasi_device_lat: number;
    lokasi_device_lng: number;
    lokasi_captured_at: Date;
    lokasi_exif_lat: number | null;
    lokasi_exif_lng: number | null;
    risk_flags: string[];
  } & AddressInput,
) {
  return prisma.$transaction(async (tx) => {
    const laporan = await tx.laporan.create({ data });

    await tx.foto.create({
      data: {
        laporan_id: laporan.id,
        url: data.foto_url,
        hash: data.photo_hash,
        mime_type: data.photo_mime_type,
        size_bytes: data.photo_size_bytes,
      },
    });

    return laporan;
  });
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
