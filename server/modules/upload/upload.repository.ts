import { prisma } from "@/lib/prisma";

export async function createUpload(data: {
  user_id: string;
  provider: string;
  public_id: string;
  secure_url: string;
  resource_type: string;
  mime_type: string;
  size_bytes: number;
  expiresAt: Date;
}) {
  return prisma.temporaryUpload.create({
    data: {
      ...data,
      status: "ACTIVE",
    },
  });
}

export async function findUploadById(id: string) {
  return prisma.temporaryUpload.findUnique({
    where: { id },
  });
}

export async function findExpiredUploads() {
  return prisma.temporaryUpload.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: new Date() },
    },
  });
}

export async function markAsUsed(id: string) {
  return prisma.temporaryUpload.update({
    where: { id },
    data: {
      status: "USED",
      usedAt: new Date(),
    },
  });
}

export async function expireStale() {
  return prisma.temporaryUpload.updateMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });
}
