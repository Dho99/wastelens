import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SidebarLayout } from "@/components/nav/sidebar";
import { BarChart3, Car, Earth, LayoutDashboard, Users } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dinas", icon: <LayoutDashboard /> },
  { label: "Laporan", href: "/dinas/reports", icon: <BarChart3 /> },
  { label: "Cakupan Area", href: "/dinas/area-coverage", icon: <Earth /> },
  { label: "Petugas", href: "/dinas/petugas", icon: <Users /> },
  { label: "Kendaraan", href: "/dinas/vehicle", icon: <Car /> },
];

export default async function DinasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "dinas") redirect(`/${role ?? "user"}`);

  return (
    <SidebarLayout role="dinas" navItems={navItems}>
      {children}
    </SidebarLayout>
  );
}
