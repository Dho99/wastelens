import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Pusher from "pusher";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const formData = await request.formData();
    const socketId = formData.get("socket_id") as string;
    const channelName = formData.get("channel_name") as string;

    if (!socketId || !channelName) {
      return NextResponse.json({ error: "Missing socket_id or channel_name" }, { status: 400 });
    }

    const expectedChannel = `private-user-${userId}`;
    if (channelName !== expectedChannel) {
      return NextResponse.json({ error: "Forbidden channel" }, { status: 403 });
    }

    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "ap1";

    if (!appId || !key || !secret) {
      return NextResponse.json({ error: "Pusher not configured" }, { status: 500 });
    }

    const pusher = new Pusher({ appId, key, secret, cluster, useTLS: true });
    const authResponse = pusher.authorizeChannel(socketId, channelName);

    return NextResponse.json(authResponse);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
