import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SidebarLayout } from "@/components/nav/sidebar";
import { LayoutDashboard, Package, ScanLine } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/kopdes", icon: <LayoutDashboard /> },
  { label: "Kelola Produk", href: "/kopdes/products", icon: <Package /> },
  { label: "Scan Kode", href: "/kopdes/scan", icon: <ScanLine /> },
];

export default async function KopdesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "kopdes") redirect(`/${role ?? "user"}`);

  return (
    <SidebarLayout role="kopdes" navItems={navItems}>
      {children}
    </SidebarLayout>
  );
}
