export interface ClassificationResult {
  isWasteDetected: boolean;
  kategori_ukuran: "small" | "medium" | "large" | null;
  rekomendasi_kendaraan: "pickup" | "tossa" | "truck" | null;
  alasan_kendaraan: string | null;
  confidence: number;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a waste collection AI. Analyze this image of a roadside trash pile.

Return ONLY valid JSON with these fields:
{
  "isWasteDetected": boolean,
  "kategori_ukuran": "small" | "medium" | "large" | null,
  "rekomendasi_kendaraan": "pickup" | "tossa" | "truck" | null,
  "alasan_kendaraan": string | null,
  "confidence": number
}

Guidelines:
- small: bag-sized pile, <50L, narrow alley access → rekomendasi: "pickup"
- medium: cart-sized pile, 50-200L, standard road → rekomendasi: "tossa"
- large: truckload pile, >200L, wide road access → rekomendasi: "truck"
- Consider road width, accessibility, and pile density visible in image
- If no trash detected, set semua ke null
- confidence is 0-1 scale`;

export async function classifyWasteImage(
  base64Image: string,
  mimeType: string = "image/jpeg"
): Promise<ClassificationResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.9,
        topK: 16,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini response did not contain valid JSON");
  }

  const parsed: ClassificationResult = JSON.parse(jsonMatch[0]);

  return {
    isWasteDetected: parsed.isWasteDetected ?? false,
    kategori_ukuran: parsed.kategori_ukuran ?? null,
    rekomendasi_kendaraan: parsed.rekomendasi_kendaraan ?? null,
    alasan_kendaraan: parsed.alasan_kendaraan ?? null,
    confidence: parsed.confidence ?? 0,
  };
}
