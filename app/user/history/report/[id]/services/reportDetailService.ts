export interface ReportDetail {
  id: string;
  reportCode: string;
  status: 'SELESAI' | 'PROSES' | 'PERLU_DIPERIKSA';
  statusUpdatedText: string;
  citizenPhotoUrl: string;
  aiPhotoUrl: string;
  locationTitle: string;
  locationDetails: string;
  reportTime: string;
  wasteTypes: string[];
  pointsGained: number;
}

export const getReportDetailDummyData = (id: string): ReportDetail => {
  // We can return a specific report detail mockup based on the dynamic ID, or a default one that matches the screenshot.
  return {
    id: id || "88210",
    reportCode: "#REP-88210",
    status: "SELESAI",
    statusUpdatedText: "Status diperbarui 2 jam yang lalu oleh AI Validator",
    citizenPhotoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop&q=80", // street trash
    aiPhotoUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&auto=format&fit=crop&q=80", // clean sidewalk
    locationTitle: "Kawasan Sudirman, Jakarta Pusat",
    locationDetails: "Dekat Stasiun MRT Dukuh Atas, Sisi Timur Jalan Jenderal Sudirman.",
    reportTime: "12 Okt 2023, 14:20 WIB",
    wasteTypes: ["Plastik", "Logam"],
    pointsGained: 50
  };
};
