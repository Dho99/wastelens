export const LAPORAN_STATUS = {
  ANALYZED: "ANALYZED",
  WAITING: "WAITING",
  PENDING: "PENDING",
  DIJEMPUT: "DIJEMPUT",
  SELESAI: "SELESAI",
  DITOLAK: "DITOLAK",
} as const;

export type LaporanStatus = (typeof LAPORAN_STATUS)[keyof typeof LAPORAN_STATUS];
