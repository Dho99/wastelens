import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SidebarLayout } from "@/components/nav/sidebar";
import { ClipboardList, Map, UserCog, Warehouse } from "lucide-react";

const navItems = [
  { label: "Dashboard Peta", href: "/dinas", icon: <Map /> },
  { label: "Kelola Laporan", href: "/dinas/reports", icon: <ClipboardList /> },
  { label: "Kelola Logistik", href: "/dinas/logistics", icon: <Warehouse /> },
  { label: "Kelola Akun", href: "/dinas/accounts", icon: <UserCog /> },
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
