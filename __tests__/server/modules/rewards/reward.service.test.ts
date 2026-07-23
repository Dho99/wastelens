import { describe, it, expect } from "vitest";
import { REWARD_CONFIG } from "@/server/modules/rewards/reward.config";
import { calculateReward } from "@/server/modules/rewards/reward.service";
import type { RewardInput } from "@/server/modules/rewards/reward.types";

// ---------------------------------------------------------------------------
// REWARD_CONFIG — invariant tests
// ---------------------------------------------------------------------------

describe("REWARD_CONFIG", () => {
  it("base reward is positive", () => {
    expect(REWARD_CONFIG.baseReward).toBeGreaterThan(0);
  });

  it("size bonus monotonically increases: SMALL < MEDIUM < LARGE", () => {
    const { SMALL, MEDIUM, LARGE } = REWARD_CONFIG.sizeBonus;
    expect(SMALL).toBeLessThan(MEDIUM);
    expect(MEDIUM).toBeLessThan(LARGE);
  });

  it("UNCERTAIN size bonus is zero", () => {
    expect(REWARD_CONFIG.sizeBonus.UNCERTAIN).toBe(0);
  });

  it("drainage risk bonus > obstruction risk bonus (drainage is more critical)", () => {
    expect(REWARD_CONFIG.riskBonus.drainage).toBeGreaterThan(
      REWARD_CONFIG.riskBonus.obstruction,
    );
  });

  it("all config values are non-negative integers", () => {
    expect(Number.isInteger(REWARD_CONFIG.baseReward)).toBe(true);
    expect(REWARD_CONFIG.baseReward).toBeGreaterThanOrEqual(0);

    for (const value of Object.values(REWARD_CONFIG.sizeBonus)) {
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    }

    for (const value of Object.values(REWARD_CONFIG.riskBonus)) {
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  it("has the expected structural shape", () => {
    expect(REWARD_CONFIG).toHaveProperty("baseReward");
    expect(REWARD_CONFIG).toHaveProperty("sizeBonus");
    expect(REWARD_CONFIG).toHaveProperty("riskBonus");
  });
});

// ---------------------------------------------------------------------------
// calculateReward
// ---------------------------------------------------------------------------

function makeInput(overrides: Partial<RewardInput> = {}): RewardInput {
  return {
    sizeCategory: "SMALL",
    drainageRisk: false,
    accessObstructionRisk: false,
    ...overrides,
  };
}

describe("calculateReward", () => {
  // -- base reward -----------------------------------------------------------

  it("always returns at least the base reward", () => {
    // UNCERTAIN + no risks = minimum possible reward
    const result = calculateReward(makeInput({ sizeCategory: "UNCERTAIN" }));
    expect(result).toBe(REWARD_CONFIG.baseReward);
  });

  // -- size categories maintain ordering -------------------------------------

  it("reward increases with size category (no risks)", () => {
    const small = calculateReward(makeInput({ sizeCategory: "SMALL" }));
    const medium = calculateReward(makeInput({ sizeCategory: "MEDIUM" }));
    const large = calculateReward(makeInput({ sizeCategory: "LARGE" }));
    expect(small).toBeLessThan(medium);
    expect(medium).toBeLessThan(large);
  });

  it("unknown size category falls back to base reward only", () => {
    const result = calculateReward(
      makeInput({ sizeCategory: "UNKNOWN" as RewardInput["sizeCategory"] }),
    );
    expect(result).toBe(REWARD_CONFIG.baseReward);
  });

  // -- risk bonuses maintain ordering ----------------------------------------

  it("drainage risk adds more than access obstruction", () => {
    const base = calculateReward(makeInput());
    const drainage = calculateReward(
      makeInput({ drainageRisk: true }),
    );
    const obstruction = calculateReward(
      makeInput({ accessObstructionRisk: true }),
    );
    expect(drainage - base).toBeGreaterThan(obstruction - base);
  });

  it("both risks combined reward more than either alone", () => {
    const base = calculateReward(makeInput());
    const both = calculateReward(
      makeInput({ drainageRisk: true, accessObstructionRisk: true }),
    );
    const drainage = calculateReward(makeInput({ drainageRisk: true }));
    expect(both - base).toBeGreaterThan(drainage - base);
  });

  // -- full combinatorial coverage invariants --------------------------------

  it("always returns an integer", () => {
    const categories: RewardInput["sizeCategory"][] = [
      "SMALL",
      "MEDIUM",
      "LARGE",
      "UNCERTAIN",
    ];
    for (const cat of categories) {
      for (const dr of [false, true]) {
        for (const ao of [false, true]) {
          const result = calculateReward({
            sizeCategory: cat,
            drainageRisk: dr,
            accessObstructionRisk: ao,
          });
          expect(Number.isInteger(result)).toBe(true);
        }
      }
    }
  });

  it("never returns a negative reward", () => {
    const categories: RewardInput["sizeCategory"][] = [
      "SMALL",
      "MEDIUM",
      "LARGE",
      "UNCERTAIN",
    ];
    for (const cat of categories) {
      for (const dr of [false, true]) {
        for (const ao of [false, true]) {
          const result = calculateReward({
            sizeCategory: cat,
            drainageRisk: dr,
            accessObstructionRisk: ao,
          });
          expect(result).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  // -- combined scenario extremes --------------------------------------------

  it("maximum reward: LARGE + both risks", () => {
    const result = calculateReward(
      makeInput({
        sizeCategory: "LARGE",
        drainageRisk: true,
        accessObstructionRisk: true,
      }),
    );
    const minimum = calculateReward(
      makeInput({ sizeCategory: "UNCERTAIN" }),
    );
    expect(result).toBeGreaterThan(minimum);
    // Should be: base(10) + size(10) + drainage(10) + obstruction(5) = 35
    expect(result).toBe(35);
  });
});
