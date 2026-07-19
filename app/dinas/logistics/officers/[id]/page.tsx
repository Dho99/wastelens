import { OfficerDetail } from "../../../components/officer-detail";

export default async function OfficerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OfficerDetail officerId={id} />;
}
