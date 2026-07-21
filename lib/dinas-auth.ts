import "server-only";

import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type DinasAccess = {
  id: string;
  userId: string;
  name: string;
};

export async function getRequestDinas(request: NextRequest): Promise<DinasAccess | null> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session) {
    const role = (session.user as { role?: string }).role;
    if (role !== "dinas") return null;
    const dinas = await prisma.dinas.findFirst({
      where: { user_id: session.user.id },
      select: { id: true, user_id: true, nama_dinas: true },
    });
    return dinas ? { id: dinas.id, userId: dinas.user_id, name: dinas.nama_dinas } : null;
  }

  return null;
}
