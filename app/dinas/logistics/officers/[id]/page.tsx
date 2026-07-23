import { OfficerDetail } from "./components/officer-detail";
import { DlhShell } from "../../../components/dlh-shell";

export default async function OfficerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DlhShell hideHeader><OfficerDetail officerId={id} /></DlhShell>;
}
