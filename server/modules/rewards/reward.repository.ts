import { prisma } from "@/lib/prisma";
import type { PrismaTransaction } from "@/lib/prisma-types";

export async function findExistingReward(
  laporanId: string,
  tx?: PrismaTransaction,
) {
  const client = tx ?? prisma;
  return client.transaksiKoin.findFirst({
    where: {
      laporan_id: laporanId,
      jenis: "kredit",
    },
  });
}

export async function createRewardTransaction(
  data: {
    user_id: string;
    laporan_id: string;
    jumlah: number;
  },
  tx?: PrismaTransaction,
) {
  const client = tx ?? prisma;
  return client.transaksiKoin.create({
    data: {
      ...data,
      jenis: "kredit",
    },
  });
}

export async function updateUserSaldoKoin(userId: string, jumlah: number, tx?: PrismaTransaction) {
  const client = tx ?? prisma;
  return client.user.update({
    where: { id: userId },
    data: { saldo_koin: { increment: jumlah } },
  });
}

export { persistNotification as createNotification } from "@/server/websocket/notify.service";
