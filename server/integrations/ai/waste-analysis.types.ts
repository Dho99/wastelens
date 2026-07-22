export type WasteAnalysisResult = {
  sizeCategory: "SMALL" | "MEDIUM" | "LARGE" | "UNCERTAIN";
  wasteTypes: string[];
  drainageRisk: boolean;
  accessObstructionRisk: boolean;
  visualIndicators: string[];
  confidence: number;
  needsManualReview: boolean;
};
