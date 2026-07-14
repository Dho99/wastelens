"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export function SidebarLayout({
    role,
    navItems,
    children,
}: {
    role: string;
    navItems: NavItem[];
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const userName = session?.user?.nama ?? "";
    const userRole = session?.user?.role ?? role;

    const handleLogout = async () => {
        setLoggingOut(true);
        await signOut();
        router.push("/login");
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === `/${userRole}`) return pathname === `/${userRole}`;
        return pathname.startsWith(href);
    };

    return (
        <div className="flex min-h-screen">
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-60 border-r bg-white flex flex-col
          transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex h-14 items-center gap-2 border-b px-4">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600">
                        <svg
                            className="size-5 text-white"
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
                    <span className="font-semibold text-sm">Sampah</span>
                </div>

                <nav className="flex-1 space-y-0.5 p-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                transition-colors
                ${
                    isActive(item.href)
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }
              `}
                        >
                            <span className="size-5 shrink-0">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="border-t p-3 space-y-2">
                    {userName && (
                        <p className="truncate text-xs font-medium text-neutral-700 px-1">
                            {userName}
                        </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 capitalize">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {userRole}
                    </span>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
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
                        {loggingOut ? "..." : "Keluar"}
                    </button>
                </div>
            </aside>

            <div className="flex flex-1 flex-col min-w-0">
                <header className="flex h-14 items-center gap-3 border-b px-4 lg:hidden">
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-lg p-1.5 hover:bg-neutral-100"
                        aria-label="Open menu"
                    >
                        <svg
                            className="size-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                    <span className="font-semibold text-sm">Sampah</span>
                </header>

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
