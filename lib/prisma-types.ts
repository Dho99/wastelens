import type { PrismaClient } from "@/lib/generated/prisma/client";

export type PrismaTransaction = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];
