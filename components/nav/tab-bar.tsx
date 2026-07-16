"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { useTabBar } from "./tab-bar-context";
import Icon from "@mdi/react";
import {
    mdiHomeVariant,
    mdiHistory,
    mdiCamera,
    mdiWalletGiftcard,
    mdiAccountOutline,
} from "@mdi/js";

export interface TabItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    primaryMenu?: boolean;
}

export function TabBarLayout({
    role,
    tabs,
    children,
}: {
    role: string;
    tabs: TabItem[];
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const { data: session } = useSession();

    const userName = (session?.user as { nama?: string })?.nama ?? "";
    const userRole = (session?.user as { role?: string })?.role ?? role;
    // Let's use the profile photo from the design or fallback to the session's image
    const userImage =
        session?.user?.image ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

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

    const isUserRole = userRole === "user";

    const userNavMenus: TabItem[] = [
        {
            label: "Beranda",
            href: `/${userRole}`,
            icon: <Icon path={mdiHomeVariant} size={1.5} />,
        },
        {
            label: "Riwayat",
            href: `/${userRole}/history`,
            icon: <Icon path={mdiHistory} size={1.5} />,
        },
        {
            label: "Lapor",
            href: `/${userRole}/report`,
            icon: <Icon path={mdiCamera} size={2} />,
            primaryMenu: true,
        },
        {
            label: "Reward",
            href: `/${userRole}/reward`,
            icon: <Icon path={mdiWalletGiftcard} size={1.5} />,
        },
        {
            label: "Akun",
            href: `/${userRole}/profile`,
            icon: <Icon path={mdiAccountOutline} size={1.5} />,
        },
    ];

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
        HEADER (NAVBAR) - USER ROLE SPECIFIC
        ========================================================================
      */}
            {isUserRole ? (
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
            ) : (
                /* Fallback Header for other roles */
                <header className="flex h-12 items-center justify-between border-b bg-white px-4">
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
                        {userName && (
                            <span className="text-xs text-neutral-500 max-w-32 truncate">
                                {userName}
                            </span>
                        )}
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
            )}

            {/* Main Content Area */}
            <main className={`flex-1 ${isUserRole ? "pb-24" : "pb-16"}`}>
                {children}
            </main>

            {/* 
        ========================================================================
        BOTTOM BAR - USER ROLE SPECIFIC WITH CENTRAL FLOATING LAPOR BUTTON
        ========================================================================
      */}
            {isUserRole ? (
                <nav className="fixed inset-x-0 bottom-0 z-50 bg-transparent max-w-screen-sm mx-auto w-full px-4 pb-4 pointer-events-none">
                    <div className="bg-white rounded-t-[32px] rounded-b-[24px] shadow-[0_-8px_30px_rgb(0,0,0,0.06)] flex items-end grid grid-cols-5 px-6 pt-2 pb-3 pointer-events-auto border border-gray-100/50 shadow-xl">
                        {userNavMenus.map((tab, index) => {
                            return tab.primaryMenu ? (
                                <div
                                    key={index}
                                    className="flex flex-col items-center -mt-[100px] mb-5 relative z-20"
                                >
                                    <Link
                                        href="/user/scan"
                                        className="w-24 h-16 rounded-full bg-[#287A38] shadow-[0_8px_20px_rgba(40,122,56,0.3)] hover:bg-[#20632d] active:scale-95 transition-all duration-200 p-4 flex items-center justify-center text-white"
                                        aria-label="Lapor Sampah"
                                    >
                                        <>{tab.icon}</>
                                    </Link>
                                    <span className="text-md font-bold text-[#287A38] mt-1.5">
                                        Lapor
                                    </span>
                                </div>
                            ) : (
                                <Link
                                    key={index}
                                    href={tab.href}
                                    className={`flex flex-col items-center gap-1 font-bold transition-all duration-200 p-4 ${
                                        isActive(tab.href) &&
                                        pathname === `${tab.href}`
                                            ? "text-[#0D631B] bg-[#2E7D32]/10 rounded-2xl "
                                            : " "
                                    }`}
                                >
                                    <span className="flex items-center justify-center">
                                        {tab.icon}
                                    </span>
                                    <span className="text-[15px]">
                                        {tab.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            ) : (
                /* Fallback Navigation for other roles */
                <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white">
                    <div className="mx-auto flex max-w-lg items-center justify-around">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`
                  flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium
                  transition-colors
                  ${
                      isActive(tab.href)
                          ? "text-emerald-600"
                          : "text-neutral-400 hover:text-neutral-600"
                  }
                `}
                            >
                                <span className="flex items-center justify-center">
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </div>
    );
}
