import { analyzeWasteImage as analyzeWithGemini } from "@/server/integrations/gemini/gemini.client";
import { analyzeWasteImageWithGroq } from "@/server/integrations/groq/groq.client";
import { analyzeWasteImageWithOpenRouter } from "@/server/integrations/openrouter/openrouter.client";
import type { WasteAnalysisResult } from "@/server/integrations/ai/waste-analysis.types";

type ProviderResult = WasteAnalysisResult & { rawResponse?: string };

interface Provider {
    name: string;
    fn: (imageUrl: string, mimeType: string) => Promise<ProviderResult>;
}

const PROVIDERS: Provider[] = [
    { name: "Groq", fn: analyzeWasteImageWithGroq },
    { name: "Gemini", fn: analyzeWithGemini },
    { name: "OpenRouter", fn: analyzeWasteImageWithOpenRouter },
];

function getErrorStatus(error: unknown): number | null {
    if (error && typeof error === "object") {
        if ("status" in error && typeof (error as any).status === "number") {
            return (error as any).status;
        }
        const message =
            error instanceof Error ? error.message.toLowerCase() : "";
        if (message.includes("429") || message.includes("too many requests")) {
            return 429;
        }
        if (message.includes("503") || message.includes("unavailable")) {
            return 503;
        }
    }
    return null;
}

export async function analyzeWasteImageWithFallback(
    imageUrl: string,
    mimeType: string,
): Promise<ProviderResult> {
    const errors: string[] = [];

    for (const provider of PROVIDERS) {
        try {
            console.log(`[AI Service] Trying ${provider.name}...`);
            const result = await provider.fn(imageUrl, mimeType);

            if (result && result.sizeCategory) {
                console.log(
                    `[AI Service] ${provider.name} succeeded! Returning result immediately.`,
                );
                return result;
            }

            console.warn(
                `[AI Service] ${provider.name} returned incomplete result, falling through...`,
            );
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown error";
            const status = getErrorStatus(err);
            const statusInfo = status ? ` (${status})` : "";
            console.warn(
                `[AI Service] ${provider.name} failed${statusInfo}: ${message}`,
            );
            errors.push(`${provider.name}: ${message}`);
        }
    }

    throw new Error(
        "All AI providers failed to generate a valid classification.",
    );
}
