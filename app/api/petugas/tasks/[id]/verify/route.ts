import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { grantVerificationReward } from "@/server/modules/rewards/reward.service";
import { triggerUserEvent } from "@/server/websocket/pusher.service";
import {
  createReportVerifiedEvent,
  createCoinRewardedEvent,
} from "@/server/websocket/websocket.events";
import { LAPORAN_STATUS } from "@/lib/constants/laporan-status";

export async function POST(
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
        { status: 400 }
      );
    }

    try {
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

        if (laporan.status === LAPORAN_STATUS.SELESAI) {
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
          data: { status: LAPORAN_STATUS.SELESAI },
        });

        let rewardResult: {
          status: string;
          jumlah: number;
          breakdown: Record<string, unknown>;
          currentBalance: number;
        } = {
          status: "VERIFIED",
          jumlah: 0,
          breakdown: {},
          currentBalance: 0,
        };

        if (laporan.user_id) {
          rewardResult = await grantVerificationReward(id);

          await tx.notifikasi.create({
            data: {
              user_id: laporan.user_id,
              laporan_id: id,
              pesan: `Laporan sampah Anda telah selesai ditangani oleh ${petugas.nama}. Koin +${rewardResult.jumlah} telah ditambahkan.`,
              status_baca: false,
            },
          });
        }

        return {
          status: rewardResult.status,
          message: "Tugas selesai",
          rewardJumlah: rewardResult.jumlah,
          reward: {
            status: rewardResult.status,
            jumlah: rewardResult.jumlah,
            breakdown: rewardResult.breakdown,
            currentBalance: rewardResult.currentBalance,
          },
          userId: laporan.user_id,
        };
      });

      const userId = result.userId as string | null;
      const rewardJumlah = result.rewardJumlah as number;
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

      return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const existingReward = await prisma.transaksiKoin.findFirst({
          where: { laporan_id: id, jenis: "kredit" },
        });

        if (existingReward) {
          const user = await prisma.user.findUnique({
            where: { id: existingReward.user_id },
            select: { saldo_koin: true },
          });

          return NextResponse.json({
            status: "ALREADY_VERIFIED",
            message: "Reward sudah diberikan sebelumnya",
            rewardJumlah: existingReward.jumlah,
            reward: {
              status: "ALREADY_VERIFIED",
              jumlah: existingReward.jumlah,
              breakdown: existingReward.metadata,
              currentBalance: user?.saldo_koin ?? 0,
            },
          }, { status: 409 });
        }
      }

      if (error && typeof error === "object" && "status" in error) {
        const e = error as { status: number; code: string; message: string };
        return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
      }

      throw error;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
