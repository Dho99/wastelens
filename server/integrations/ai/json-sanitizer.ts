export function cleanAndParseJSON<T>(rawString: string): T {
  let cleaned = rawString.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  cleaned = cleaned
    .replace(/,\s*}/g, "}")
    .replace(/,\s*\]/g, "]")
    .replace(/[\u0000-\u001F]/g, "")
    .trim();

  return JSON.parse(cleaned) as T;
}
