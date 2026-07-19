import { cloudinary } from "./cloudinary.client";
import type { ImageStorageProvider, CloudinaryUploadResult } from "./cloudinary.types";

const CLOUDINARY_FOLDER = "wastelens";

class CloudinaryStorageProvider implements ImageStorageProvider {
  async upload(
    fileBuffer: Buffer,
    options?: { folder?: string; publicId?: string },
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder ?? CLOUDINARY_FOLDER,
          public_id: options?.publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error("Cloudinary upload failed"));
          }
          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            resourceType: result.resource_type,
            bytes: result.bytes,
          });
        },
      );
      uploadStream.end(fileBuffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  getUrl(publicId: string): string {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) throw new Error("CLOUDINARY_CLOUD_NAME is not configured");
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  }
}

let instance: CloudinaryStorageProvider | null = null;

export function getCloudinaryProvider(): CloudinaryStorageProvider {
  if (!instance) {
    instance = new CloudinaryStorageProvider();
  }
  return instance;
}
