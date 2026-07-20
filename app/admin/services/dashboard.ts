import { apiFetch } from "@/lib/api-client";
import type { ListResult, User } from "../types/users";
import type { ReportList } from "../types/reports";
import type { CoinTxList, RedemptionList } from "../types/transactions";
import type { Summary } from "../types/dashboard";

export async function getDashboardSummary(): Promise<Summary> {
  const [users, reports, coins, redemptions] = await Promise.all([
    apiFetch<ListResult<User>>("/api/admin/users?limit=1"),
    apiFetch<ReportList>("/api/admin/reports?limit=1"),
    apiFetch<CoinTxList>("/api/admin/transactions/coins?limit=1"),
    apiFetch<RedemptionList>("/api/admin/transactions/products?limit=1"),
  ]);
  return {
    totalUsers: users.pagination.total,
    totalReports: reports.pagination.total,
    totalCoinTx: coins.pagination.total,
    totalRedemptions: redemptions.pagination.total,
  };
}
