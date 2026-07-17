export interface ConfirmData {
  citizenPhotoUrl: string;
  address: string;
  mapPreviewUrl: string;
  reportTime: string;
  aiClassification: string;
  aiAccuracy: number;
  wasteCategories: string[];
  rewardPoints: number;
}

export const getConfirmDummyData = (): ConfirmData => {
  return {
    citizenPhotoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop&q=80", // street trash
    address: "Jl. Sudirman No. 42, Jakarta Pusat",
    mapPreviewUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80", // map placeholder
    reportTime: "24 Okt 2023, 10:45 WIB",
    aiClassification: "Tumpukan Plastik",
    aiAccuracy: 98,
    wasteCategories: ["Plastik", "Logam"],
    rewardPoints: 50
  };
};
