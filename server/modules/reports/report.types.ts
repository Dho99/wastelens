export type AddressFields = {
  addressText: string | null;
  roadName: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
};

export type SubmitReportInput = {
  temporaryImageId: string;
  analysis: {
    sizeCategory: string;
    wasteTypes: string[];
    drainageRisk: boolean;
    accessObstructionRisk: boolean;
    confidence: number;
    needsManualReview: boolean;
  };
  location: {
    browser: {
      latitude: number;
      longitude: number;
      accuracyMeters: number;
      capturedAt: string;
    };
    exif: {
      latitude: number | null;
      longitude: number | null;
      timestamp: string | null;
    };
    verification: {
      distanceDifferenceMeters: number | null;
      riskFlags: string[];
    };
  };
  clientRequestId: string;
  address?: AddressFields;
};

export type ReportResult = {
  reportId: string;
  status: string;
  priorityScore: number | null;
  priorityLevel: string | null;
  estimatedLoadUnit: number | null;
  rewardStatus: string;
  address: AddressFields | null;
};
