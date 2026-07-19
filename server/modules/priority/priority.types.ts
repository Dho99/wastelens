export type PriorityInput = {
  sizeCategory: "SMALL" | "MEDIUM" | "LARGE" | "UNCERTAIN";
  drainageRisk: boolean;
  accessObstructionRisk: boolean;
  repeatCount: number;
};

export type PriorityResult = {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  weightVersion: string;
  estimatedLoadUnit: number | null;
};
