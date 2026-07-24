"use client";

import type { ReactNode } from "react";
import { TabBarProvider } from "@/components/nav/tab-bar-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { QueryProvider } from "@/components/query-provider";
import { RealtimeNotifications } from "@/components/realtime-notifications";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TabBarProvider>
        <RealtimeNotifications />
        <ErrorBoundary>{children}</ErrorBoundary>
      </TabBarProvider>
    </QueryProvider>
  );
}
