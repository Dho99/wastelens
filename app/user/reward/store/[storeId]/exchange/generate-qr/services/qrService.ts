export interface QrRedemptionDetail {
  merchantName: string;
  itemName: string;
  transactionId: string;
  durationSeconds: number;
}

export const getQrDummyData = (): QrRedemptionDetail => {
  return {
    merchantName: "IndoFresh Mart",
    itemName: "Minyak Goreng 1L",
    transactionId: "TRX-99210452",
    durationSeconds: 300 // 5 minutes timer
  };
};
