export type LocationVerificationInput = {
  browserLatitude: number;
  browserLongitude: number;
  accuracyMeters: number;
  exifLatitude: number | null;
  exifLongitude: number | null;
};

export type LocationVerificationResult = {
  distanceDifferenceMeters: number | null;
  riskFlags: string[];
};

export type LocationRiskFlag =
  | "LOW_ACCURACY"
  | "EXIF_LOCATION_MISMATCH"
  | "EXIF_UNAVAILABLE";
