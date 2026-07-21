import { z } from "zod";

export const sizeCategoryEnum = z.enum(["SMALL", "MEDIUM", "LARGE", "UNCERTAIN"]);
export const wasteTypeEnum = z.enum([
  "ORGANIC",
  "PLASTIC",
  "PAPER",
  "METAL",
  "GLASS",
  "TEXTILE",
  "HAZARDOUS",
  "MIXED",
  "UNKNOWN",
]);

export const wasteAnalysisSchema = z.object({
  sizeCategory: sizeCategoryEnum,
  wasteTypes: z.array(wasteTypeEnum).min(1),
  drainageRisk: z.boolean(),
  accessObstructionRisk: z.boolean(),
  visualIndicators: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  needsManualReview: z.boolean(),
});
