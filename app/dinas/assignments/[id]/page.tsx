import { AssignmentMonitoring } from "../../components/assignment-monitoring";
import { DlhShell } from "../../components/dlh-shell";

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DlhShell hideHeader><AssignmentMonitoring reportId={id} /></DlhShell>;
}
