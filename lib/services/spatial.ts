import { prisma } from "@/lib/prisma";

const COOLDOWN_HOURS = parseInt(process.env.COOLDOWN_HOURS ?? "24", 10);
const COOLDOWN_RADIUS_METERS = parseInt(process.env.COOLDOWN_RADIUS_METERS ?? "50", 10);

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function checkLocationCooldown(
  lat: number,
  lng: number
): Promise<{ inCooldown: boolean; message: string | null }> {
  const recentReports = await prisma.laporan.findMany({
    where: {
      status: { not: "selesai" },
      createdAt: {
        gte: new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000),
      },
    },
    select: { lokasi_lat: true, lokasi_lng: true, createdAt: true },
  });

  for (const report of recentReports) {
    const dist = haversineDistance(lat, lng, report.lokasi_lat, report.lokasi_lng);
    if (dist <= COOLDOWN_RADIUS_METERS) {
      return {
        inCooldown: true,
        message: `Lokasi sedang dalam masa cooldown (${COOLDOWN_HOURS} jam). Jarak dari laporan terakhir: ${Math.round(dist)}m.`,
      };
    }
  }

  return { inCooldown: false, message: null };
}

export async function findNearestDinas(
  lat: number,
  lng: number
): Promise<{ dinasId: string; namaDinas: string } | null> {
  const areaCakupanRecords = await prisma.areaCakupan.findMany({
    include: {
      dinas: {
        select: { id: true, nama_dinas: true },
      },
    },
  });

  if (areaCakupanRecords.length === 0) return null;

  let nearest: { dinasId: string; namaDinas: string; distance: number } | null = null;
  const dummyLat = -6.2;
  const dummyLng = 106.8;

  for (const area of areaCakupanRecords) {
    const dist = haversineDistance(lat, lng, dummyLat, dummyLng);
    if (!nearest || dist < nearest.distance) {
      nearest = {
        dinasId: area.dinas.id,
        namaDinas: area.dinas.nama_dinas,
        distance: dist,
      };
    }
  }

  return nearest ? { dinasId: nearest.dinasId, namaDinas: nearest.namaDinas } : null;
}
