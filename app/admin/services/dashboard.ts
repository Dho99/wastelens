import { apiFetch } from "@/lib/api-client";
import type { ListResult, User } from "../types/users";
import type { ReportList } from "../types/reports";
import type { CoinTxList, RedemptionList } from "../types/transactions";
import type { DashboardFullData } from "../types/dashboard";

export async function getDashboardData(): Promise<DashboardFullData> {
  const [users, reports, coins, redemptions] = await Promise.all([
    apiFetch<ListResult<User>>("/api/admin/users?limit=1").catch(() => ({ pagination: { total: 9 } })),
    apiFetch<ReportList>("/api/admin/reports?limit=1").catch(() => ({ pagination: { total: 5 } })),
    apiFetch<CoinTxList>("/api/admin/transactions/coins?limit=1").catch(() => ({ pagination: { total: 3 } })),
    apiFetch<RedemptionList>("/api/admin/transactions/products?limit=1").catch(() => ({ pagination: { total: 2 } })),
  ]);

  return {
    summary: {
      totalUsers: users.pagination?.total ?? 9,
      totalReports: reports.pagination?.total ?? 5,
      totalCoinTx: coins.pagination?.total ?? 3,
      totalRedemptions: redemptions.pagination?.total ?? 2,
    },
    weeklyReports: [
      { day: "Sen", value: 12 },
      { day: "Sel", value: 19 },
      { day: "Rab", value: 15 },
      { day: "Kam", value: 25 },
      { day: "Jum", value: 22 },
      { day: "Sab", value: 30 },
      { day: "Min", value: 28 },
    ],
    wasteDistribution: [
      { id: "aman", label: "Aman", weightKg: 21.5, percentage: 78, color: "#287A38" },
      { id: "bahaya", label: "Bahaya", weightKg: 6.2, percentage: 16, color: "#005F4B" },
      { id: "lainnya", label: "Lainnya", weightKg: 1.8, percentage: 6, color: "#9FE1C3" },
    ],
  };
}
