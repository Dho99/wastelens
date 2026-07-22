"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, MoreVertical, Settings, X } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const brandByRole: Record<string, { title: string; subtitle?: string }> = {
  dinas: { title: "DLH Dashboard", subtitle: "Government Portal" },
  admin: { title: "WasteLens", subtitle: "SUPERADMIN CONSOLE" },
  kopdes: { title: "Kopdes Dashboard" },
};

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
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const userName = (session?.user as { nama?: string })?.nama ?? "";
  const userRole = (session?.user as { role?: string })?.role ?? role;

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    router.replace("/login");
    router.refresh();
  };

  const initials = userName
    ? userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : userRole.slice(0, 2).toUpperCase();

  const brand = brandByRole[userRole] ?? { title: "Sampah" };

  return (
    <div className="flex min-h-screen">
      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-[#ccddd5] bg-[#e9f6fc] transition-transform duration-200 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded-full p-2 hover:bg-white/70 lg:hidden"
          aria-label="Tutup menu"
        >
          <X className="size-5" />
        </button>

        <div className="px-[18px] pt-[23px]">
          <Link
            href={`/${userRole}`}
            onClick={() => setOpen(false)}
            className="block text-[23px] font-extrabold tracking-[-0.04em] text-[#086a28]"
          >
            {brand.title}
          </Link>
          {brand.subtitle && (
            <p className="mt-1 text-[12px] text-[#738077]">
              {brand.subtitle}
            </p>
          )}
        </div>

        <nav className="mt-5 flex-1 space-y-2 px-2">
          {navItems.map((item) => {
            const active =
              item.href === `/${userRole}`
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex h-12 w-full items-center gap-3 rounded-[24px] px-4 text-[15px] font-semibold transition-colors ${active
                  ? "bg-[#b9ebd0] text-[#477762]"
                  : "text-[#3f5148] hover:bg-[#b9ebd0] hover:text-[#477762]"
                  }`}
              >
                <span className="size-5 shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto p-[18px]">
          {accountMenu && (
            <div className="absolute bottom-[82px] left-4 right-4 overflow-hidden rounded-2xl border border-[#c8d8d0] bg-white p-2 shadow-xl">
              <Link
                href={`/${userRole}/settings`}
                onClick={() => {
                  setAccountMenu(false);
                  setOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#edf8f2]"
              >
                <Settings className="size-4" /> Pengaturan
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut className="size-4" />{" "}
                {loggingOut ? "Keluar..." : "Keluar"}
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 rounded-[22px] bg-white/20 p-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d8eee6] text-sm font-bold text-[#17662d]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              {userName && (
                <p className="truncate text-sm font-bold text-[#17251e]">
                  {userName}
                </p>
              )}
              <p className="truncate text-[10px] text-[#718078] capitalize">
                {userRole}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAccountMenu((v) => !v)}
              aria-expanded={accountMenu}
              aria-label="Menu akun"
              className="rounded-full p-1 text-[#66776e] hover:bg-white/60"
            >
              <MoreVertical className="size-5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center gap-3 border-b border-[#d2ddd7] bg-white px-4 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-1.5 hover:bg-neutral-100"
            aria-label="Buka menu"
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
          <span className="font-semibold text-sm">{brand.title}</span>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
