import type { RedemptionStatus, CoinTransactionType } from "@/lib/generated/prisma/client";

export interface GenerateTokenResult {
  rawToken: string;
  tokenHash: string;
  tokenHint: string;
}

export interface CreateRedemptionInput {
  userId: string;
  productId: string;
  quantity: number;
  idempotencyKey: string;
}

export interface CreateRedemptionResult {
  redemptionId: string;
  status: RedemptionStatus;
  product: {
    name: string;
    quantity: number;
  };
  unitCoinPrice: number;
  totalCoins: number;
  expiresAt: string;
  qrPayload: string;
}

export interface RedemptionDetail {
  id: string;
  status: RedemptionStatus;
  product: {
    name: string;
    quantity: number;
  };
  koperasi: {
    name: string;
  };
  quantity: number;
  unitCoinPrice: number;
  totalCoins: number;
  qrPayload: string | null;
  createdAt: string;
  expiresAt: string;
  redeemedAt: string | null;
  cancelledAt: string | null;
  expiredAt: string | null;
}

export interface VerifyResult {
  redemptionId: string;
  status: RedemptionStatus;
  product: {
    name: string;
    quantity: number;
  };
  totalCoins: number;
  user: {
    displayName: string;
  };
  createdAt: string;
  expiresAt: string;
}

export interface ConfirmResult {
  redemptionId: string;
  status: RedemptionStatus;
  redeemedAt: string;
}

export interface ExpireResult {
  redemptionId: string;
  refunded: boolean;
}

export interface ExpireBatchResult {
  expired: number;
}

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  code: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

export type RedemptionErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "ACCOUNT_INACTIVE"
  | "INVALID_REQUEST"
  | "INVALID_QUANTITY"
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_INACTIVE"
  | "COOPERATIVE_INACTIVE"
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_BALANCE"
  | "IDEMPOTENCY_KEY_REQUIRED"
  | "IDEMPOTENCY_CONFLICT"
  | "REDEMPTION_NOT_FOUND"
  | "QR_INVALID"
  | "QR_EXPIRED"
  | "QR_ALREADY_USED"
  | "QR_CANCELLED"
  | "QR_NOT_VALID_FOR_THIS_COOPERATIVE"
  | "REDEMPTION_CANNOT_BE_CANCELLED"
  | "TRANSACTION_CONFLICT"
  | "INTERNAL_ERROR";
