import { createHash } from "crypto";
import * as QR from "qrcode";

const QR_SECRET =
    process.env.QR_SECRET ?? "default-secret-change-in-production";

export interface RedemptionPayload {
    penukaran_id: string;
    user_id: string;
    produk_id: string;
    timestamp: number;
    signature: string;
}

export function generateRedemptionPayload(
    penukaranId: string,
    userId: string,
    produkId: string,
): RedemptionPayload {
    const timestamp = Date.now();
    const raw = `${penukaranId}:${userId}:${produkId}:${timestamp}:${QR_SECRET}`;
    const signature = createHash("sha256").update(raw).digest("hex");

    return {
        penukaran_id: penukaranId,
        user_id: userId,
        produk_id: produkId,
        timestamp,
        signature,
    };
}

export async function generateRedemptionQR(
    penukaranId: string,
    userId: string,
    produkId: string,
): Promise<string> {
    const payload = generateRedemptionPayload(penukaranId, userId, produkId);
    const qrDataUrl = await QR.toDataURL(JSON.stringify(payload), {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 300,
    });
    return qrDataUrl;
}

export function verifyRedemptionPayload(payload: RedemptionPayload): boolean {
    const raw = `${payload.penukaran_id}:${payload.user_id}:${payload.produk_id}:${payload.timestamp}:${QR_SECRET}`;
    const expectedSignature = createHash("sha256").update(raw).digest("hex");
    return payload.signature === expectedSignature;
}
