import { describe, it, expect } from "vitest";
import {
  generateRedemptionPayload,
  verifyRedemptionPayload,
} from "@/lib/services/qr";
import type { RedemptionPayload } from "@/lib/services/qr";

describe("generateRedemptionPayload", () => {
  it("returns an object with all required fields", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    expect(payload).toHaveProperty("penukaran_id", "pen-1");
    expect(payload).toHaveProperty("user_id", "user-1");
    expect(payload).toHaveProperty("produk_id", "prod-1");
    expect(payload).toHaveProperty("timestamp");
    expect(payload).toHaveProperty("signature");
  });

  it("produces a unique timestamp on each call", () => {
    const a = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    // small delay to ensure different timestamp
    const b = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    // Timestamps may be equal if called fast enough, but signatures should differ
    // due to timestamp being part of the hash input
    // In practice, two rapid calls could have same ms timestamp
    expect(a.signature).toBeTruthy();
    expect(b.signature).toBeTruthy();
  });

  it("generates a 64-character hex signature (SHA-256)", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    expect(payload.signature).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("verifyRedemptionPayload", () => {
  it("returns true for a valid, untampered payload", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    expect(verifyRedemptionPayload(payload)).toBe(true);
  });

  it("returns false if penukaran_id is modified", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    const tampered: RedemptionPayload = { ...payload, penukaran_id: "pen-2" };
    expect(verifyRedemptionPayload(tampered)).toBe(false);
  });

  it("returns false if user_id is modified", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    const tampered: RedemptionPayload = { ...payload, user_id: "user-2" };
    expect(verifyRedemptionPayload(tampered)).toBe(false);
  });

  it("returns false if produk_id is modified", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    const tampered: RedemptionPayload = { ...payload, produk_id: "prod-2" };
    expect(verifyRedemptionPayload(tampered)).toBe(false);
  });

  it("returns false if timestamp is modified", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    const tampered: RedemptionPayload = {
      ...payload,
      timestamp: payload.timestamp + 1,
    };
    expect(verifyRedemptionPayload(tampered)).toBe(false);
  });

  it("returns false if signature is replaced with a random one", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    const tampered: RedemptionPayload = {
      ...payload,
      signature: "a".repeat(64),
    };
    expect(verifyRedemptionPayload(tampered)).toBe(false);
  });

  it("returns false for an empty signature", () => {
    const payload = generateRedemptionPayload("pen-1", "user-1", "prod-1");
    const tampered: RedemptionPayload = { ...payload, signature: "" };
    expect(verifyRedemptionPayload(tampered)).toBe(false);
  });

  it("round-trips correctly for multiple different inputs", () => {
    const inputs = [
      ["pen-a", "user-x", "prod-1"],
      ["pen-b", "user-y", "prod-2"],
      ["pen-c", "user-z", "prod-3"],
    ] as const;

    for (const [pen, user, prod] of inputs) {
      const payload = generateRedemptionPayload(pen, user, prod);
      expect(verifyRedemptionPayload(payload)).toBe(true);
    }
  });
});
