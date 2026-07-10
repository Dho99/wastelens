import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { TabBarLayout } from "@/components/nav/tab-bar";
import { Clipboard, LayoutDashboard } from "lucide-react";

const tabs = [
  { label: "Beranda", href: "/petugas", icon: <LayoutDashboard /> },
  { label: "Tugas", href: "/petugas/tasks", icon: <Clipboard /> },
];

export default async function PetugasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "petugas") redirect(`/${role ?? "user"}`);

  return (
    <TabBarLayout role="petugas" tabs={tabs}>
      {children}
    </TabBarLayout>
  );
}
