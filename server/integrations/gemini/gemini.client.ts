import { GoogleGenAI } from "@google/genai";
import { geminiWasteAnalysisSchema } from "./gemini.schema";
import type { GeminiWasteResult } from "./gemini.types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a waste classification AI. Analyze the waste image and return ONLY valid JSON.

Return JSON with these exact fields:
{
  "sizeCategory": "SMALL" | "MEDIUM" | "LARGE" | "UNCERTAIN",
  "wasteTypes": ["ORGANIC" | "PLASTIC" | "PAPER" | "METAL" | "GLASS" | "TEXTILE" | "HAZARDOUS" | "MIXED" | "UNKNOWN"],
  "drainageRisk": boolean,
  "accessObstructionRisk": boolean,
  "visualIndicators": ["description1", "description2"],
  "confidence": number (0-1),
  "needsManualReview": boolean
}

Rules:
- SMALL = bag-sized pile. MEDIUM = cart-sized pile. LARGE = truckload pile.
- Do NOT estimate volume in liters or cubic meters.
- Do NOT estimate weight in kilograms.
- UNCERTAIN if image is blurry, dark, cropped, or lacks environmental context.
- Set confidence < 0.3 to trigger needsManualReview.
- If confidence below threshold, set needsManualReview: true.`;

async function imageUrlToBase64(imageUrl: string): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  return { data: buffer.toString("base64"), mimeType: contentType };
}

export async function analyzeWasteImage(
  imageInput: string,
  mimeType: string = "image/jpeg",
): Promise<GeminiWasteResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const isUrl = imageInput.startsWith("http");
  let rawData: string;
  let actualMime: string;

  if (isUrl) {
    const fetched = await imageUrlToBase64(imageInput);
    rawData = fetched.data;
    actualMime = fetched.mimeType;
  } else {
    rawData = imageInput.split(",")[1] ?? imageInput;
    actualMime = mimeType;
  }

  const interaction = await ai.interactions.create({
    model: GEMINI_MODEL,
    input: [
      { type: "text", text: SYSTEM_PROMPT },
      { type: "image", data: rawData, mime_type: actualMime },
    ],
  });

  const rawText = interaction.output_text ?? "";
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Gemini response did not contain valid JSON");
  }

  const parsed: unknown = JSON.parse(jsonMatch[0]);
  const validated = geminiWasteAnalysisSchema.parse(parsed);

  return {
    sizeCategory: validated.sizeCategory,
    wasteTypes: validated.wasteTypes,
    drainageRisk: validated.drainageRisk,
    accessObstructionRisk: validated.accessObstructionRisk,
    visualIndicators: validated.visualIndicators,
    confidence: validated.confidence,
    needsManualReview: validated.needsManualReview || validated.confidence < 0.3,
  };
}
