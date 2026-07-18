"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import PusherClient from "pusher-js";
import type { WsEventType, PusherEvent } from "@/server/websocket/websocket.types";

type EventHandler = (event: PusherEvent) => void;

export function usePusher(userId: string | null) {
  const pusherRef = useRef<PusherClient | null>(null);
  const handlersRef = useRef<Map<WsEventType, Set<EventHandler>>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "ap1";

    if (!appKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[usePusher] NEXT_PUBLIC_PUSHER_APP_KEY not set");
      }
      return;
    }

    const pusher = new PusherClient(appKey, {
      cluster,
      authEndpoint: "/api/pusher/auth",
      authTransport: "ajax",
    });

    pusherRef.current = pusher;

    pusher.connection.bind("connected", () => setIsConnected(true));
    pusher.connection.bind("disconnected", () => setIsConnected(false));

    const channelName = `private-user-${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind_global((eventType: string, data: unknown) => {
      const handlers = handlersRef.current.get(eventType as WsEventType);
      if (!handlers) return;

      const pusherEvent = data as PusherEvent;
      handlers.forEach((handler) => handler(pusherEvent));
    });

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      pusherRef.current = null;
      setIsConnected(false);
    };
  }, [userId]);

  const subscribe = useCallback((eventType: WsEventType, handler: EventHandler) => {
    if (!handlersRef.current.has(eventType)) {
      handlersRef.current.set(eventType, new Set());
    }
    handlersRef.current.get(eventType)!.add(handler);

    return () => {
      handlersRef.current.get(eventType)?.delete(handler);
    };
  }, []);

  return { isConnected, subscribe };
}
