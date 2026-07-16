export interface ExchangeTransaction {
  productName: string;
  productImageUrl: string;
  isAvailable: boolean;
  userBalance: number;
  productPrice: number;
  merchantName: string;
  method: string;
}

export const getExchangeDummyData = (): ExchangeTransaction => {
  return {
    productName: "Minyak Goreng 1L",
    productImageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80", // olive oil bottle
    isAvailable: true,
    userBalance: 1250,
    productPrice: 800,
    merchantName: "IndoFresh Mart",
    method: "Ambil di Tempat"
  };
};
