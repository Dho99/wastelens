export function createReportCreatedEvent(data: { laporanId: string; status: string }) {
  return { type: "REPORT_CREATED", ...data };
}

export function createReportVerifiedEvent(data: { laporanId: string }) {
  return { type: "REPORT_VERIFIED", ...data };
}

export function createCoinRewardedEvent(data: { laporanId: string; jumlah: number }) {
  return { type: "COIN_REWARDED", ...data };
}
