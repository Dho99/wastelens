import Groq from "groq-sdk";
import { wasteAnalysisSchema } from "@/server/integrations/ai/waste-analysis.schema";
import type { WasteAnalysisResult } from "@/server/integrations/ai/waste-analysis.types";
import { cleanAndParseJSON } from "@/server/integrations/ai/json-sanitizer";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.2-11b-vision-preview";

const groq = new Groq({ apiKey: GROQ_API_KEY });

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

Respond with ONLY a raw JSON object. No markdown formatting, no code fences (like \`\`\`json), no explanatory text.`;

async function imageUrlToBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString("base64");
}

export async function analyzeWasteImageWithGroq(
    imageInput: string,
    mimeType: string = "image/jpeg",
): Promise<WasteAnalysisResult & { rawResponse: string }> {
    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    const isUrl = imageInput.startsWith("http");
    let imageContent: { type: "image_url"; image_url: { url: string } };

    if (isUrl) {
        imageContent = { type: "image_url", image_url: { url: imageInput } };
    } else {
        const rawData = imageInput.split(",")[1] ?? imageInput;
        const base64Data = rawData.startsWith("http")
            ? rawData
            : `data:${mimeType};base64,${rawData}`;
        imageContent = { type: "image_url", image_url: { url: base64Data } };
    }

    const buildMessages = () => [
        {
            role: "user" as const,
            content: [
                { type: "text" as const, text: SYSTEM_PROMPT },
                imageContent,
            ],
        },
    ];

    let response;
    try {
        response = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: buildMessages(),
            temperature: 0.1,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });
    } catch {
        console.warn(
            "[Groq] response_format=json_object rejected, retrying without it...",
        );
        response = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: buildMessages(),
            temperature: 0.1,
            max_tokens: 1024,
        });
    }

    console.log(
        "[Groq] Raw response:",
        response.choices?.[0]?.message?.content,
    );

    const rawText = response.choices?.[0]?.message?.content ?? "";

    let parsed: unknown;
    try {
        parsed = cleanAndParseJSON(rawText);
    } catch (parseError) {
        const message =
            parseError instanceof Error ? parseError.message : "Unknown error";
        console.error("[Groq] JSON parse error:", message);
        console.error("[Groq] Raw response:", rawText.slice(0, 500));
        throw new Error(`Groq response JSON parse error: ${message}`);
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
