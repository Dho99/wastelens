import { redirect } from "next/navigation";

export default async function HomePage() {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  //
  // if (!session) {
  //   redirect("/login");
  // }
  //
  // const role = (session.user as { role?: string }).role ?? "user";
  const role = "dinas"
  redirect(`/${role}`);
}

