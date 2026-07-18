import type { LocationVerificationInput, LocationVerificationResult } from "./location-verification.types";

const MAX_ACCURACY_METERS = 150;
const MAX_EXIF_DISTANCE_METERS = 500;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function verifyLocation(input: LocationVerificationInput): LocationVerificationResult {
  const flags: string[] = [];
  let distance: number | null = null;

  if (input.accuracyMeters > MAX_ACCURACY_METERS) {
    flags.push("LOW_ACCURACY");
  }

  if (input.exifLatitude !== null && input.exifLongitude !== null) {
    distance = haversineDistance(
      input.browserLatitude,
      input.browserLongitude,
      input.exifLatitude,
      input.exifLongitude,
    );
    if (distance > MAX_EXIF_DISTANCE_METERS) {
      flags.push("EXIF_LOCATION_MISMATCH");
    }
  } else {
    flags.push("EXIF_UNAVAILABLE");
  }

  return { distanceDifferenceMeters: distance, riskFlags: flags };
}
