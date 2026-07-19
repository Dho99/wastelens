import type { PriorityInput, PriorityResult } from "./priority.types";

export const LOAD_UNIT_MAP: Record<string, number | null> = {
  SMALL: 1,
  MEDIUM: 3,
  LARGE: 6,
  UNCERTAIN: null,
};

export const SIZE_SCORES: Record<string, number> = {
  SMALL: 25,
  MEDIUM: 50,
  LARGE: 100,
  UNCERTAIN: 0,
};

export const PRIORITY_WEIGHTS = {
  wSize: 0.4,
  wRisk: 0.3,
  wRepeat: 0.2,
  wAge: 0.1,
  version: "v1",
} as const;

function computeRiskScore(drainageRisk: boolean, accessObstructionRisk: boolean): number {
  let riskScore = 0;
  if (drainageRisk) riskScore += 40;
  if (accessObstructionRisk) riskScore += 30;
  return riskScore;
}

function computePriorityScore(components: {
  sizeScore: number;
  riskScore: number;
  repeatScore: number;
  ageScore: number;
}): number {
  const { wSize, wRisk, wRepeat, wAge } = PRIORITY_WEIGHTS;
  return (
    wSize * components.sizeScore +
    wRisk * components.riskScore +
    wRepeat * components.repeatScore +
    wAge * components.ageScore
  );
}

function computePriorityLevel(score: number): PriorityResult["level"] {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function calculatePriority(input: PriorityInput): PriorityResult {
  const sizeScore = SIZE_SCORES[input.sizeCategory] ?? 0;
  const riskScore = computeRiskScore(input.drainageRisk, input.accessObstructionRisk);
  const repeatScore = Math.min(input.repeatCount * 10, 100);
  const ageScore = 0;
  const score = computePriorityScore({ sizeScore, riskScore, repeatScore, ageScore });
  return {
    score: Math.round(score),
    level: computePriorityLevel(score),
    weightVersion: PRIORITY_WEIGHTS.version,
    estimatedLoadUnit: LOAD_UNIT_MAP[input.sizeCategory] ?? null,
  };
}
