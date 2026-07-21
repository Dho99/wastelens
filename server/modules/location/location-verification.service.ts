export function verifyLocation(options: {
  browserLatitude: number;
  browserLongitude: number;
  accuracyMeters: number;
  exifLatitude: number | null;
  exifLongitude: number | null;
}): { riskFlags: string[] } {
  return { riskFlags: [] };
}
