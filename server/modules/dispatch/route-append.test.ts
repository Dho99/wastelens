import { describe, it, expect } from "vitest";
import {
  ACTIVE_ROUTE_BLOCK_CODE,
  ACTIVE_ROUTE_BLOCK_MESSAGE,
  assertRouteAllowsAppend,
  findBestInsertion,
  isPriorityOrderValid,
  type InsertStop,
} from "./route-append.service";

function stop(
  id: string,
  lat: number,
  lng: number,
  priorityScore: number,
): InsertStop {
  return { reportId: id, lat, lng, priorityScore, estimatedLoadKg: 25 };
}

describe("assertRouteAllowsAppend", () => {
  it("allows DRAFT and CONFIRMED", () => {
    expect(() => assertRouteAllowsAppend("DRAFT")).not.toThrow();
    expect(() => assertRouteAllowsAppend("CONFIRMED")).not.toThrow();
  });

  it("blocks IN_PROGRESS with fixed message and keeps semantics of unassigned report", () => {
    try {
      assertRouteAllowsAppend("IN_PROGRESS");
      expect.unreachable("should throw");
    } catch (error) {
      const err = error as Error & { code: string; status: number };
      expect(err.message).toBe(ACTIVE_ROUTE_BLOCK_MESSAGE);
      expect(err.code).toBe(ACTIVE_ROUTE_BLOCK_CODE);
      expect(err.status).toBe(409);
    }
  });

  it("blocks COMPLETED", () => {
    expect(() => assertRouteAllowsAppend("COMPLETED")).toThrow(/COMPLETED/);
  });

  it("blocks CANCELLED", () => {
    expect(() => assertRouteAllowsAppend("CANCELLED")).toThrow(/CANCELLED/);
  });
});

describe("isPriorityOrderValid", () => {
  it("accepts non-increasing priority", () => {
    expect(
      isPriorityOrderValid([
        stop("a", 0, 0, 9),
        stop("b", 0, 0, 5),
        stop("c", 0, 0, 1),
      ]),
    ).toBe(true);
  });

  it("rejects increasing priority jump", () => {
    expect(
      isPriorityOrderValid([
        stop("a", 0, 0, 3),
        stop("b", 0, 0, 9),
      ]),
    ).toBe(false);
  });
});

describe("findBestInsertion", () => {
  it("does not always append at the end", () => {
    // existing A ---- C on a line; B is between them → insert index 1
    const existing = [
      stop("A", 0, 0, 10),
      stop("C", 0, 0.02, 5),
    ];
    const incoming = stop("B", 0, 0.01, 7);
    const result = findBestInsertion(existing, incoming);
    expect(result.insertionIndex).toBe(1);
    expect(result.orderedStops.map((s) => s.reportId)).toEqual(["A", "B", "C"]);
  });

  it("respects priority monotonicity when choosing index", () => {
    const existing = [
      stop("high", 0, 0, 10),
      stop("mid", 0, 0.02, 8),
    ];
    // low priority cannot go to front
    const incoming = stop("low", 0, 0.01, 1);
    const result = findBestInsertion(existing, incoming);
    expect(result.orderedStops.map((s) => s.reportId)).toEqual(["high", "mid", "low"]);
    expect(isPriorityOrderValid(result.orderedStops)).toBe(true);
  });

  it("returns only new stop when route empty", () => {
    const result = findBestInsertion([], stop("only", 1, 1, 5));
    expect(result.orderedStops).toHaveLength(1);
    expect(result.insertionIndex).toBe(0);
  });
});
