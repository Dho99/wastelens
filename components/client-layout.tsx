"use client";

import type { ReactNode } from "react";
import { TabBarProvider } from "@/components/nav/tab-bar-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { QueryProvider } from "@/components/query-provider";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TabBarProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </TabBarProvider>
    </QueryProvider>
  );
}
