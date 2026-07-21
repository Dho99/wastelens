export type RedemptionApiData = {
    id: string;
    status: "PENDING" | "REDEEMED" | "EXPIRED" | "CANCELLED";
    product: {
        name: string;
        quantity: number;
    } | null;
    koperasi: {
        name: string;
    } | null;
    quantity: number;
    unitCoinPrice: number;
    totalCoins: number;
    qrisData: string | null;
    createdAt: string;
    expiresAt: string;
    redeemedAt: string | null;
    cancelledAt: string | null;
    expiredAt: string | null;
};

type ApiSuccess<T> = {
    success: true;
    data: T;
};

type ApiErrorResponse = {
    success: false;
    error: string;
    code: string;
};

type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

export type QrRedemptionDetail = {
    id: string;
    merchantName: string;
    itemName: string;
    transactionId: string;
    quantity: number;
    totalCoins: number;
    status: RedemptionApiData["status"];
    qrisData: string | null;
    expiresAt: string;
    durationSeconds: number;
};

export async function fetchQrRedemptionDetail(
    redemptionId: string,
    signal?: AbortSignal,
): Promise<QrRedemptionDetail> {
    const response = await fetch(`/api/redemptions/${redemptionId}`, {
        method: "GET",
        cache: "no-store",
        signal,
    });

    const result =
        (await response.json()) as ApiResponse<RedemptionApiData>;

    if (!response.ok || !result.success) {
        const message =
            !result.success
                ? result.error
                : "Gagal mengambil detail penukaran";

        throw new Error(message);
    }

    const r = result.data;

    const remainingSeconds = Math.max(
        0,
        Math.floor(
            (new Date(r.expiresAt).getTime() - Date.now()) / 1000,
        ),
    );

    return {
        id: r.id,
        merchantName: r.koperasi?.name ?? "Koperasi",
        itemName: r.product?.name ?? "Produk",
        transactionId: r.id.slice(0, 8).toUpperCase(),
        quantity: r.quantity ?? 1,
        totalCoins: r.totalCoins,
        status: r.status,
        qrisData: r.qrisData,
        expiresAt: r.expiresAt,
        durationSeconds: remainingSeconds,
    };
}

export async function cancelRedemption(redemptionId: string): Promise<void> {
    const res = await fetch(`/api/redemptions/${redemptionId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal membatalkan penukaran");
    }
}
