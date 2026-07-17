import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session)

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role ?? "user";
  redirect(`/${role}`);
}

