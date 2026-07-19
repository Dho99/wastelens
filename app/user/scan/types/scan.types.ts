export type ScanStep = "IDLE" | "PHOTO_SELECTED" | "LOCATION_REQUEST" | "READY_TO_SUBMIT" | "UPLOADING" | "ANALYZING" | "SUCCESS" | "ERROR";

export type DeviceLocation = {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  capturedAt: string;
};

export type ConfirmedLocation = {
  latitude: number;
  longitude: number;
};

export type ScanLocationPayload = {
  source: "BROWSER_GEOLOCATION";
  device: DeviceLocation;
  confirmed: ConfirmedLocation;
  exif: { latitude: number; longitude: number } | null;
};

export type ScanPhoto = {
  temporaryImageId: string;
  file: File | null;
  previewUrl: string;
  mimeType: string;
  sizeBytes: number;
};

export type ScanSubmitPayload = {
  temporaryImageId: string;
  location: ScanLocationPayload;
  clientRequestId: string;
};

export type ScanAnalysisResult = {
  sizeCategory: string;
  wasteTypes: string[];
  drainageRisk: boolean;
  accessObstructionRisk: boolean;
  confidence: number;
  needsManualReview: boolean;
};

export type AddressPayload = {
  addressText: string | null;
  roadName: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
};

export type ScanSubmitResponse = {
  reportId: string;
  status: string;
  analysis?: ScanAnalysisResult;
  locationVerification?: {
    accuracyMeters: number;
    riskFlags: string[];
  };
  priority?: {
    score: number;
    level: string;
    weightVersion: string;
  };
  estimatedLoadUnit: number | null;
  rewardStatus: string;
  address: AddressPayload | null;
};

export type ScanState = {
  step: ScanStep;
  photo: ScanPhoto | null;
  deviceLocation: DeviceLocation | null;
  confirmedLocation: ConfirmedLocation | null;
  result: ScanSubmitResponse | null;
  error: string | null;
  errorCode: string | null;
};
