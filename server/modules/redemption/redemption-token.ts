import { randomBytes, createHash } from "crypto";
import { REDEMPTION_CONFIG } from "./redemption.config";
import type { GenerateTokenResult } from "./redemption.types";

export function generateRedemptionToken(): GenerateTokenResult {
  const rawToken = randomBytes(REDEMPTION_CONFIG.TOKEN_BYTE_LENGTH)
    .toString(REDEMPTION_CONFIG.TOKEN_ENCODING);

  const tokenHash = hashRedemptionToken(rawToken);

  const tokenHint = rawToken.slice(-REDEMPTION_CONFIG.TOKEN_HINT_LENGTH);

  return { rawToken, tokenHash, tokenHint };
}

export function hashRedemptionToken(rawToken: string): string {
  return createHash(REDEMPTION_CONFIG.TOKEN_HASH_ALGORITHM)
    .update(rawToken)
    .digest(REDEMPTION_CONFIG.TOKEN_HASH_ENCODING);
}

export function buildRedemptionQrPayload(rawToken: string): string {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${appUrl}/kopdes/redemptions/verify?token=${encodeURIComponent(rawToken)}`;
}

export function parseTokenFromQrUrl(input: string): string | null {
  try {
    const url = new URL(input);
    const token = url.searchParams.get("token") ?? url.searchParams.get("t");
    if (token && token.length > 0 && token.length <= REDEMPTION_CONFIG.MAX_TOKEN_LENGTH) {
      return token;
    }
    return null;
  } catch {
    return null;
  }
}
