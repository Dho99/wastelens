import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { grantVerificationReward } from "@/server/modules/rewards/reward.service";
import { triggerUserEvent } from "@/server/websocket/pusher.service";
import {
  createReportVerifiedEvent,
  createCoinRewardedEvent,
} from "@/server/websocket/websocket.events";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "petugas") {
      return NextResponse.json({ error: "Forbidden", code: "AUTH" }, { status: 403 });
    }

    const petugas = await prisma.petugas.findFirst({
      where: { user_id: session.user.id },
      select: { id: true, nama: true },
    });

    if (!petugas) {
      return NextResponse.json({ error: "Petugas not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const { foto_sesudah } = body;

    if (!foto_sesudah) {
      return NextResponse.json(
        { error: "foto_sesudah is required", code: "VALIDATION" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const laporan = await tx.laporan.findUnique({
        where: { id },
        include: {
          user: { select: { id: true } },
        },
      });

      if (!laporan) {
        throw { status: 404, code: "NOT_FOUND", message: "Laporan tidak ditemukan" };
      }

      if (laporan.petugas_id !== petugas.id) {
        throw { status: 403, code: "FORBIDDEN", message: "Tugas ini bukan untuk Anda" };
      }

      if (laporan.status === "SELESAI") {
        throw { status: 400, code: "ALREADY_DONE", message: "Tugas sudah selesai sebelumnya" };
      }

      await tx.verifikasiPickup.create({
        data: {
          laporan_id: id,
          foto_sebelum: laporan.foto_url,
          foto_sesudah,
          waktu: new Date(),
        },
      });

      await tx.laporan.update({
        where: { id },
        data: { status: "SELESAI" },
      });

      let rewardJumlah = 0;
      if (laporan.user_id) {
        const reward = await grantVerificationReward(id);
        rewardJumlah = reward.jumlah;

        await tx.notifikasi.create({
          data: {
            user_id: laporan.user_id,
            laporan_id: id,
            pesan: `Laporan sampah Anda telah selesai ditangani oleh ${petugas.nama}. Koin +${reward.jumlah} telah ditambahkan.`,
            status_baca: false,
          },
        });
      }

      return {
        status: "SELESAI",
        message: "Tugas selesai",
        rewardJumlah,
        userId: laporan.user_id,
      };
    });

    const userId = (result as any).userId as string | null;
    const rewardJumlah = (result as any).rewardJumlah as number;
    if (userId) {
      triggerUserEvent(
        userId,
        createReportVerifiedEvent({ laporanId: id }),
      );
      triggerUserEvent(
        userId,
        createCoinRewardedEvent({ laporanId: id, jumlah: rewardJumlah ?? 0 }),
      );
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error) {
      const e = error as { status: number; code: string; message: string };
      return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
