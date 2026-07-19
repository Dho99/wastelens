import { AssignmentMonitoring } from "../../components/assignment-monitoring";

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssignmentMonitoring reportId={id} />;
}
