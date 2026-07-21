import { analyzeWasteImage as analyzeWithGemini } from "@/server/integrations/gemini/gemini.client";
import { analyzeWasteImageWithGroq } from "@/server/integrations/groq/groq.client";
import type { WasteAnalysisResult } from "@/server/integrations/ai/waste-analysis.types";

export async function analyzeWasteImageWithFallback(
  imageUrl: string,
  mimeType: string,
): Promise<WasteAnalysisResult> {
  try {
    console.log("[AI Service] Trying Gemini...");
    const result = await analyzeWithGemini(imageUrl, mimeType);
    console.log("[AI Service] Gemini succeeded");
    return result;
  } catch (geminiError) {
    const geminiMessage = geminiError instanceof Error ? geminiError.message : "Unknown Gemini error";
    console.warn(`[AI Service] Gemini failed: ${geminiMessage}. Falling back to Groq...`);

    try {
      const result = await analyzeWasteImageWithGroq(imageUrl, mimeType);
      console.log("[AI Service] Groq fallback succeeded");
      return result;
    } catch (groqError) {
      const groqMessage = groqError instanceof Error ? groqError.message : "Unknown Groq error";
      console.error(`[AI Service] Groq also failed: ${groqMessage}`);
      throw new Error(
        `All AI services failed. Gemini: ${geminiMessage}. Groq: ${groqMessage}`,
      );
    }
  }
}
