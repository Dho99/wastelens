export const WS_EVENTS = {
  REPORT_CREATED: "REPORT_CREATED",
  REPORT_ASSIGNED: "REPORT_ASSIGNED",
  REPORT_STATUS_UPDATED: "REPORT_STATUS_UPDATED",
  REPORT_VERIFIED: "REPORT_VERIFIED",
  COIN_REWARDED: "COIN_REWARDED",
} as const;

export type WsEventType = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];

export type ReportCreatedPayload = {
  laporanId: string;
  status: string;
};

export type ReportAssignedPayload = {
  laporanId: string;
  petugasId: string;
};

export type ReportStatusUpdatedPayload = {
  laporanId: string;
  status: string;
};

export type ReportVerifiedPayload = {
  laporanId: string;
};

export type CoinRewardedPayload = {
  laporanId: string;
  jumlah: number;
};

export type WsEventPayload =
  | ReportCreatedPayload
  | ReportAssignedPayload
  | ReportStatusUpdatedPayload
  | ReportVerifiedPayload
  | CoinRewardedPayload;

export type PusherEvent = {
  type: WsEventType;
  payload: WsEventPayload;
  timestamp: string;
};

export const PRIVATE_USER_CHANNEL = (userId: string) => `private-user-${userId}`;
