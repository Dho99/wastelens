import { EditOfficerProfile } from "../../../../components/edit-officer-profile";

export default async function EditOfficerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditOfficerProfile officerId={id} />;
}
