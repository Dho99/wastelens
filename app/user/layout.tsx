import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { TabBarLayout } from "@/components/nav/tab-bar";
import {
  mdiHomeVariant,
  mdiHistory,
  mdiCamera,
  mdiWalletGiftcard,
  mdiAccountOutline,
} from "@mdi/js";
import Icon from "@mdi/react";

const tabs = [
  {
    label: "Beranda",
    href: `/user`,
    icon: <Icon path={mdiHomeVariant} size={1} />,
  },
  {
    label: "Riwayat",
    href: `/user/history`,
    icon: <Icon path={mdiHistory} size={1} />,
  },
  {
    label: "Lapor",
    href: `/user/scan`,
    icon: <Icon path={mdiCamera} size={1} />,
    primaryMenu: true,
  },
  {
    label: "Reward",
    href: `/user/reward`,
    icon: <Icon path={mdiWalletGiftcard} size={1} />,
  },
  {
    label: "Akun",
    href: `/user/profile`,
    icon: <Icon path={mdiAccountOutline} size={1} />,
  },
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
