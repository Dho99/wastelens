import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function DinasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The DLH slicing can be previewed locally before auth/database seeding is
  // available. This bypass is removed automatically in production builds.
  if (process.env.NODE_ENV === "development") return children;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "dinas") redirect(`/${role ?? "user"}`);

  return children;
}
