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


