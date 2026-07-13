import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { TabBarLayout } from "@/components/nav/tab-bar";
import { ArrowLeftRight, Camera, Clock, LayoutDashboard, Settings } from "lucide-react";

const tabs = [
  { label: "Beranda", href: "/user", icon: <LayoutDashboard /> },
  { label: "Scan Sampah", href: "/user/scan", icon: <Camera /> },
  { label: "Tukar Koin", href: "/user/exchange", icon: <ArrowLeftRight /> },
  { label: "Riwayat", href: "/user/history", icon: <Clock /> },
  { label: "Settings", href: "/user/settings", icon: <Settings /> },
];

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "user") redirect(`/${role ?? "user"}`);

  return (
    <TabBarLayout role="user" tabs={tabs}>
      {children}
    </TabBarLayout>
  );
}
