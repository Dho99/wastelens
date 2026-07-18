export interface ImageStorageProvider {
  upload(
    fileBuffer: Buffer,
    options?: { folder?: string; publicId?: string },
  ): Promise<CloudinaryUploadResult>;
  delete(publicId: string): Promise<void>;
  getUrl(publicId: string): string;
}

export type CloudinaryUploadResult = {
  publicId: string;
  secureUrl: string;
  resourceType: string;
  bytes: number;
};
