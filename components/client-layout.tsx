"use client";

import type { ReactNode } from "react";
import { TabBarProvider } from "@/components/nav/tab-bar-context";
import { ErrorBoundary } from "@/components/error-boundary";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <TabBarProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </TabBarProvider>
  );
}
