import { reverseGeocodeNominatim } from "@/server/integrations/osm/nominatim.client";
import type { NominatimAddress } from "@/server/integrations/osm/nominatim.types";

const CACHE_TTL_MS = 60 * 60 * 1000;

const cache = new Map<string, { data: NominatimAddress; expiresAt: number }>();

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

function getCached(lat: number, lng: number): NominatimAddress | null {
  const key = cacheKey(lat, lng);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(lat: number, lng: number, data: NominatimAddress): void {
  const key = cacheKey(lat, lng);
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<NominatimAddress | null> {
  const cached = getCached(lat, lng);
  if (cached) return cached;

  const result = await reverseGeocodeNominatim(lat, lng);
  if (result) {
    setCache(lat, lng, result);
  }

  return result;
}
