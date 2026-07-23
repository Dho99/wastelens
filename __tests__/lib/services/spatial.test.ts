import { describe, it, expect } from "vitest";
import { haversineDistance } from "@/lib/services/spatial";

describe("haversineDistance", () => {
  it("returns 0 for the same point", () => {
    expect(haversineDistance(0, 0, 0, 0)).toBe(0);
    expect(haversineDistance(-6.2088, 106.8456, -6.2088, 106.8456)).toBe(0);
  });

  it("returns roughly 0 for points extremely close together", () => {
    const dist = haversineDistance(-6.2, 106.8, -6.2000001, 106.8000001);
    expect(dist).toBeLessThan(20); // less than 20 meters
  });

  it("computes a known distance: Jakarta to Bandung (~115 km)", () => {
    const jakarta = { lat: -6.2088, lng: 106.8456 };
    const bandung = { lat: -6.9175, lng: 107.6191 };
    const dist = haversineDistance(
      jakarta.lat,
      jakarta.lng,
      bandung.lat,
      bandung.lng,
    );
    expect(dist).toBeGreaterThan(110_000);
    expect(dist).toBeLessThan(120_000);
  });

  it("returns roughly half the Earth's circumference for antipodal points", () => {
    const dist = haversineDistance(0, 0, 0, 180);
    // half circumference ≈ 20,037 km
    expect(dist).toBeGreaterThan(20_000_000);
    expect(dist).toBeLessThan(20_100_000);
  });

  it("is symmetric", () => {
    const a = { lat: 52.52, lng: 13.405 };
    const b = { lat: 48.8566, lng: 2.3522 };
    const ab = haversineDistance(a.lat, a.lng, b.lat, b.lng);
    const ba = haversineDistance(b.lat, b.lng, a.lat, a.lng);
    expect(ab).toBe(ba);
  });

  it("handles negative latitudes and longitudes", () => {
    // Buenos Aires (-34.6, -58.4) to Cape Town (-33.9, 18.4)
    const dist = haversineDistance(-34.6, -58.4, -33.9, 18.4);
    expect(dist).toBeGreaterThan(6_800_000);
    expect(dist).toBeLessThan(7_000_000);
  });
});
