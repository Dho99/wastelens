import { describe, it, expect } from "vitest";
import { cleanAndParseJSON } from "@/server/integrations/ai/json-sanitizer";

describe("cleanAndParseJSON", () => {
  // -- clean JSON ------------------------------------------------------------

  it("parses a plain JSON object", () => {
    const result = cleanAndParseJSON<{ key: string }>('{"key":"value"}');
    expect(result).toEqual({ key: "value" });
  });

  it("parses JSON with nested objects and arrays", () => {
    const input = '{"name":"test","items":[1,2,3],"meta":{"ok":true}}';
    const result = cleanAndParseJSON<{
      name: string;
      items: number[];
      meta: { ok: boolean };
    }>(input);
    expect(result.name).toBe("test");
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.meta.ok).toBe(true);
  });

  // -- thinking tags ---------------------------------------------------------

  it("strips <think>...</think> tags before parsing", () => {
    const input =
      '<think>Let me analyze this image...</think>\n{"isWasteDetected":true}';
    const result = cleanAndParseJSON<{ isWasteDetected: boolean }>(input);
    expect(result).toEqual({ isWasteDetected: true });
  });

  it("strips thinking tags case-insensitively", () => {
    const input = '<THINK>reasoning</THINK>\n{"ok":true}';
    const result = cleanAndParseJSON<{ ok: boolean }>(input);
    expect(result).toEqual({ ok: true });
  });

  it("handles content before and after thinking tags", () => {
    const input =
      'Some text <think>internal</think> more text {"result":42} trailing';
    const result = cleanAndParseJSON<{ result: number }>(input);
    expect(result).toEqual({ result: 42 });
  });

  // -- markdown code blocks --------------------------------------------------

  it("strips ```json ... ``` fences", () => {
    const input = '```json\n{"type":"waste"}\n```';
    const result = cleanAndParseJSON<{ type: string }>(input);
    expect(result).toEqual({ type: "waste" });
  });

  it("strips ``` (no language) fences", () => {
    const input = '```\n{"type":"waste"}\n```';
    const result = cleanAndParseJSON<{ type: string }>(input);
    expect(result).toEqual({ type: "waste" });
  });

  it("handles whitespace around fences", () => {
    const input = '  ```json  \n  {"x": 1}  \n  ```  ';
    const result = cleanAndParseJSON<{ x: number }>(input);
    expect(result).toEqual({ x: 1 });
  });

  // -- brace extraction ------------------------------------------------------

  it("extracts JSON between first { and last }", () => {
    const input = 'prefix garbage {"key": [1, 2, {"nested": true}]} suffix';
    const result = cleanAndParseJSON<{ key: unknown[] }>(input);
    expect(result).toEqual({ key: [1, 2, { nested: true }] });
  });

  it("works with multiple objects in input — extracts the outermost", () => {
    const input = '{"a":1} extra {"b":2}';
    // firstBrace at 0, lastBrace at index of final } → extracts the whole string as one JSON
    // JSON.parse will fail because {"a":1} extra {"b":2} is not valid JSON
    // The function is designed for LLM output which wraps extras around valid JSON
    expect(() => cleanAndParseJSON(input)).toThrow();
  });

  // -- trailing comma removal ------------------------------------------------

  it("removes trailing commas in objects", () => {
    const input = '{"a": 1, "b": 2,}';
    const result = cleanAndParseJSON<{ a: number; b: number }>(input);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("removes trailing commas in arrays", () => {
    const input = '{"items": [1, 2, 3,]}';
    const result = cleanAndParseJSON<{ items: number[] }>(input);
    expect(result).toEqual({ items: [1, 2, 3] });
  });

  it("removes trailing commas in nested objects", () => {
    const input = '{"outer": {"inner": [1, 2,],},}';
    const result = cleanAndParseJSON<{ outer: { inner: number[] } }>(input);
    expect(result).toEqual({ outer: { inner: [1, 2] } });
  });

  // -- control character removal ---------------------------------------------

  it("strips control characters (U+0000–U+001F)", () => {
    const input = '{\u0000"key"\u0001:\u001F"value"\u001E}';
    const result = cleanAndParseJSON<{ key: string }>(input);
    expect(result).toEqual({ key: "value" });
  });

  // -- real-world LLM output patterns ----------------------------------------

  it("handles Gemini-style output: thinking tags + markdown fence + trailing comma", () => {
    const input =
      '<think>The image shows a large pile of trash on the roadside.</think>\n' +
      "```json\n" +
      "{\n" +
      '  "sizeCategory": "LARGE",\n' +
      '  "wasteTypes": ["plastic", "organic"],\n' +
      '  "drainageRisk": true,\n' +
      '  "confidence": 0.92,\n' +
      "}\n" +
      "```";
    const result = cleanAndParseJSON<{
      sizeCategory: string;
      wasteTypes: string[];
      drainageRisk: boolean;
      confidence: number;
    }>(input);
    expect(result.sizeCategory).toBe("LARGE");
    expect(result.wasteTypes).toEqual(["plastic", "organic"]);
    expect(result.drainageRisk).toBe(true);
    expect(result.confidence).toBe(0.92);
  });

  // -- invalid input ---------------------------------------------------------

  it("throws on completely invalid input", () => {
    expect(() => cleanAndParseJSON("not json at all")).toThrow();
  });

  it("throws on empty string", () => {
    expect(() => cleanAndParseJSON("")).toThrow();
  });
});
