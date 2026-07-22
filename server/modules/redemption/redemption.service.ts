import { prisma } from "@/lib/prisma";
import { REDEMPTION_CONFIG } from "./redemption.config";
import { RedemptionError } from "./redemption.errors";
import {
    generateRedemptionToken,
    hashRedemptionToken,
    buildRedemptionQrPayload,
    parseTokenFromQrUrl,
} from "./redemption-token";
import {
    findProductWithKopdes,
    decrementProductStock,
    decrementUserCoinBalance,
    incrementUserCoinBalance,
    incrementProductStock,
    createRedemption as createRedemptionRepo,
    findRedemptionById,
    findRedemptionByTokenHash,
    findExistingRedemptionByIdempotencyKey,
    updateRedemptionToRedeemed,
    updateRedemptionToCancelled,
    updateRedemptionToExpired,
    createCoinTransaction,
    findUserCoinBalance,
    findExpiredPendingRedemptions,
    findRedemptionByTokenHashComplete,
} from "./redemption.repository";
import type {
    CreateRedemptionInput,
    CreateRedemptionResult,
    RedemptionDetail,
    VerifyResult,
    ConfirmResult,
    ExpireResult,
    ExpireBatchResult,
} from "./redemption.types";
import type { PrismaTransaction } from "@/lib/prisma-types";

type Tx = Omit<
    typeof prisma,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

function maskDisplayName(name: string): string {
    if (name.length <= 1) return name;
    const first = name[0];
    const rest = name.slice(1).replace(/./g, "*");
    return first + rest;
}

async function handleLazyExpiration(redemption: {
    id: string;
    status: string;
    expires_at: Date;
    user_id: string;
    jumlah_koin: number;
    produk_id: string;
    quantity: number;
}): Promise<boolean> {
    if (
        redemption.status === "PENDING" &&
        new Date() > new Date(redemption.expires_at)
    ) {
        await expireRedemption(redemption.id);
        return true;
    }
    return false;
}

export async function createRedemption(
    input: CreateRedemptionInput,
): Promise<CreateRedemptionResult> {
    const { userId, productId, quantity, idempotencyKey } = input;
    const now = new Date();
    const expiresAt = new Date(
        now.getTime() + REDEMPTION_CONFIG.REDEMPTION_EXPIRY_MINUTES * 60 * 1000,
    );

    let lastError: Error | null = null;

    for (
        let attempt = 0;
        attempt < REDEMPTION_CONFIG.MAX_RETRY_ON_CONFLICT;
        attempt++
    ) {
        try {
            const result = await prisma.$transaction(async (tx) => {
                const existing = await findExistingRedemptionByIdempotencyKey(
                    userId,
                    idempotencyKey,
                    tx,
                );
                if (existing) {
                    const qrPayload = existing.qr_payload ?? buildRedemptionQrPayload(
                        existing.token_hint ?? "RESERVED",
                    );
                    return {
                        redemptionId: existing.id,
                        status: existing.status,
                        product: {
                            name: existing.produk.nama_barang,
                            quantity: existing.quantity,
                        },
                        unitCoinPrice: existing.unit_coin_price,
                        totalCoins: existing.jumlah_koin,
                        expiresAt: existing.expires_at.toISOString(),
                        qrPayload,
                    } as CreateRedemptionResult;
                }

                const produk = await findProductWithKopdes(productId, tx);
                if (!produk) {
                    throw new RedemptionError(
                        "Produk tidak ditemukan",
                        "PRODUCT_NOT_FOUND",
                        404,
                    );
                }
                if (!produk.isActive) {
                    throw new RedemptionError(
                        "Produk tidak aktif",
                        "PRODUCT_INACTIVE",
                    );
                }
                if (!produk.kopdes.isActive) {
                    throw new RedemptionError(
                        "Koperasi tidak aktif",
                        "COOPERATIVE_INACTIVE",
                    );
                }
                if (produk.stok < quantity) {
                    throw new RedemptionError(
                        "Stok produk tidak mencukupi",
                        "OUT_OF_STOCK",
                    );
                }

                const user = await tx.user.findUnique({
                    where: { id: userId },
                    select: { saldo_koin: true, status: true },
                });
                if (!user) {
                    throw new RedemptionError(
                        "Pengguna tidak ditemukan",
                        "FORBIDDEN",
                        404,
                    );
                }
                if (user.status !== "active") {
                    throw new RedemptionError(
                        "Akun pengguna tidak aktif",
                        "ACCOUNT_INACTIVE",
                    );
                }

                const unitCoinPrice = produk.harga_koin;
                const totalCoins = unitCoinPrice * quantity;

                if (user.saldo_koin < totalCoins) {
                    throw new RedemptionError(
                        "Saldo koin tidak mencukupi",
                        "INSUFFICIENT_BALANCE",
                    );
                }

                const stockUpdated = await decrementProductStock(
                    productId,
                    quantity,
                    tx,
                );
                if (stockUpdated.count !== 1) {
                    throw new RedemptionError(
                        "Stok produk tidak mencukupi",
                        "OUT_OF_STOCK",
                    );
                }

                const balanceBefore = user.saldo_koin;
                const balanceUpdated = await decrementUserCoinBalance(
                    userId,
                    totalCoins,
                    tx,
                );
                if (balanceUpdated.count !== 1) {
                    await incrementProductStock(productId, quantity, tx);
                    throw new RedemptionError(
                        "Saldo koin tidak mencukupi",
                        "INSUFFICIENT_BALANCE",
                    );
                }

                const { rawToken, tokenHash, tokenHint } =
                    generateRedemptionToken();

                const qrPayload = buildRedemptionQrPayload(rawToken);

                const redemption = await createRedemptionRepo(
                    {
                        userId,
                        productId,
                        kopdesId: produk.kopdes_id,
                        quantity,
                        unitCoinPrice,
                        totalCoins,
                        tokenHash,
                        tokenHint,
                        qrPayload,
                        idempotencyKey,
                        expiresAt,
                    },
                    tx,
                );

                await createCoinTransaction(
                    {
                        userId,
                        redemptionId: redemption.id,
                        type: "REDEMPTION_RESERVE",
                        amount: totalCoins,
                        balanceBefore,
                        balanceAfter: balanceBefore - totalCoins,
                        description: `Reservasi ${quantity}x ${produk.nama_barang}`,
                    },
                    tx,
                );

                return {
                    redemptionId: redemption.id,
                    status: redemption.status,
                    product: {
                        name: produk.nama_barang,
                        quantity,
                    },
                    unitCoinPrice,
                    totalCoins,
                    expiresAt: expiresAt.toISOString(),
                    qrPayload,
                } as CreateRedemptionResult;
            });

            return result;
        } catch (error) {
            if (error instanceof RedemptionError) {
                throw error;
            }
            lastError =
                error instanceof Error ? error : new Error(String(error));
        }
    }

    throw new RedemptionError(
        `Transaksi gagal setelah ${REDEMPTION_CONFIG.MAX_RETRY_ON_CONFLICT} percobaan: ${lastError?.message}`,
        "TRANSACTION_CONFLICT",
        409,
    );
}

