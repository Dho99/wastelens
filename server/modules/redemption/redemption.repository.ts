import { prisma } from "@/lib/prisma";
import type { PrismaTransaction } from "@/lib/prisma-types";
import type { RedemptionStatus } from "@/lib/generated/prisma/client";

type Tx = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export async function findProductWithKopdes(productId: string, tx?: Tx) {
  const client = tx ?? prisma;
  return client.produk.findUnique({
    where: { id: productId },
    include: { kopdes: true },
  });
}

export async function findUser(userId: string, tx?: Tx) {
  const client = tx ?? prisma;
  return client.user.findUnique({ where: { id: userId } });
}

export async function decrementProductStock(
  productId: string,
  quantity: number,
  tx: Tx,
) {
  return tx.produk.updateMany({
    where: {
      id: productId,
      isActive: true,
      stok: { gte: quantity },
    },
    data: { stok: { decrement: quantity } },
  });
}

export async function decrementUserCoinBalance(
  userId: string,
  totalCoins: number,
  tx: Tx,
) {
  return tx.user.updateMany({
    where: {
      id: userId,
      status: "active",
      saldo_koin: { gte: totalCoins },
    },
    data: { saldo_koin: { decrement: totalCoins } },
  });
}

export async function incrementUserCoinBalance(
  userId: string,
  totalCoins: number,
  tx: Tx,
) {
  return tx.user.update({
    where: { id: userId },
    data: { saldo_koin: { increment: totalCoins } },
  });
}

export async function incrementProductStock(
  productId: string,
  quantity: number,
  tx: Tx,
) {
  return tx.produk.update({
    where: { id: productId },
    data: { stok: { increment: quantity } },
  });
}

export async function createRedemption(
  data: {
    userId: string;
    productId: string;
    kopdesId: string;
    quantity: number;
    unitCoinPrice: number;
    totalCoins: number;
    tokenHash: string;
    tokenHint: string;
    qrPayload: string;
    idempotencyKey: string;
    expiresAt: Date;
  },
  tx: Tx,
) {
  return tx.penukaran.create({
    data: {
      user_id: data.userId,
      produk_id: data.productId,
      kopdes_id: data.kopdesId,
      quantity: data.quantity,
      unit_coin_price: data.unitCoinPrice,
      jumlah_koin: data.totalCoins,
      token_hash: data.tokenHash,
      token_hint: data.tokenHint,
      qr_payload: data.qrPayload,
      idempotency_key: data.idempotencyKey,
      expires_at: data.expiresAt,
    },
  });
}

export async function findRedemptionById(id: string, tx?: Tx) {
  const client = tx ?? prisma;
  return client.penukaran.findUnique({
    where: { id },
    include: {
      produk: { select: { nama_barang: true } },
      kopdes: { select: { nama: true } },
    },
  });
}

export async function findRedemptionByTokenHash(tokenHash: string, tx?: Tx) {
  const client = tx ?? prisma;
  return client.penukaran.findUnique({
    where: { token_hash: tokenHash },
    include: {
      produk: { select: { id: true, nama_barang: true, kopdes_id: true } },
      user: { select: { id: true, name: true } },
    },
  });
}

export async function findExistingRedemptionByIdempotencyKey(
  userId: string,
  idempotencyKey: string,
  tx?: Tx,
) {
  const client = tx ?? prisma;
  return client.penukaran.findFirst({
    where: {
      user_id: userId,
      idempotency_key: idempotencyKey,
    },
    include: {
      produk: { select: { nama_barang: true } },
    },
  });
}

export async function updateRedemptionStatus(
  id: string,
  status: RedemptionStatus,
  extraData: Record<string, unknown> = {},
  tx: Tx,
) {
  return tx.penukaran.updateMany({
    where: { id, status: "PENDING" as RedemptionStatus },
    data: { status, ...extraData },
  });
}

export async function updateRedemptionToExpired(
  id: string,
  now: Date,
  tx: Tx,
) {
  return tx.penukaran.updateMany({
    where: { id, status: "PENDING" as RedemptionStatus },
    data: {
      status: "EXPIRED" as RedemptionStatus,
      expired_at: now,
    },
  });
}

export async function updateRedemptionToCancelled(
  id: string,
  now: Date,
  reason: string,
  tx: Tx,
) {
  return tx.penukaran.updateMany({
    where: { id, status: "PENDING" as RedemptionStatus },
    data: {
      status: "CANCELLED" as RedemptionStatus,
      cancelled_at: now,
      cancellation_reason: reason,
    },
  });
}

export async function updateRedemptionToRedeemed(
  id: string,
  now: Date,
  redeemedByUserId: string,
  tx: Tx,
) {
  return tx.penukaran.updateMany({
    where: { id, status: "PENDING" as RedemptionStatus },
    data: {
      status: "REDEEMED" as RedemptionStatus,
      redeemed_at: now,
      redeemed_by_user_id: redeemedByUserId,
    },
  });
}

export async function createCoinTransaction(
  data: {
    userId: string;
    redemptionId: string | null;
    type: "REWARD" | "REDEMPTION_RESERVE" | "REDEMPTION_REFUND" | "ADMIN_ADJUSTMENT";
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description: string | null;
  },
  tx: Tx,
) {
  return tx.coinTransaction.create({
    data: {
      user_id: data.userId,
      redemption_id: data.redemptionId,
      type: data.type,
      amount: data.amount,
      balance_before: data.balanceBefore,
      balance_after: data.balanceAfter,
      description: data.description,
    },
  });
}

export async function findUserCoinBalance(userId: string, tx?: Tx) {
  const client = tx ?? prisma;
  const user = await client.user.findUnique({
    where: { id: userId },
    select: { saldo_koin: true },
  });
  return user?.saldo_koin ?? 0;
}

export async function findPendingRedemptionByTokenHash(tokenHash: string, tx?: Tx) {
  const client = tx ?? prisma;
  return client.penukaran.findFirst({
    where: {
      token_hash: tokenHash,
      status: "PENDING" as RedemptionStatus,
    },
    include: {
      produk: { select: { id: true, nama_barang: true, kopdes_id: true } },
      user: { select: { id: true, name: true } },
    },
  });
}

export async function findExpiredPendingRedemptions(limit: number, tx?: Tx) {
  const client = tx ?? prisma;
  return client.penukaran.findMany({
    where: {
      status: "PENDING" as RedemptionStatus,
      expires_at: { lte: new Date() },
    },
    take: limit,
  });
}

export async function findRedemptionByTokenHashComplete(
  tokenHash: string,
  tx?: Tx,
) {
  const client = tx ?? prisma;
  return client.penukaran.findUnique({
    where: { token_hash: tokenHash },
    include: {
      produk: {
        select: {
          id: true,
          nama_barang: true,
          kopdes_id: true,
          stok: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          saldo_koin: true,
        },
      },
    },
  });
}
