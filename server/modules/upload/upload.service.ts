import { createUpload, findExpiredUploads, markAsUsed } from "./upload.repository";
import { getCloudinaryProvider } from "@/server/integrations/cloudinary/cloudinary.service";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const EXPIRY_HOURS = parseInt(process.env.TEMPORARY_UPLOAD_EXPIRY_HOURS ?? "24", 10);

export class UploadError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

function validateFile(mimeType: string, size: number, buffer: Buffer) {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new UploadError("Format file harus JPEG, PNG, atau WebP", "INVALID_MIME_TYPE");
  }
  if (size > MAX_FILE_SIZE_BYTES) {
    throw new UploadError("Ukuran file maksimal 5 MB", "FILE_TOO_LARGE");
  }
  if (buffer.length === 0) {
    throw new UploadError("File tidak boleh kosong", "EMPTY_FILE");
  }
}

export async function uploadFile(
  userId: string,
  fileBuffer: Buffer,
  mimeType: string,
) {
  validateFile(mimeType, fileBuffer.length, fileBuffer);

  const cloudinary = getCloudinaryProvider();
  let result;
  if (process.env.AI_PROVIDER === "mock") {
    result = {
      publicId: `mock_${userId}_${Date.now()}`,
      secureUrl: `https://res.cloudinary.com/dummy-cloud/image/upload/mock_${userId}.jpg`,
      resourceType: "image",
      bytes: fileBuffer.length,
    };
  } else {
    result = await cloudinary.upload(fileBuffer, {
      folder: "wastelens",
      publicId: `${userId}_${Date.now()}`,
    });
  }

  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

  const record = await createUpload({
    user_id: userId,
    provider: "cloudinary",
    public_id: result.publicId,
    secure_url: result.secureUrl,
    resource_type: result.resourceType,
    mime_type: mimeType,
    size_bytes: fileBuffer.length,
    expiresAt,
  });

  return {
    temporaryImageId: record.id,
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    expiresAt: record.expiresAt.toISOString(),
  };
}

export async function cleanupExpiredUploads() {
  const expired = await findExpiredUploads();
  const cloudinary = getCloudinaryProvider();

  for (const upload of expired) {
    try {
      await cloudinary.delete(upload.public_id);
    } catch {
      // continue cleanup even if Cloudinary delete fails
    }
    await markAsUsed(upload.id);
  }
}
