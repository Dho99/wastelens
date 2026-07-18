import type { ScanSubmitResponse } from "../types/scan.types";

export type AddressPayload = {
  addressText: string | null;
  roadName: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
};

export type SubmitPayload = {
  temporaryImageId: string;
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
  };
  analysis: {
    sizeCategory: string;
    wasteTypes: string[];
    drainageRisk: boolean;
    accessObstructionRisk: boolean;
    confidence: number;
    needsManualReview: boolean;
  };
  clientRequestId: string;
  address?: AddressPayload;
};

export async function submitWasteReport(
  payload: SubmitPayload,
): Promise<ScanSubmitResponse> {
  const response = await fetch("/api/laporan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new ScanSubmitError(
      json.message ?? "Gagal mengirim laporan",
      json.errorCode ?? "SUBMIT_FAILED",
    );
  }

  return json.data as ScanSubmitResponse;
}

export class ScanSubmitError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
  ) {
    super(message);
    this.name = "ScanSubmitError";
  }
}

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Format foto harus JPEG, PNG, atau WebP";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Ukuran foto maksimal 5 MB";
  }
  return null;
}

export function mimeTypeFromFile(file: File): string {
  if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp") {
    return file.type;
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}
