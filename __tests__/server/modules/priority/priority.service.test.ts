import { describe, it, expect } from "vitest";
import {
  LOAD_UNIT_MAP,
  SIZE_SCORES,
  PRIORITY_WEIGHTS,
  calculatePriority,
} from "@/server/modules/priority/priority.service";
import type { PriorityInput } from "@/server/modules/priority/priority.types";

// ---------------------------------------------------------------------------
// LOAD_UNIT_MAP — invariant tests
// ---------------------------------------------------------------------------

describe("LOAD_UNIT_MAP", () => {
  it("monotonically increases: SMALL < MEDIUM < LARGE", () => {
    expect(LOAD_UNIT_MAP.SMALL!).toBeLessThan(LOAD_UNIT_MAP.MEDIUM!);
    expect(LOAD_UNIT_MAP.MEDIUM!).toBeLessThan(LOAD_UNIT_MAP.LARGE!);
  });

  it("UNCERTAIN is null (unknown load)", () => {
    expect(LOAD_UNIT_MAP.UNCERTAIN).toBeNull();
  });

  it("all non-null entries are positive integers", () => {
    for (const [key, value] of Object.entries(LOAD_UNIT_MAP)) {
      if (value !== null) {
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThan(0);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// SIZE_SCORES — invariant tests
// ---------------------------------------------------------------------------

describe("SIZE_SCORES", () => {
  it("monotonically increases: SMALL < MEDIUM < LARGE", () => {
    expect(SIZE_SCORES.SMALL).toBeLessThan(SIZE_SCORES.MEDIUM);
    expect(SIZE_SCORES.MEDIUM).toBeLessThan(SIZE_SCORES.LARGE);
  });

  it("UNCERTAIN is zero (contributes nothing)", () => {
    expect(SIZE_SCORES.UNCERTAIN).toBe(0);
  });

  it("all entries are non-negative", () => {
    for (const value of Object.values(SIZE_SCORES)) {
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });
});

// ---------------------------------------------------------------------------
// PRIORITY_WEIGHTS — invariant tests
// ---------------------------------------------------------------------------

describe("PRIORITY_WEIGHTS", () => {
  it("weights sum to exactly 1.0 (closed formula)", () => {
    const { wSize, wRisk, wRepeat, wAge } = PRIORITY_WEIGHTS;
    expect(wSize + wRisk + wRepeat + wAge).toBeCloseTo(1.0, 10);
  });

  it("ordering reflects priority: size > risk > repeat > age", () => {
    const { wSize, wRisk, wRepeat, wAge } = PRIORITY_WEIGHTS;
    expect(wSize).toBeGreaterThan(wRisk);
    expect(wRisk).toBeGreaterThan(wRepeat);
    expect(wRepeat).toBeGreaterThan(wAge);
  });

  it("has a version string", () => {
    expect(typeof PRIORITY_WEIGHTS.version).toBe("string");
    expect(PRIORITY_WEIGHTS.version.length).toBeGreaterThan(0);
  });

  it("all weights are between 0 and 1", () => {
    const { wSize, wRisk, wRepeat, wAge } = PRIORITY_WEIGHTS;
    for (const w of [wSize, wRisk, wRepeat, wAge]) {
      expect(w).toBeGreaterThan(0);
      expect(w).toBeLessThan(1);
    }
  });
});

// ---------------------------------------------------------------------------
// calculatePriority
// ---------------------------------------------------------------------------

function makeInput(overrides: Partial<PriorityInput> = {}): PriorityInput {
  return {
    sizeCategory: "SMALL",
    drainageRisk: false,
    accessObstructionRisk: false,
    repeatCount: 0,
    ...overrides,
  };
}

describe("calculatePriority", () => {
  // -- level thresholds ------------------------------------------------------

  it("returns CRITICAL when score >= 80", () => {
    const result = calculatePriority(
      makeInput({
        sizeCategory: "LARGE",
        drainageRisk: true,
        accessObstructionRisk: true,
        repeatCount: 10,
      }),
    );
    expect(result.level).toBe("CRITICAL");
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("returns HIGH when 60 <= score < 80", () => {
    const result = calculatePriority(
      makeInput({
        sizeCategory: "LARGE",
        drainageRisk: true,
        accessObstructionRisk: false,
        repeatCount: 4,
      }),
    );
    expect(result.level).toBe("HIGH");
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.score).toBeLessThan(80);
  });

  it("returns MEDIUM when 40 <= score < 60", () => {
    const result = calculatePriority(
      makeInput({
        sizeCategory: "MEDIUM",
        drainageRisk: true,
        accessObstructionRisk: false,
        repeatCount: 4,
      }),
    );
    expect(result.level).toBe("MEDIUM");
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.score).toBeLessThan(60);
  });

  it("returns LOW when score < 40", () => {
    const result = calculatePriority(makeInput());
    expect(result.level).toBe("LOW");
    expect(result.score).toBeLessThan(40);
  });

  // -- boundary values -------------------------------------------------------

  it("boundary: 79 → HIGH, 81 → CRITICAL", () => {
    const result79 = calculatePriority(
      makeInput({
        sizeCategory: "LARGE",
        drainageRisk: true,
        accessObstructionRisk: true,
        repeatCount: 9,
      }),
    );
    expect(result79.level).toBe("HIGH");

    const result81 = calculatePriority(
      makeInput({
        sizeCategory: "LARGE",
        drainageRisk: true,
        accessObstructionRisk: true,
        repeatCount: 10,
      }),
    );
    expect(result81.level).toBe("CRITICAL");
  });

  // -- risk contributions ----------------------------------------------------

  it("drainage contributes more than access obstruction", () => {
    const base = calculatePriority(makeInput());
    const drainage = calculatePriority(
      makeInput({ drainageRisk: true }),
    );
    const obstruction = calculatePriority(
      makeInput({ accessObstructionRisk: true }),
    );
    expect(drainage.score - base.score).toBeGreaterThan(
      obstruction.score - base.score,
    );
  });

  it("both risks combined contribute more than either alone", () => {
    const base = calculatePriority(makeInput());
    const both = calculatePriority(
      makeInput({
        drainageRisk: true,
        accessObstructionRisk: true,
      }),
    );
    const drainage = calculatePriority(
      makeInput({ drainageRisk: true }),
    );
    expect(both.score - base.score).toBeGreaterThan(
      drainage.score - base.score,
    );
  });

  // -- repeat count ----------------------------------------------------------

  it("repeat count caps at 100 (10 reports)", () => {
    const capped = calculatePriority(makeInput({ repeatCount: 10 }));
    const huge = calculatePriority(makeInput({ repeatCount: 999 }));
    expect(capped.score).toBe(huge.score);
  });

  it("repeat count is monotonic: more repeats never decrease score", () => {
    const zero = calculatePriority(makeInput({ repeatCount: 0 }));
    const one = calculatePriority(makeInput({ repeatCount: 1 }));
    const five = calculatePriority(makeInput({ repeatCount: 5 }));
    expect(zero.score).toBeLessThanOrEqual(one.score);
    expect(one.score).toBeLessThanOrEqual(five.score);
  });

  // -- size category monotonicity --------------------------------------------

  it("score increases with size category", () => {
    const small = calculatePriority(
      makeInput({ sizeCategory: "SMALL" }),
    );
    const medium = calculatePriority(
      makeInput({ sizeCategory: "MEDIUM" }),
    );
    const large = calculatePriority(
      makeInput({ sizeCategory: "LARGE" }),
    );
    expect(small.score).toBeLessThanOrEqual(medium.score);
    expect(medium.score).toBeLessThanOrEqual(large.score);
  });

  // -- estimated load unit ---------------------------------------------------

  it("estimatedLoadUnit monotonically increases with size", () => {
    const small = calculatePriority(
      makeInput({ sizeCategory: "SMALL" }),
    );
    const medium = calculatePriority(
      makeInput({ sizeCategory: "MEDIUM" }),
    );
    const large = calculatePriority(
      makeInput({ sizeCategory: "LARGE" }),
    );
    expect(small.estimatedLoadUnit!).toBeLessThan(medium.estimatedLoadUnit!);
    expect(medium.estimatedLoadUnit!).toBeLessThan(large.estimatedLoadUnit!);
  });

  it("unknown size yields null load unit", () => {
    const result = calculatePriority(
      makeInput({ sizeCategory: "UNKNOWN" as PriorityInput["sizeCategory"] }),
    );
    expect(result.estimatedLoadUnit).toBeNull();
  });

  // -- result invariants -----------------------------------------------------

  it("score is always an integer", () => {
    const result = calculatePriority(makeInput());
    expect(Number.isInteger(result.score)).toBe(true);
  });

  it("score is always between 0 and 100", () => {
    const categories = ["SMALL", "MEDIUM", "LARGE", "UNCERTAIN"] as const;
    const risks = [false, true];
    const repeats = [0, 3, 10];

    for (const cat of categories) {
      for (const dr of risks) {
        for (const ao of risks) {
          for (const rc of repeats) {
            const result = calculatePriority({
              sizeCategory: cat,
              drainageRisk: dr,
              accessObstructionRisk: ao,
              repeatCount: rc,
            });
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
          }
        }
      }
    }
  });

  it("unknown size defaults to score 0 → LOW", () => {
    const result = calculatePriority(
      makeInput({ sizeCategory: "UNKNOWN" as PriorityInput["sizeCategory"] }),
    );
    expect(result.score).toBe(0);
    expect(result.level).toBe("LOW");
  });
});
