"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface TabBarContextType {
  hideTabBar: boolean;
  setHideTabBar: (v: boolean) => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export function TabBarProvider({ children }: { children: ReactNode }) {
  const [hideTabBar, setHideTabBar] = useState(false);
  return (
    <TabBarContext.Provider value={{ hideTabBar, setHideTabBar }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = useContext(TabBarContext);
  if (!context) throw new Error("useTabBar must be used within TabBarProvider");
  return context;
}
