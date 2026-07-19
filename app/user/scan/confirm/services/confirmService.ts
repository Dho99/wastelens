export interface ConfirmData {
  citizenPhotoUrl: string;
  address: string;
  reportTime: string;
  aiClassification: string;
  aiAccuracy: number;
  wasteCategories: string[];
  rewardPoints: number;
  deviceLatitude?: number;
  deviceLongitude?: number;
  confirmedLatitude?: number;
  confirmedLongitude?: number;
  accuracyMeters?: number;
  capturedAt?: string;
  sizeCategory?: string;
}

export const getConfirmDummyData = (): ConfirmData => {
  return {
    citizenPhotoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop&q=80",
    address: "Jl. Sudirman No. 42, Jakarta Pusat",
    reportTime: "24 Okt 2023, 10:45 WIB",
    aiClassification: "Tumpukan Plastik",
    aiAccuracy: 98,
    wasteCategories: ["Plastik", "Logam"],
    rewardPoints: 50,
    deviceLatitude: -6.2,
    deviceLongitude: 106.8,
    confirmedLatitude: -6.2,
    confirmedLongitude: 106.8,
    accuracyMeters: 18,
    capturedAt: new Date().toISOString(),
  };
};
