import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { autoAssignDinas, assignKendaraan } from "@/lib/services/assignment";

const KOIN_PER_LAPORAN = 10;

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json();
    const { image, lat, lng, kategori_ukuran, rekomendasi_kendaraan, deskripsi } = body;

    if (!image || typeof lat !== "number" || typeof lng !== "number" || !kategori_ukuran) {
      return NextResponse.json(
        { error: "image, lat, lng, and kategori_ukuran are required", code: "VALIDATION" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const { dinas_id, petugas_id, kendaraan_id: _ } = await autoAssignDinas(lat, lng);

      const kendaraanResult = dinas_id
        ? await assignKendaraan(dinas_id, rekomendasi_kendaraan ?? null, kategori_ukuran)
        : { kendaraan_id: null, petugas_id: null };

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
          status: "PENDING",
        },
      });

      await tx.foto.create({
        data: {
          laporan_id: laporan.id,
          url: image,
        },
      });

      await tx.transaksiKoin.create({
        data: {
          user_id: userId,
          laporan_id: laporan.id,
          jumlah: KOIN_PER_LAPORAN,
          jenis: "kredit",
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { saldo_koin: { increment: KOIN_PER_LAPORAN } },
      });

      if (laporan.petugas_id) {
        await tx.notifikasi.create({
          data: {
            user_id: userId,
            laporan_id: laporan.id,
            pesan: `Laporan sampah baru di [${lat},${lng}]. Bawa ${rekomendasi_kendaraan ?? "kendaraan"}. Volume: ${kategori_ukuran}.`,
            status_baca: false,
          },
        });
      }

      return laporan;
    });

    return NextResponse.json(
      { id: result.id, status: result.status },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 }
    );
  }
}
