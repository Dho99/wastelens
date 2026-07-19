"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useDlhStore } from "@/lib/dlh-store";
import { Bell, LogOut, Settings } from "lucide-react";

function DashboardHeader() {
  const store = useDlhStore();
  const [accountMenu, setAccountMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-[#d2ddd7] bg-white px-4 sm:px-6">
      <h1 className="truncate text-lg font-extrabold tracking-[-0.025em] text-[#096a28] sm:text-[23px]">
        {store.settings.agency}
      </h1>
      <div className="ml-5 hidden h-7 w-px bg-[#cedbd4] md:block" />
      <div className="ml-5 hidden items-center gap-2 rounded-full bg-[#e2f2ea] px-3 py-1 text-xs font-bold text-[#176c31] md:flex">
        <span className="size-2 rounded-full bg-[#08752a]" /> System Status:
        Online
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-5">
        <Link
          href="/dinas/notifications"
          aria-label="Notifikasi"
          className="relative rounded-full p-2 hover:bg-slate-100"
        >
          <Bell className="size-5" strokeWidth={2.2} />
          <span className="absolute right-1 top-1 size-2 rounded-full border border-white bg-red-500" />
        </Link>
        <Link
          href="/dinas/settings"
          aria-label="Pengaturan"
          className="hidden rounded-full p-2 hover:bg-slate-100 sm:block"
        >
          <Settings className="size-5" strokeWidth={2.2} />
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setAccountMenu((v) => !v)}
            aria-expanded={accountMenu}
            aria-label="Menu akun"
            className="flex size-8 items-center justify-center rounded-full border border-[#c6d1cb] bg-[#e7f2ee] text-[10px] font-extrabold text-[#17662d]"
          >
            AD
          </button>
          {accountMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-[#c8d8d0] bg-white p-2 shadow-xl z-50">
              <Link
                href="/dinas/settings"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#edf8f2]"
              >
                <Settings className="size-4" /> Pengaturan
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setLoggingOut(true);
                  await signOut();
                  window.location.href = "/login";
                }}
                disabled={loggingOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut className="size-4" />{" "}
                {loggingOut ? "Keluar..." : "Keluar"}
              </button>
            </div>
          )}
        </div>
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
    <>
      {!hideHeader && <DashboardHeader />}
      {children}
    </>
  );
}
