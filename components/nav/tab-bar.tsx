"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useTabBar } from "./tab-bar-context";

export interface TabItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  primaryMenu?: boolean;
}

export function TabBarLayout({
  tabs,
  children,
}: {
  tabs: TabItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = (session?.user as { nama?: string })?.nama ?? "";
  const userImage =
    session?.user?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  const { hideTabBar } = useTabBar();

  if (hideTabBar) {
    return (
      <div className="flex min-h-screen flex-col max-w-screen-sm m-auto w-full bg-black">
        <main className="flex-1 w-full h-full min-h-screen relative">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col max-w-screen-sm m-auto w-full bg-[#FAF9F5]">
      {/* 
        ========================================================================
        HEADER (NAVBAR)
        ========================================================================
      */}
      <header className="flex h-16 items-center justify-between bg-transparent px-5 py-4 mt-2">
        <div className="flex items-center gap-3">
          {/* User Avatar with Circular Green Border */}
          <div className="relative w-10 h-10 rounded-full border-2 border-[#1E7D38] p-[1.5px] flex items-center justify-center bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userImage}
              alt={userName || "User Profile"}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* Brand Title */}
          <span className="text-xl font-extrabold text-[#1E7D38] tracking-tight">
            WasteLens
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            className="relative p-2 text-[#1E7D38] hover:bg-emerald-50 rounded-full transition-colors duration-200"
            aria-label="Notification"
          >
            <svg
              className="w-6 h-6 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {/* Optional Active Dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#D32F2F] rounded-full border border-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 pb-16 px-5`}>
        {children}
      </main>

      {/* 
        ========================================================================
        BOTTOM BAR
        ========================================================================
      */}
      <nav className="fixed inset-x-0 bottom-0 z-50 bg-transparent max-w-screen-sm mx-auto w-full px-4 pb-4 pointer-events-none">
        <div className={`bg-white rounded-t-4xl rounded-b-3xl items-end flex p-2 pointer-events-auto border border-gray-100/50 shadow-xl`}>
          {tabs.map((tab, index) => {
            return tab.primaryMenu ? (
              <div
                key={index}
                className="flex flex-col items-center p-2 relative z-20 flex-1"
              >
                <Link
                  href={tab.href}
                  className="h-8 rounded-full bg-primary shadow-xl hover:bg-primary/90 active:scale-95 transition-all duration-200 px-4 py-6 flex items-center justify-center text-white absolute -top-12"
                  aria-label="Lapor Sampah"
                >
                  {tab.icon}
                </Link>
                <span className="text-xs font-medium">
                  Lapor
                </span>
              </div>
            ) : (
              <Link
                key={index}
                href={tab.href}
                className={`flex-1 flex flex-col items-center gap-1 font-medium transition-all duration-200 p-2 ${pathname === `${tab.href}`
                  ? "text-[#0D631B] bg-primary/10 rounded-2xl"
                  : " "
                  }`}
              >
                <span className="flex items-center justify-center">
                  {tab.icon}
                </span>
                <span className="text-xs">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
