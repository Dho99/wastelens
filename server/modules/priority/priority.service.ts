export function calculatePriority(options: {
  sizeCategory: "SMALL" | "MEDIUM" | "LARGE" | "UNCERTAIN";
  drainageRisk: boolean;
  accessObstructionRisk: boolean;
  repeatCount: number;
}): { score: number; level: string; estimatedLoadUnit: number | null } {
  return { score: 0, level: "LOW", estimatedLoadUnit: null };
}
