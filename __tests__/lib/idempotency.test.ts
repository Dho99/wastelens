import { describe, it, expect } from "vitest";
import { isValidIdempotencyKey } from "@/lib/idempotency";

describe("isValidIdempotencyKey", () => {
  it("returns true for a valid v4 UUID", () => {
    expect(isValidIdempotencyKey("550e8400-e29b-41d4-a716-446655440000")).toBe(
      true,
    );
  });

  it("returns true for a valid v1 UUID", () => {
    expect(isValidIdempotencyKey("c726bec0-c974-11e8-a8d5-f2801f1b9fd1")).toBe(
      true,
    );
  });

  it("returns true for mixed-case UUID", () => {
    expect(isValidIdempotencyKey("550E8400-E29B-41D4-A716-446655440000")).toBe(
      true,
    );
  });

  it("returns false for null", () => {
    expect(isValidIdempotencyKey(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isValidIdempotencyKey(undefined as unknown as string | null)).toBe(
      false,
    );
  });

  it("returns false for an empty string", () => {
    expect(isValidIdempotencyKey("")).toBe(false);
  });

  it("returns false for a non-UUID string", () => {
    expect(isValidIdempotencyKey("not-a-uuid")).toBe(false);
  });

  it("returns false for a UUID with wrong version digit", () => {
    // version nibble must be 1-5 — here version '0' is invalid
    expect(isValidIdempotencyKey("550e8400-e29b-01d4-a716-446655440000")).toBe(
      false,
    );
  });

  it("returns false for a UUID with missing segments", () => {
    expect(isValidIdempotencyKey("550e8400-e29b-41d4-a716")).toBe(false);
  });

  it("returns false for a string with extra characters", () => {
    expect(
      isValidIdempotencyKey("550e8400-e29b-41d4-a716-446655440000-extra"),
    ).toBe(false);
  });
});
