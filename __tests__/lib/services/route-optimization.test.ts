import { describe, it, expect } from "vitest";
import { computeRouteScore } from "@/lib/services/route-optimization";

describe("computeRouteScore", () => {
  // -- basic behavior --------------------------------------------------------

  it("returns a number between -1 and 1", () => {
    const score = computeRouteScore(300, 50, 600, 100);
    expect(score).toBeGreaterThanOrEqual(-1);
    expect(score).toBeLessThanOrEqual(1);
  });

  // -- equal duration and priority → duration dominates (weight 0.65) -------

  it("favors shorter duration when priority is equal", () => {
    const fast = computeRouteScore(150, 50, 600, 100);
    const slow = computeRouteScore(450, 50, 600, 100);
    // Lower score = better route (shorter duration, higher priority)
    // fast: 0.65*(150/600) - 0.35*(50/100) = 0.1625 - 0.175 = -0.0125
    // slow: 0.65*(450/600) - 0.35*(50/100) = 0.4875 - 0.175 = 0.3125
    // fast has lower score → better
    expect(fast).toBeLessThan(slow);
  });

  // -- equal duration → higher priority is better ----------------------------

  it("favors higher priority when duration is equal", () => {
    const highPriority = computeRouteScore(300, 80, 600, 100);
    const lowPriority = computeRouteScore(300, 20, 600, 100);
    // high: 0.65*(300/600) - 0.35*(80/100) = 0.325 - 0.28 = 0.045
    // low:  0.65*(300/600) - 0.35*(20/100) = 0.325 - 0.07 = 0.255
    // high priority has lower score → better
    expect(highPriority).toBeLessThan(lowPriority);
  });

  // -- null priority treated as 0 --------------------------------------------

  it("treats null priority as 0", () => {
    const nullPriority = computeRouteScore(300, null, 600, 100);
    const zeroPriority = computeRouteScore(300, 0, 600, 100);
    expect(nullPriority).toBe(zeroPriority);
  });

  // -- edge cases: max values of 0 -------------------------------------------

  it("handles maxDuration = 0 (avoids division by zero)", () => {
    const score = computeRouteScore(300, 50, 0, 100);
    expect(Number.isFinite(score)).toBe(true);
    // normDuration = 0, so only the negative priority term contributes
    expect(score).toBeLessThanOrEqual(0);
  });

  it("handles maxPriority = 0 (avoids division by zero)", () => {
    const score = computeRouteScore(300, 50, 600, 0);
    expect(Number.isFinite(score)).toBe(true);
    // normPriority = 0, so only the duration term contributes
    expect(score).toBeGreaterThanOrEqual(0);
  });

  // -- both max values zero → score is 0 -------------------------------------

  it("returns 0 when both maxDuration and maxPriority are 0", () => {
    const score = computeRouteScore(300, 50, 0, 0);
    expect(score).toBe(0);
  });

  // -- zero duration, max priority → best possible score --------------------

  it("zero duration with max priority gives the lowest (best) score", () => {
    const best = computeRouteScore(0, 100, 600, 100);
    // 0.65*(0/600) - 0.35*(100/100) = 0 - 0.35 = -0.35
    expect(best).toBe(-0.35);
  });

  // -- max duration, zero priority → worst possible score -------------------

  it("max duration with zero priority gives the highest (worst) score", () => {
    const worst = computeRouteScore(600, 0, 600, 100);
    // 0.65*(600/600) - 0.35*(0/100) = 0.65 - 0 = 0.65
    expect(worst).toBe(0.65);
  });

  // -- custom weights --------------------------------------------------------

  it("respects custom distanceWeight and priorityWeight", () => {
    // With distanceWeight=1, priorityWeight=0 → only duration matters
    const durationOnly = computeRouteScore(300, 80, 600, 100, 1.0, 0.0);
    // 1.0*(300/600) - 0.0*(80/100) = 0.5
    expect(durationOnly).toBe(0.5);

    // With distanceWeight=0, priorityWeight=1 → only priority matters
    const priorityOnly = computeRouteScore(300, 80, 600, 100, 0.0, 1.0);
    // 0.0*(300/600) - 1.0*(80/100) = -0.8
    expect(priorityOnly).toBe(-0.8);
  });

  // -- symmetry: two identical tasks get identical scores --------------------

  it("identical inputs produce identical scores", () => {
    const a = computeRouteScore(200, 60, 500, 80, 0.65, 0.35);
    const b = computeRouteScore(200, 60, 500, 80, 0.65, 0.35);
    expect(a).toBe(b);
  });

  // -- monotonic: increasing duration never improves score -------------------

  it("increasing duration never improves (lowers) the score", () => {
    const base = computeRouteScore(100, 50, 600, 100);
    const longer = computeRouteScore(500, 50, 600, 100);
    expect(longer).toBeGreaterThan(base);
  });

  // -- monotonic: increasing priority always improves (lowers) the score ----

  it("increasing priority always improves (lowers) the score", () => {
    const base = computeRouteScore(300, 30, 600, 100);
    const higher = computeRouteScore(300, 70, 600, 100);
    expect(higher).toBeLessThan(base);
  });
});
