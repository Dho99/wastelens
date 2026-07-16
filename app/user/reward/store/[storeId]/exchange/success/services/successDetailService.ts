export interface ExchangeSuccessDetail {
  productName: string;
  productPrice: number;
  productImageUrl: string;
  merchantName: string;
  timestampText: string;
  transactionId: string;
  tipsDescription: string;
}

export const getExchangeSuccessDummyData = (): ExchangeSuccessDetail => {
  return {
    productName: "Minyak Goreng 1L",
    productPrice: 800,
    productImageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80", // olive oil bottle
    merchantName: "IndoFresh Mart",
    timestampText: "24 Okt 2023, 14:25",
    transactionId: "WL-RED-8823",
    tipsDescription: "Gunakan botol bekas minyak goreng ini sebagai pot tanaman gantung untuk taman vertikal di rumah Anda!"
  };
};
