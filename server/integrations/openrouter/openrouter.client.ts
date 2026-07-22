import { OpenRouter } from "@openrouter/sdk";
import { wasteAnalysisSchema } from "@/server/integrations/ai/waste-analysis.schema";
import type { WasteAnalysisResult } from "@/server/integrations/ai/waste-analysis.types";
import { cleanAndParseJSON } from "@/server/integrations/ai/json-sanitizer";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
    process.env.OPENROUTER_MODEL ?? "openrouter/auto-beta";

const client = new OpenRouter({ apiKey: OPENROUTER_API_KEY ?? "" });

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
- If confidence below threshold, set needsManualReview: true.

Respond with ONLY a raw JSON object. No markdown formatting, no code fences, no explanatory text.`;

export async function analyzeWasteImageWithOpenRouter(
    imageInput: string,
    mimeType: string = "image/jpeg",
): Promise<WasteAnalysisResult & { rawResponse?: string }> {
    if (!OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const isUrl = imageInput.startsWith("http");
    let imageUrl: string;

    if (isUrl) {
        imageUrl = imageInput;
    } else {
        const rawData = imageInput.split(",")[1] ?? imageInput;
        imageUrl = rawData.startsWith("http")
            ? rawData
            : `data:${mimeType};base64,${rawData}`;
    }

    const completion = (await (client.chat.send as any)({
        chatRequest: {
            model: OPENROUTER_MODEL,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: SYSTEM_PROMPT },
                        { type: "image_url", imageUrl: { url: imageUrl } },
                    ],
                },
            ],
            temperature: 0.1,
            max_tokens: 1024,
        },
    })) as { choices?: Array<{ message?: { content?: string | null } }> };

    const rawText = completion.choices?.[0]?.message?.content ?? "";

    console.log("[OpenRouter] Raw response:", rawText);

    let parsed: unknown;
    try {
        parsed = cleanAndParseJSON(rawText);
    } catch (parseError) {
        const message =
            parseError instanceof Error ? parseError.message : "Unknown error";
        console.error("[OpenRouter] JSON parse error:", message);
        console.error("[OpenRouter] Raw response:", rawText.slice(0, 500));
        throw new Error(`OpenRouter response JSON parse error: ${message}`);
    }

    const validated = wasteAnalysisSchema.parse(parsed);

    return {
        rawResponse: rawText,
        sizeCategory: validated.sizeCategory,
        wasteTypes: validated.wasteTypes,
        drainageRisk: validated.drainageRisk,
        accessObstructionRisk: validated.accessObstructionRisk,
        visualIndicators: validated.visualIndicators,
        confidence: validated.confidence,
        needsManualReview:
            validated.needsManualReview || validated.confidence < 0.3,
    };
}
