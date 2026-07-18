"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import {
  Bell,
  ClipboardList,
  LogOut,
  Map,
  Menu,
  MoreVertical,
  Settings,
  UserCog,
  Warehouse,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard Peta", href: "/dinas", icon: Map },
  { label: "Kelola Laporan", href: "/dinas/reports", icon: ClipboardList },
  { label: "Kelola Logistik", href: "/dinas/logistics", icon: Warehouse },
  { label: "Kelola Akun", href: "/dinas/accounts", icon: UserCog },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [accountMenu, setAccountMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-[#ccddd5] bg-[#e9f6fc] transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-full p-2 hover:bg-white/70 lg:hidden" aria-label="Tutup menu">
          <X className="size-5" />
        </button>
        <div className="px-[18px] pt-[23px]">
          <Link href="/dinas" onClick={onClose} className="block text-[23px] font-extrabold tracking-[-0.04em] text-[#086a28]">
            DLH Dashboard
          </Link>
          <p className="mt-1 text-[12px] text-[#738077]">Government Portal</p>
        </div>

        <nav className="mt-5 space-y-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/dinas" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex h-16 w-full items-center gap-3 rounded-[24px] px-4 text-[15px] font-semibold transition-colors ${
                  active ? "bg-[#b9ebd0] text-[#477762]" : "text-[#3f5148] hover:bg-white/60"
                }`}
              >
                <Icon className="size-5" strokeWidth={2.2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto p-[18px]">
          {accountMenu && (
            <div className="absolute bottom-[82px] left-4 right-4 overflow-hidden rounded-2xl border border-[#c8d8d0] bg-white p-2 shadow-xl">
              <Link href="/dinas/settings" onClick={onClose} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#edf8f2]">
                <Settings className="size-4" /> Pengaturan
              </Link>
              <button type="button" onClick={handleLogout} disabled={loggingOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                <LogOut className="size-4" /> {loggingOut ? "Keluar..." : "Keluar"}
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 rounded-[22px] bg-white/20 p-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d8eee6] text-sm font-bold text-[#17662d]">AD</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#17251e]">Admin DLH</p>
              <p className="truncate text-[10px] text-[#718078]">Wilayah Jakarta Pusat</p>
            </div>
            <button type="button" onClick={() => setAccountMenu((value) => !value)} aria-expanded={accountMenu} aria-label="Menu akun" className="rounded-full p-1 text-[#66776e] hover:bg-white/60">
              <MoreVertical className="size-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function DashboardHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-[#d2ddd7] bg-white px-4 sm:px-6">
      <button type="button" onClick={onMenu} className="mr-3 rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Buka menu">
        <Menu className="size-5" />
      </button>
      <h1 className="truncate text-lg font-extrabold tracking-[-0.025em] text-[#096a28] sm:text-[23px]">Dinas Lingkungan Hidup</h1>
      <div className="ml-5 hidden h-7 w-px bg-[#cedbd4] md:block" />
      <div className="ml-5 hidden items-center gap-2 rounded-full bg-[#e2f2ea] px-3 py-1 text-xs font-bold text-[#176c31] md:flex">
        <span className="size-2 rounded-full bg-[#08752a]" /> System Status: Online
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-5">
        <Link href="/dinas/notifications" aria-label="Notifikasi" className="relative rounded-full p-2 hover:bg-slate-100">
          <Bell className="size-5" strokeWidth={2.2} />
          <span className="absolute right-1 top-1 size-2 rounded-full border border-white bg-red-500" />
        </Link>
        <Link href="/dinas/settings" aria-label="Pengaturan" className="hidden rounded-full p-2 hover:bg-slate-100 sm:block">
          <Settings className="size-5" strokeWidth={2.2} />
        </Link>
        <Link href="/dinas/accounts" className="flex size-8 items-center justify-center rounded-full border border-[#c6d1cb] bg-[#e7f2ee] text-[10px] font-extrabold text-[#17662d]">AD</Link>
      </div>
    </header>
  );
}

export function DlhShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-dvh min-h-[680px] overflow-hidden bg-[#f4fbff] text-[#17231d]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onMenu={() => setMenuOpen(true)} />
        {children}
      </div>
    </div>
  );
}
