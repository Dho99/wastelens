"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";

export interface TabItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function TabBarLayout({
  // role,
  tabs,
  children,
}: {
  role: string;
  tabs: TabItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  // const { data: session } = useSession();

  // const userName = session?.user?.nama ?? "";
  // const userRole = session?.user?.role ?? role;

  const handleLogout = async () => {
    // setLoggingOut(true);
    // await signOut();
    // router.push("/login");
    // router.refresh();
  };

  const isActive = (href: string) => {
    // if (href === `/${userRole}`) return pathname === `/${userRole}`;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen flex-col max-w-screen-sm m-auto w-full">
      <header className="flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-emerald-600">
            <svg
              className="size-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold">Sampah</span>
        </div>
        <div className="flex items-center gap-2">
          {/* {userName && ( */}
          {/*   <span className="text-xs text-neutral-500 max-w-32 truncate"> */}
          {/*     {userName} */}
          {/*   </span> */}
          {/* )} */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
            aria-label="Keluar"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-16">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium
                transition-colors
                ${isActive(tab.href)
                  ? "text-emerald-600"
                  : "text-neutral-400 hover:text-neutral-600"
                }
              `}
            >
              <span className="size-5">{tab.icon}</span>
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
