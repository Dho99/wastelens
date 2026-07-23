import { VehicleDetail } from "./components/vehicle-detail";
import { DlhShell } from "../../../components/dlh-shell";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DlhShell hideHeader><VehicleDetail vehicleId={id} /></DlhShell>;
}