export async function getRedemptionDetail(
    redemptionId: string,
    userId: string,
    role: string,
): Promise<RedemptionDetail> {
    const redemption = await findRedemptionById(redemptionId);

    if (!redemption) {
        throw new RedemptionError(
            "Penukaran tidak ditemukan",
            "REDEMPTION_NOT_FOUND",
            404,
        );
    }

    if (role !== "admin" && redemption.user_id !== userId) {
        throw new RedemptionError("Akses ditolak", "FORBIDDEN", 403);
    }

    const wasExpired = await handleLazyExpiration(redemption);

    const refreshed = wasExpired
        ? await findRedemptionById(redemptionId)
        : redemption;

    if (!refreshed) {
        throw new RedemptionError(
            "Penukaran tidak ditemukan",
            "REDEMPTION_NOT_FOUND",
            404,
        );
    }

    console.log("[Refreshed Redemption]", refreshed);

    return {
        id: refreshed.id,
        status: refreshed.status,
        product: {
            name: refreshed.produk.nama_barang,
            quantity: refreshed.quantity,
        },
        koperasi: {
            name: refreshed.kopdes.nama,
        },
        quantity: refreshed.quantity,
        unitCoinPrice: refreshed.unit_coin_price,
        totalCoins: refreshed.jumlah_koin,
        qrPayload: refreshed.qr_payload ?? null,
        createdAt: refreshed.createdAt.toISOString(),
        expiresAt: refreshed.expires_at.toISOString(),
        redeemedAt: refreshed.redeemed_at?.toISOString() ?? null,
        cancelledAt: refreshed.cancelled_at?.toISOString() ?? null,
        expiredAt: refreshed.expired_at?.toISOString() ?? null,
    };
}

