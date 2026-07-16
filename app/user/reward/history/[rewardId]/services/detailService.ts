export interface RedemptionDetail {
  id: string;
  itemName: string;
  itemPrice: number;
  itemImageUrl: string;
  status: 'Selesai' | 'PROSES' | 'BATAL';
  merchantName: string;
  timestampText: string;
  transactionId: string;
  storeLocation: string;
  validUntil: string;
  tipsDescription: string;
}

export const getRedemptionDetailDummyData = (rewardId: string): RedemptionDetail => {
  return {
    id: rewardId || "hist-1",
    itemName: "Minyak Goreng 1L",
    itemPrice: 1200,
    itemImageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80", // olive oil bottle
    status: "Selesai",
    merchantName: "IndoFresh Mart",
    timestampText: "24 Okt 2023, 14:25",
    transactionId: "WL-RED-8823",
    storeLocation: "IndoFresh Mart - Sudirman",
    validUntil: "Hingga 31 Des 2023",
    tipsDescription: "Setelah habis digunakan, jangan buang botolnya! Cuci bersih dan bawa kembali ke bank sampah terdekat untuk mendapatkan poin tambahan."
  };
};
