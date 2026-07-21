import Pusher from "pusher";
import { PRIVATE_USER_CHANNEL } from "./websocket.types";
import type { PusherEvent } from "./websocket.types";

let pusherClient: Pusher | null = null;

function getPusher(): Pusher {
  if (pusherClient) return pusherClient;

  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "ap1";

  if (!appId || !key || !secret) {
    throw new Error(
      "Pusher env vars missing: PUSHER_APP_ID, NEXT_PUBLIC_PUSHER_APP_KEY, PUSHER_SECRET",
    );
  }

  pusherClient = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });

  return pusherClient;
}

export async function triggerUserEvent(
  userId: string,
  event: PusherEvent,
): Promise<void> {
  try {
    const pusher = getPusher();
    await pusher.trigger(PRIVATE_USER_CHANNEL(userId), event.type, event);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[pusher] Failed to send event:", err);
    }
  }
}

export function isPusherConfigured(): boolean {
  return !!(process.env.PUSHER_APP_ID && process.env.NEXT_PUBLIC_PUSHER_APP_KEY && process.env.PUSHER_SECRET);
}
