import { prisma } from "@/lib/prisma";
import type { PrismaTransaction } from "@/lib/prisma-types";
import type { PusherEvent } from "./websocket.types";
import { triggerUserEvent } from "./pusher.service";

export async function persistNotification(
  data: {
    user_id: string;
    laporan_id: string;
    pesan: string;
  },
  tx?: PrismaTransaction,
) {
  const client = tx ?? prisma;
  return client.notifikasi.create({
    data: {
      ...data,
      status_baca: false,
    },
  });
}

/**
 * Persist DB notification and fire Pusher.
 * Prefer calling outside a transaction so events only fire after commit.
 * When `tx` is provided, only persists — caller must `triggerUserEvent` after commit.
 */
export async function notifyUser(opts: {
  userId: string;
  laporanId: string;
  pesan: string;
  event: PusherEvent;
  tx?: PrismaTransaction;
}): Promise<void> {
  const { userId, laporanId, pesan, event, tx } = opts;
  await persistNotification(
    { user_id: userId, laporan_id: laporanId, pesan },
    tx,
  );
  if (!tx) {
    void triggerUserEvent(userId, event);
  }
}

export function firePendingEvents(
  pending: Array<{ userId: string; event: PusherEvent }>,
): void {
  for (const item of pending) {
    void triggerUserEvent(item.userId, item.event);
  }
}
