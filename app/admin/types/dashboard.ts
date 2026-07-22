export interface Summary {
  totalUsers: number;
  totalReports: number;
  totalCoinTx: number;
  totalRedemptions: number;
}

export interface WeeklyReportPoint {
  day: string;
  value: number;
}

export interface WasteDistributionItem {
  id: string;
  label: string;
  weightKg: number;
  percentage: number;
  color: string;
}

export interface DashboardFullData {
  summary: Summary;
  weeklyReports: WeeklyReportPoint[];
  wasteDistribution: WasteDistributionItem[];
}
