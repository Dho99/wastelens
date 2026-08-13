import { prisma } from "@/lib/prisma";
import { REWARD_CONFIG } from "./reward.config";
import {
  findExistingReward,
  createRewardTransaction,
  updateUserSaldoKoin,
} from "./reward.repository";
import type { RewardInput, RewardResult } from "./reward.types";

export function calculateReward(input: RewardInput): number {
  const { baseReward, sizeBonus, riskBonus } = REWARD_CONFIG;
  const size = sizeBonus[input.sizeCategory as keyof typeof sizeBonus] ?? 0;
  const risk =
    (input.drainageRisk ? riskBonus.drainage : 0) +
    (input.accessObstructionRisk ? riskBonus.obstruction : 0);
  return baseReward + size + risk;
}

export async function grantVerificationReward(
  laporanId: string,
): Promise<RewardResult> {
  return prisma.$transaction(async (tx) => {
    const existing = await findExistingReward(laporanId, tx);
    if (existing) {
      return { jumlah: existing.jumlah };
    }

    const laporan = await tx.laporan.findUnique({
      where: { id: laporanId },
      select: {
        user_id: true,
        kategori_ukuran: true,
        drainage_risk: true,
        access_obstruction_risk: true,
      },
    });

    if (!laporan) {
      throw new Error("Laporan tidak ditemukan");
    }

    const jumlah = calculateReward({
      sizeCategory: laporan.kategori_ukuran,
      drainageRisk: laporan.drainage_risk ?? false,
      accessObstructionRisk: laporan.access_obstruction_risk ?? false,
    });

    await createRewardTransaction(
      {
        user_id: laporan.user_id,
        laporan_id: laporanId,
        jumlah,
      },
      tx,
    );

    await updateUserSaldoKoin(laporan.user_id, jumlah, tx);

    return { jumlah };
  });
}
