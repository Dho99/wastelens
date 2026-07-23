import { findUploadById, markAsUsed } from "@/server/modules/upload/upload.repository";
import { verifyLocation } from "@/server/modules/location/location-verification.service";
import { reverseGeocode } from "@/server/modules/location/reverse-geocode.service";
import { calculatePriority } from "@/server/modules/priority/priority.service";
import { autoAssignDinas } from "@/lib/services/assignment";
import {
  findReportByClientRequestId,
  countActiveReportsInRadius,
  createLaporan,
} from "./report.repository";
import type { SubmitReportInput, ReportResult, AddressFields } from "./report.types";
import { prisma } from "@/lib/prisma";
import { triggerUserEvent } from "@/server/websocket/pusher.service";
import { notifyUser } from "@/server/websocket/notify.service";
import { createReportCreatedEvent } from "@/server/websocket/websocket.events";

const RADIUS_FOR_REPEAT_METERS = 100;

export class ReportError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "ReportError";
  }
}

export async function createReport(
  input: SubmitReportInput & { userId: string },
): Promise<ReportResult> {
  const existing = await findReportByClientRequestId(input.clientRequestId);
  if (existing) {
    throw new ReportError("Laporan dengan ID ini sudah ada", "DUPLICATE_REQUEST");
  }

  const upload = await findUploadById(input.temporaryImageId);
  if (!upload) {
    throw new ReportError("File temporary tidak ditemukan atau sudah kadaluwarsa", "TEMP_FILE_NOT_FOUND");
  }

  if (upload.user_id !== input.userId) {
    throw new ReportError("File temporary bukan milik user ini", "TEMP_FILE_OWNER_MISMATCH");
  }

  const locVerification = verifyLocation({
    browserLatitude: input.location.browser.latitude,
    browserLongitude: input.location.browser.longitude,
    accuracyMeters: input.location.browser.accuracyMeters,
    exifLatitude: input.location.exif.latitude,
    exifLongitude: input.location.exif.longitude,
  });

  const repeatCount = await countActiveReportsInRadius(
    input.location.browser.latitude,
    input.location.browser.longitude,
    RADIUS_FOR_REPEAT_METERS,
  );

  const priority = calculatePriority({
    sizeCategory: input.analysis.sizeCategory as "SMALL" | "MEDIUM" | "LARGE" | "UNCERTAIN",
    drainageRisk: input.analysis.drainageRisk,
    accessObstructionRisk: input.analysis.accessObstructionRisk,
    repeatCount,
  });

  const isAccepted =
    input.analysis.sizeCategory !== "UNCERTAIN" && input.analysis.confidence >= 0.3;
  const baseStatus = isAccepted ? "ANALYZED" : "WAITING";
  const analysisProvider = input.analysis.needsManualReview ? "MANUAL_PENDING" : "GEMINI";

  const photoHash = upload.public_id;

  let addressFields: AddressFields | null = null;

  if (input.address) {
    addressFields = input.address;
  } else {
    const geocoded = await reverseGeocode(
      input.location.browser.latitude,
      input.location.browser.longitude,
    );
    if (geocoded) {
      addressFields = geocoded;
    }
  }

  const assignedDinas = addressFields?.district
    ? await autoAssignDinas(addressFields.district)
    : null;
  const dinasId = assignedDinas?.dinas_id ?? null;
  const finalStatus = dinasId ? "PENDING" : baseStatus;

  const laporan = await createLaporan({
    user_id: input.userId,
    dinas_id: dinasId,
    foto_url: upload.secure_url,
    lokasi_lat: input.location.browser.latitude,
    lokasi_lng: input.location.browser.longitude,
    kategori_ukuran: input.analysis.sizeCategory,
    status: finalStatus,
    photo_hash: photoHash,
    photo_mime_type: upload.mime_type,
    photo_size_bytes: upload.size_bytes,
    waste_types: input.analysis.wasteTypes,
    drainage_risk: input.analysis.drainageRisk,
    access_obstruction_risk: input.analysis.accessObstructionRisk,
    visual_indicators: [],
    confidence: input.analysis.confidence,
    needs_manual_review: input.analysis.needsManualReview,
    analysis_provider: analysisProvider,
    priority_score: priority.score,
    priority_level: priority.level,
    estimated_load_unit: priority.estimatedLoadUnit,
    client_request_id: input.clientRequestId,
    lokasi_accuracy: input.location.browser.accuracyMeters,
    lokasi_confirmed_lat: input.location.browser.latitude,
    lokasi_confirmed_lng: input.location.browser.longitude,
    lokasi_device_lat: input.location.browser.latitude,
    lokasi_device_lng: input.location.browser.longitude,
    lokasi_captured_at: new Date(input.location.browser.capturedAt),
    lokasi_exif_lat: input.location.exif.latitude,
    lokasi_exif_lng: input.location.exif.longitude,
    risk_flags: locVerification.riskFlags,
    address_text: addressFields?.addressText ?? null,
    road_name: addressFields?.roadName ?? null,
    district: addressFields?.district ?? null,
    city: addressFields?.city ?? null,
    province: addressFields?.province ?? null,
    country: addressFields?.country ?? null,
  });

  await markAsUsed(input.temporaryImageId);

  const createdEvent = createReportCreatedEvent({
    laporanId: laporan.id,
    status: finalStatus,
  });

  triggerUserEvent(input.userId, createdEvent);

  if (dinasId) {
    const dinas = await prisma.dinas.findUnique({
      where: { id: dinasId },
      select: { user_id: true },
    });
    if (dinas?.user_id) {
      await notifyUser({
        userId: dinas.user_id,
        laporanId: laporan.id,
        pesan: "Laporan sampah baru masuk dan menunggu penanganan.",
        event: createdEvent,
      });
    }
  }

  return {
    reportId: laporan.id,
    status: finalStatus,
    priorityScore: priority.score,
    priorityLevel: priority.level,
    estimatedLoadUnit: priority.estimatedLoadUnit,
    rewardStatus: "NOT_ELIGIBLE_UNTIL_VERIFIED",
    address: addressFields,
  };
}
