"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useAdmin } from "../hooks/useAdmin";

function DashboardHeader() {
    const { data: notifications } = useNotifications();
    const { data: admin } = useAdmin();
    const unreadCount = (notifications ?? []).filter((n) => !n.status_baca).length;
    const initials = (admin?.name ?? "Admin Dinas")
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return (
        <header className="flex h-16 shrink-0 items-center border-b border-[#d2ddd7] bg-white px-4 sm:px-6">
            <div className="ml-auto flex items-center gap-2 sm:gap-5">
                <Link
                    href="/dinas/notifications"
                    aria-label={
                        unreadCount
                            ? `Notifikasi, ${unreadCount} belum dibaca`
                            : "Notifikasi"
                    }
                    className="relative rounded-full p-2 hover:bg-slate-100"
                >
                    <Bell className="size-5" strokeWidth={2.2} />
                    {unreadCount > 0 && (
                        <span
                            className="absolute right-1 top-1 size-2 rounded-full border border-white bg-red-500"
                            aria-hidden="true"
                        />
                    )}
                </Link>
                <Link
                    href="/dinas/settings"
                    aria-label="Pengaturan"
                    className="hidden rounded-full p-2 hover:bg-slate-100 sm:block"
                >
                    <Settings className="size-5" strokeWidth={2.2} />
                </Link>
                <Link
                    href="/dinas/accounts"
                    aria-label={`Profil ${admin?.name ?? "Admin Dinas"}`}
                    title={admin?.name ?? "Admin Dinas"}
                    className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#087529] bg-[#e7f2ee] text-[10px] font-extrabold text-[#17662d]"
                >
                    {admin?.image ? (
                        <Image
                            src={admin.image}
                            alt={admin.name}
                            fill
                            className="object-cover object-top"
                            sizes="36px"
                            unoptimized={admin.image.startsWith("data:") || admin.image.startsWith("/api/dinas/media/")}
                        />
                    ) : initials}
                </Link>
            </div>
        </header>
    );
}

export function DlhShell({
    children,
    hideHeader = false,
}: {
    children: ReactNode;
    hideHeader?: boolean;
}) {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f4fbff] text-[#17231d]">
            {!hideHeader && <DashboardHeader />}
            {children}
        </div>
    );
}
