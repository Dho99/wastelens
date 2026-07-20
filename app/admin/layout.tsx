import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SidebarLayout } from "@/components/nav/sidebar";
import { ArrowLeftRight, CircleDollarSign, Flag, LayoutDashboard, ShieldAlert, Users } from "lucide-react";

const navItems = [
  { label: "Dashboard Utama", href: "/admin", icon: <LayoutDashboard /> },
  { label: "Kelola User", href: "/admin/users", icon: <Users /> },
  { label: "Manajemen Entitas", href: "/admin/entities", icon: <ShieldAlert /> },
  { label: "Riwayat Transaksi", href: "/admin/transactions/coins", icon: <CircleDollarSign /> },
  { label: "Riwayat Penukaran", href: "/admin/transactions/products", icon: <ArrowLeftRight /> },
  { label: "Riwayat Laporan", href: "/admin/reports", icon: <Flag /> },
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
