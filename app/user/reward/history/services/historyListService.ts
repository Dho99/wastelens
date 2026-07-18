export interface HistoryRedeemItem {
  id: string;
  title: string;
  status: 'BERHASIL' | 'KADALUARSA' | 'PROSES';
  merchantName: string;
  merchantType: 'STORE' | 'COFFEE' | 'PUBLIC' | 'PARTNER';
  timestampText: string;
  coinsSpent: number;
  imageUrl?: string;
}

export interface HistoryGroup {
  monthYear: string;
  items: HistoryRedeemItem[];
}


