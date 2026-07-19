import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { TabBarLayout } from "@/components/nav/tab-bar";
import Icon from "@mdi/react";
import {
  mdiHistory,
  mdiAccountOutline,
  mdiClipboardTextOutline
} from "@mdi/js";

const tabs = [
  {
    label: "tugas",
    href: `/petugas`,
    icon: <Icon path={mdiClipboardTextOutline} size={1} />,
  },
  {
    label: "Riwayat",
    href: `/petugas/history`,
    icon: <Icon path={mdiHistory} size={1} />,
  },
  {
    label: "Akun",
    href: `/petugas/profile`,
    icon: <Icon path={mdiAccountOutline} size={1} />,
  },
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
    <TabBarLayout tabs={tabs}>
      <div className="mx-5">
        {children}
      </div>
    </TabBarLayout>
  );
}
