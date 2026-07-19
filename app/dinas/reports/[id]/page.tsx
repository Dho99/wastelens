import { ReportDetail } from "../../components/report-detail";

export default async function DinasReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportDetail reportId={id} />;
}
