import { apiFetch } from "@/lib/api-client";
import type { CoinTxList, RedemptionList } from "../types/transactions";

export function getCoinTransactions(page: number) {
  return apiFetch<CoinTxList>(`/api/admin/transactions/coins?page=${page}&limit=10`);
}

export function getProductRedemptions(page: number) {
  return apiFetch<RedemptionList>(`/api/admin/transactions/products?page=${page}&limit=10`);
}
