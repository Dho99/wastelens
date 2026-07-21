import { nominatimResponseSchema } from "./nominatim.schema";
import type { NominatimAddress } from "./nominatim.types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "WasteLens/1.0";

function extractAddressFields(data: unknown): NominatimAddress {
  const parsed = nominatimResponseSchema.safeParse(data);
  if (!parsed.success) return emptyAddress();

  const { display_name, address } = parsed.data;
  if (!address) return emptyAddress();

  const district =
    address.city_district ??
    address.suburb ??
    address.neighbourhood ??
    null;

  const city =
    address.city ??
    address.town ??
    address.village ??
    null;

  return {
    addressText: display_name ?? null,
    roadName: address.road ?? null,
    district,
    city,
    province: address.state ?? null,
    country: address.country ?? null,
  };
}

function emptyAddress(): NominatimAddress {
  return {
    addressText: null,
    roadName: null,
    district: null,
    city: null,
    province: null,
    country: null,
  };
}

export async function reverseGeocodeNominatim(
  lat: number,
  lng: number,
): Promise<NominatimAddress | null> {
  const url = `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data: unknown = await res.json();
    return extractAddressFields(data);
  } catch {
    return null;
  }
}
