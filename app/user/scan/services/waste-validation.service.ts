export type MockValidationResult = {
  isValid: boolean;
  confidence: number;
  detectedObject: string;
  wasteCategory: string[];
  estimatedVolume: string;
  reason?: string;
};

export type SubmitWasteReportResponse = {
  reportId: string;
  submittedAt: string;
  rewardPoints: number;
  status: "submitted";
};

// TODO: Replace mock validation with Gemini AI or backend AI endpoint.
export async function mockValidateWasteImage(
  shouldFail: boolean = false
): Promise<MockValidationResult> {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  if (shouldFail) {
    return {
      isValid: false,
      confidence: 0.32,
      detectedObject: "Unknown/Blurry",
      wasteCategory: [],
      estimatedVolume: "N/A",
      reason: "Objek tidak terdeteksi sebagai sampah atau foto terlalu buram."
    };
  }

  return {
    isValid: true,
    confidence: 0.98,
    detectedObject: "Tumpukan Plastik",
    wasteCategory: ["Plastik", "Logam"],
    estimatedVolume: "Sedang",
  };
}

// TODO: Replace mock submit with actual backend API call.
export async function mockSubmitWasteReport(): Promise<SubmitWasteReportResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    reportId: "WL-20230501",
    submittedAt: new Date().toISOString(),
    rewardPoints: 50,
    status: "submitted",
  };
}