export async function cancelRedemption(
    redemptionId: string,
    userId: string,
    reason: string = "Dibatalkan oleh pengguna",
): Promise<void> {
    await prisma.$transaction(async (tx) => {
        const redemption = await tx.penukaran.findUnique({
            where: { id: redemptionId },
        });

        if (!redemption) {
            throw new RedemptionError(
                "Penukaran tidak ditemukan",
                "REDEMPTION_NOT_FOUND",
                404,
            );
        }

        if (redemption.user_id !== userId) {
            throw new RedemptionError("Akses ditolak", "FORBIDDEN", 403);
        }

        if (redemption.status !== "PENDING") {
            throw new RedemptionError(
                `Penukaran tidak dapat dibatalkan (status: ${redemption.status})`,
                "REDEMPTION_CANNOT_BE_CANCELLED",
            );
        }

        if (new Date() > new Date(redemption.expires_at)) {
            await updateRedemptionToExpired(redemptionId, new Date(), tx);
            await refundCoinsAndStock(redemption, tx);
            throw new RedemptionError(
                "Penukaran sudah kedaluwarsa",
                "QR_EXPIRED",
            );
        }

        const now = new Date();
        const updated = await updateRedemptionToCancelled(
            redemptionId,
            now,
            reason,
            tx,
        );

        if (updated.count !== 1) {
            throw new RedemptionError(
                "Penukaran gagal dibatalkan",
                "REDEMPTION_CANNOT_BE_CANCELLED",
            );
        }

        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { saldo_koin: true },
        });
        const balanceBefore = user?.saldo_koin ?? 0;

        await refundCoinsAndStock(redemption, tx);

        await createCoinTransaction(
            {
                userId,
                redemptionId,
                type: "REDEMPTION_REFUND",
                amount: redemption.jumlah_koin,
                balanceBefore,
                balanceAfter: balanceBefore + redemption.jumlah_koin,
                description: `Pembatalan: ${redemption.quantity}x refund`,
            },
            tx,
        );
    });
}

export async function verifyRedemptionToken(
    rawToken: string,
    kopdesUserId: string,
): Promise<VerifyResult> {
    const maybeRaw = parseTokenFromQrUrl(rawToken) ?? rawToken;

    const tokenHash = hashRedemptionToken(maybeRaw);

    const redemption = await findRedemptionByTokenHash(tokenHash);
    if (!redemption) {
        throw new RedemptionError("QR tidak valid", "QR_INVALID", 404);
    }

    if (redemption.status === "REDEEMED") {
        throw new RedemptionError("QR sudah digunakan", "QR_ALREADY_USED");
    }

    if (redemption.status === "CANCELLED") {
        throw new RedemptionError("QR sudah dibatalkan", "QR_CANCELLED");
    }

    if (redemption.status === "EXPIRED") {
        throw new RedemptionError("QR sudah kedaluwarsa", "QR_EXPIRED");
    }

    if (new Date() > new Date(redemption.expires_at)) {
        await expireRedemption(redemption.id);
        throw new RedemptionError("QR sudah kedaluwarsa", "QR_EXPIRED");
    }

    const kopdes = await prisma.kopdes.findFirst({
        where: { user_id: kopdesUserId },
        select: { id: true },
    });
    if (!kopdes) {
        throw new RedemptionError(
            "Koperasi tidak ditemukan",
            "REDEMPTION_NOT_FOUND",
            404,
        );
    }

    if (redemption.produk.kopdes_id !== kopdes.id) {
        throw new RedemptionError(
            "QR tidak valid untuk koperasi ini",
            "QR_NOT_VALID_FOR_THIS_COOPERATIVE",
        );
    }

    return {
        redemptionId: redemption.id,
        status: redemption.status,
        product: {
            name: redemption.produk.nama_barang,
            quantity: redemption.quantity,
        },
        totalCoins: redemption.jumlah_koin,
        user: {
            displayName: maskDisplayName(redemption.user.name),
        },
        createdAt: redemption.createdAt.toISOString(),
        expiresAt: redemption.expires_at.toISOString(),
    };
}

