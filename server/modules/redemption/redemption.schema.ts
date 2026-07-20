import { z } from "zod/v4";
import { REDEMPTION_CONFIG } from "./redemption.config";

export const createRedemptionSchema = z.object({
  productId: z.string().min(1, "productId wajib diisi"),
  quantity: z
    .number()
    .int("Quantity harus bilangan bulat")
    .min(1, "Quantity minimal 1")
    .max(
      REDEMPTION_CONFIG.MAX_QUANTITY_PER_TRANSACTION,
      `Quantity maksimal ${REDEMPTION_CONFIG.MAX_QUANTITY_PER_TRANSACTION}`,
    ),
});

export const verifyRedemptionSchema = z.object({
  token: z
    .string()
    .min(1, "Token wajib diisi")
    .max(REDEMPTION_CONFIG.MAX_TOKEN_LENGTH, "Token terlalu panjang"),
});

export const confirmRedemptionSchema = z.object({
  token: z
    .string()
    .min(1, "Token wajib diisi")
    .max(REDEMPTION_CONFIG.MAX_TOKEN_LENGTH, "Token terlalu panjang"),
});
