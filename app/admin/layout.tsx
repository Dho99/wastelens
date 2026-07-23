import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SidebarLayout } from "@/components/nav/sidebar";
import { LayoutGrid, Users, RefreshCw, Layers } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutGrid /> },
  { label: "Kelola User", href: "/admin/users", icon: <Users /> },
  { label: "Log Aktifitas", href: "/admin/reports", icon: <RefreshCw /> },
  { label: "Manajemen Entitas", href: "/admin/entities", icon: <Layers /> },
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
