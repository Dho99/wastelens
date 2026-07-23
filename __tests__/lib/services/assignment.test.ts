import { describe, it, expect } from "vitest";
import {
  LOAD_ESTIMATES_KG,
  fallbackVehicle,
  computeAssignedLoadKg,
} from "@/lib/services/assignment";

// ---------------------------------------------------------------------------
// LOAD_ESTIMATES_KG — invariant tests
// ---------------------------------------------------------------------------

describe("LOAD_ESTIMATES_KG", () => {
  it("monotonically increases: SMALL < MEDIUM < LARGE", () => {
    expect(LOAD_ESTIMATES_KG.SMALL).toBeLessThan(LOAD_ESTIMATES_KG.MEDIUM);
    expect(LOAD_ESTIMATES_KG.MEDIUM).toBeLessThan(LOAD_ESTIMATES_KG.LARGE);
  });

  it("Indonesian aliases equal English equivalents", () => {
    expect(LOAD_ESTIMATES_KG.KECIL).toBe(LOAD_ESTIMATES_KG.SMALL);
    expect(LOAD_ESTIMATES_KG.SEDANG).toBe(LOAD_ESTIMATES_KG.MEDIUM);
    expect(LOAD_ESTIMATES_KG.BESAR).toBe(LOAD_ESTIMATES_KG.LARGE);
  });

  it("UNCERTAIN is the minimum (zero)", () => {
    expect(LOAD_ESTIMATES_KG.UNCERTAIN).toBe(0);
    for (const key of ["SMALL", "MEDIUM", "LARGE"] as const) {
      expect(LOAD_ESTIMATES_KG.UNCERTAIN).toBeLessThan(
        LOAD_ESTIMATES_KG[key],
      );
    }
  });

  it("all defined categories are non-negative", () => {
    for (const value of Object.values(LOAD_ESTIMATES_KG)) {
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });
});

// ---------------------------------------------------------------------------
// computeAssignedLoadKg
// ---------------------------------------------------------------------------

describe("computeAssignedLoadKg", () => {
  it("case-insensitive: 'small', 'SMALL', 'Small' produce same result", () => {
    const lower = computeAssignedLoadKg("small");
    const upper = computeAssignedLoadKg("SMALL");
    const mixed = computeAssignedLoadKg("Small");
    expect(lower).toBe(upper);
    expect(upper).toBe(mixed);
  });

  it("Indonesian and English produce equal results", () => {
    expect(computeAssignedLoadKg("Kecil")).toBe(computeAssignedLoadKg("small"));
    expect(computeAssignedLoadKg("Sedang")).toBe(
      computeAssignedLoadKg("medium"),
    );
    expect(computeAssignedLoadKg("Besar")).toBe(computeAssignedLoadKg("large"));
  });

  it("monotonically increases: small < medium < large", () => {
    expect(computeAssignedLoadKg("small")).toBeLessThan(
      computeAssignedLoadKg("medium"),
    );
    expect(computeAssignedLoadKg("medium")).toBeLessThan(
      computeAssignedLoadKg("large"),
    );
  });

  it("unknown category returns 0 (never throws)", () => {
    expect(computeAssignedLoadKg("enormous")).toBe(0);
    expect(computeAssignedLoadKg("")).toBe(0);
  });

  it("always returns a non-negative integer", () => {
    const inputs = ["small", "MEDIUM", "Large", "BEsar", "unknown", ""];
    for (const input of inputs) {
      const result = computeAssignedLoadKg(input);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
    }
  });
});

// ---------------------------------------------------------------------------
// fallbackVehicle
// ---------------------------------------------------------------------------

describe("fallbackVehicle", () => {
  it("case-insensitive: 'small', 'SMALL', 'Small' produce same result", () => {
    expect(fallbackVehicle("small")).toBe(fallbackVehicle("SMALL"));
    expect(fallbackVehicle("SMALL")).toBe(fallbackVehicle("Small"));
  });

  it("size-to-vehicle mapping is capacity-ordered: pickup < tossa < truck", () => {
    // Vehicles carry increasing capacity: pickup(tiny) < tossa(medium) < truck(large)
    const vehicles = ["pickup", "tossa", "truck"];
    expect(vehicles.indexOf(fallbackVehicle("small"))).toBeLessThan(
      vehicles.indexOf(fallbackVehicle("medium")),
    );
    expect(vehicles.indexOf(fallbackVehicle("medium"))).toBeLessThan(
      vehicles.indexOf(fallbackVehicle("large")),
    );
  });

  it("always returns a known vehicle type", () => {
    const valid = new Set(["pickup", "tossa", "truck"]);
    const inputs = ["small", "MEDIUM", "Large", "random", ""];
    for (const input of inputs) {
      expect(valid.has(fallbackVehicle(input))).toBe(true);
    }
  });

  it("unknown categories default to the smallest vehicle ('pickup')", () => {
    // Defaulting to pickup is the safe choice — don't send a truck for junk
    expect(fallbackVehicle("unknown")).toBe("pickup");
    expect(fallbackVehicle("")).toBe("pickup");
  });
});
