export interface ReportDetail {
  id: string;
  reportCode: string;
  status: 'SELESAI' | 'PROSES' | 'PERLU_DIPERIKSA';
  statusUpdatedText: string;
  citizenPhotoUrl: string;
  aiPhotoUrl: string;
  locationTitle: string;
  locationDetails: string;
  fullAddress?: string | null;
  reportTime: string;
  wasteTypes: string[];
  pointsGained: number;
}
