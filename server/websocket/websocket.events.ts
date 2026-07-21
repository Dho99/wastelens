import type {
  PusherEvent,
  ReportCreatedPayload,
  ReportAssignedPayload,
  ReportStatusUpdatedPayload,
  ReportVerifiedPayload,
  CoinRewardedPayload,
} from "./websocket.types";
import { WS_EVENTS } from "./websocket.types";

function timestamp(): string {
  return new Date().toISOString();
}

export function createReportCreatedEvent(
  payload: ReportCreatedPayload,
): PusherEvent {
  return { type: WS_EVENTS.REPORT_CREATED, payload, timestamp: timestamp() };
}

export function createReportAssignedEvent(
  payload: ReportAssignedPayload,
): PusherEvent {
  return { type: WS_EVENTS.REPORT_ASSIGNED, payload, timestamp: timestamp() };
}

export function createReportStatusUpdatedEvent(
  payload: ReportStatusUpdatedPayload,
): PusherEvent {
  return {
    type: WS_EVENTS.REPORT_STATUS_UPDATED,
    payload,
    timestamp: timestamp(),
  };
}

export function createReportVerifiedEvent(
  payload: ReportVerifiedPayload,
): PusherEvent {
  return {
    type: WS_EVENTS.REPORT_VERIFIED,
    payload,
    timestamp: timestamp(),
  };
}

export function createCoinRewardedEvent(
  payload: CoinRewardedPayload,
): PusherEvent {
  return { type: WS_EVENTS.COIN_REWARDED, payload, timestamp: timestamp() };
}
