import { EditOfficerProfile } from "./components/edit-officer-profile";
import { DlhShell } from "../../../../components/dlh-shell";

export default async function EditOfficerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DlhShell hideHeader><EditOfficerProfile officerId={id} /></DlhShell>;
}
