import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SidebarLayout } from "@/components/nav/sidebar";
import { ArrowLeftRight, Flag, LayoutDashboard, Settings, Users } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard /> },
  { label: "Pengaturan", href: "/admin/settings", icon: <Settings /> },
  { label: "Pengguna", href: "/admin/users", icon: <Users /> },
  { label: "Laporan", href: "/admin/report", icon: <Flag /> },
  { label: "Riwayat Penukaran", href: "/admin/history", icon: <ArrowLeftRight /> },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") redirect(`/${role ?? "user"}`);

  return (
    <SidebarLayout role="admin" navItems={navItems}>
      {children}
    </SidebarLayout>
  );
}
