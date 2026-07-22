import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const { id } = await params;

    // Try finding report in DB
    const reportDb = await prisma.laporan.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        dinas: { select: { nama_dinas: true } },
        kendaraan: { select: { jenis: true } },
        foto: { select: { url: true }, take: 1 },
      },
    }).catch(() => null);

    const reportNumber = id.startsWith("LPR-") ? id : `LPR-${id.slice(0, 7).toUpperCase()}`;

    const pelapor = reportDb?.user?.name || "Bpk. Agus";
    const jamLaporan = reportDb
      ? new Date(reportDb.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
      : "09:15 WIB";
    
    const alamat = "Jl. KHZ Mustofa No. 12, Menteng";
    const fotoUrl = reportDb?.foto?.[0]?.url || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80";
    
    const timestampText = reportDb
      ? new Date(reportDb.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " GMT+7"
      : "24 Oct 2023, 09:12:44 GMT+7";

    const lat = reportDb?.lokasi_lat || -6.1923;
    const lng = reportDb?.lokasi_lng || 106.8370;

    const detailData = {
      id,
      reportNumber,
      pelapor,
      jamLaporan,
      alamat,
      fotoUrl,
      timestampText,
      estimasiPenangananText: "~120 Menit",
      timelineSteps: [
        { id: "1", label: "Dilaporkan", time: "09:15 WIB", completed: true },
        { id: "2", label: "Verifikasi AI", time: "09:16 WIB", completed: true },
        { id: "3", label: "Penugasan", time: "09:40 WIB", completed: true },
        { id: "4", label: "Menuju Lokasi", time: "09:50 WIB", completed: true },
        { id: "5", label: "Proses Pembersihan", time: "10:30 WIB", completed: true },
        { id: "6", label: "Selesai", time: "11:15 WIB", completed: true },
      ],
      locationLat: lat,
      locationLng: lng,
      addressTitle: "Jl. Menteng Raya No. 15",
      addressSubtitle: "Kecamatan Menteng, Jakarta Pusat, DKI Jakarta",
      kategoriUkuran: reportDb?.kategori_ukuran || "Sedang",
      status: reportDb?.status || "SELESAI",
    };

    return NextResponse.json({
      success: true,
      data: detailData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