export async function confirmRedemption(
    rawToken: string,
    kopdesUserId: string,
    idempotencyKey: string,
): Promise<ConfirmResult> {
    const maybeRaw = parseTokenFromQrUrl(rawToken) ?? rawToken;
    const tokenHash = hashRedemptionToken(maybeRaw);
    const now = new Date();

    for (
        let attempt = 0;
        attempt < REDEMPTION_CONFIG.MAX_RETRY_ON_CONFLICT;
        attempt++
    ) {
        try {
            const result = await prisma.$transaction(async (tx) => {
                const copiedTx = tx as unknown as Tx;
                const redemption = await findRedemptionByTokenHashComplete(
                    tokenHash,
                    copiedTx,
                );
                if (!redemption) {
                    throw new RedemptionError(
                        "QR tidak valid",
                        "QR_INVALID",
                        404,
                    );
                }

                if (redemption.status === "REDEEMED") {
                    throw new RedemptionError(
                        "QR sudah digunakan",
                        "QR_ALREADY_USED",
                    );
                }

                if (redemption.status === "CANCELLED") {
                    throw new RedemptionError(
                        "QR sudah dibatalkan",
                        "QR_CANCELLED",
                    );
                }

                if (redemption.status === "EXPIRED") {
                    throw new RedemptionError(
                        "QR sudah kedaluwarsa",
                        "QR_EXPIRED",
                    );
                }

                if (now > new Date(redemption.expires_at)) {
                    await expireRedemption(redemption.id);
                    throw new RedemptionError(
                        "QR sudah kedaluwarsa",
                        "QR_EXPIRED",
                    );
                }

                const kopdes = await tx.kopdes.findFirst({
                    where: { user_id: kopdesUserId },
                    select: { id: true },
                });
                if (!kopdes) {
                    throw new RedemptionError(
                        "Koperasi tidak ditemukan",
                        "REDEMPTION_NOT_FOUND",
                        404,
                    );
                }

                if (redemption.produk.kopdes_id !== kopdes.id) {
                    throw new RedemptionError(
                        "QR tidak valid untuk koperasi ini",
                        "QR_NOT_VALID_FOR_THIS_COOPERATIVE",
                    );
                }

                const updated = await updateRedemptionToRedeemed(
                    redemption.id,
                    now,
                    kopdesUserId,
                    copiedTx,
                );

                if (updated.count !== 1) {
                    throw new RedemptionError(
                        "QR sudah digunakan",
                        "QR_ALREADY_USED",
                        409,
                    );
                }

                return {
                    redemptionId: redemption.id,
                    status: "REDEEMED" as const,
                    redeemedAt: now.toISOString(),
                };
            });

            return result;
        } catch (error) {
            if (error instanceof RedemptionError) {
                throw error;
            }
            if (
                attempt < REDEMPTION_CONFIG.MAX_RETRY_ON_CONFLICT - 1 &&
                error instanceof Error &&
                error.message.includes("Could not serialize access")
            ) {
                continue;
            }
            throw error;
        }
    }

    throw new RedemptionError(
        "Konfirmasi gagal, silakan coba lagi",
        "TRANSACTION_CONFLICT",
        409,
    );
}

export async function expireRedemption(
    redemptionId: string,
): Promise<ExpireResult> {
    return prisma.$transaction(async (tx) => {
        const copiedTx = tx as unknown as Tx;
        const redemption = await copiedTx.penukaran.findUnique({
            where: { id: redemptionId },
        });

        if (!redemption) {
            return { redemptionId, refunded: false };
        }

        if (redemption.status !== "PENDING") {
            return { redemptionId, refunded: false };
        }

        const now = new Date();
        const updated = await updateRedemptionToExpired(
            redemptionId,
            now,
            copiedTx,
        );

        if (updated.count !== 1) {
            return { redemptionId, refunded: false };
        }

        await refundCoinsAndStock(redemption, copiedTx);

        const user = await copiedTx.user.findUnique({
            where: { id: redemption.user_id },
            select: { saldo_koin: true },
        });
        const balanceBefore = user?.saldo_koin ?? 0;

        await createCoinTransaction(
            {
                userId: redemption.user_id,
                redemptionId,
                type: "REDEMPTION_REFUND",
                amount: redemption.jumlah_koin,
                balanceBefore,
                balanceAfter: balanceBefore + redemption.jumlah_koin,
                description: `Kedaluwarsa: refund ${redemption.quantity}x otomatis`,
            },
            copiedTx,
        );

        return { redemptionId, refunded: true };
    });
}

export async function expirePendingRedemptions(
    limit: number = 50,
): Promise<ExpireBatchResult> {
    const redemptions = await findExpiredPendingRedemptions(limit);
    let expired = 0;

    for (const redemption of redemptions) {
        try {
            const result = await expireRedemption(redemption.id);
            if (result.refunded) expired++;
        } catch {
            continue;
        }
    }

    return { expired };
}

async function refundCoinsAndStock(
    redemption: {
        user_id: string;
        jumlah_koin: number;
        produk_id: string;
        quantity: number;
    },
    tx: Tx,
): Promise<void> {
    await incrementUserCoinBalance(
        redemption.user_id,
        redemption.jumlah_koin,
        tx,
    );
    await incrementProductStock(redemption.produk_id, redemption.quantity, tx);
}
